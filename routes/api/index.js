const express = require('express');
const cors = require('cors');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const _ = require('lodash');

const config = require('../../config');

const {User} = require('../../db/models');

router.use(cors());
router.use(async (req, res, next) => {
	if (req.session.user) {
		req.user = await User.findByPk(req.session.user.id);
	}

	req.spotify = new SpotifyWebApi({
		clientId: config.spotify.client_id,
		clientSecret: config.spotify.secret,
		redirectUri: `https://${req.get('host')}${config.app.public_url || ''}/api/auth/spotify/callback`,
	});

	next();
});

router.use('/auth', require('./auth'));
router.use('/settings', require('./settings'));

router.get('/widget/:id/:type?', async function (req, res, next) {
	const id = req.params.id;
	const type = req.params.type || 'text';

	const spotify = req.spotify;

	const user = await User.findOne({
		where: {
			id,
		},
	});

	const settings = user.settings;

	if (!user) return next(404);
	if (_.isEmpty(user.spotify)) return next(403);

	new Promise((resolve, reject) => {
		spotify.setAccessToken(user.spotify.access_token);
		spotify.setRefreshToken(user.spotify.refresh_token);

		const req = () => {
			return spotify.getMyCurrentPlaybackState()
				.then(({body, status_code}) => {
					if (status_code === 204) return resolve({is_playing: false});

					if (_.isObject(body)) {
						return resolve(body);
					}
					else {
						return reject(500);
					}
				})
				.catch(function(err) {
					switch(err.statusCode) {
						case 401: {
							return spotify.refreshAccessToken()
								.then(({body}) => {
									spotify.setAccessToken(body.access_token);
									return req();
								})
								.catch((err) => reject(err));
						}

						default: {
							return reject(err);
						}
					}
				});
		};

		return req();
	})
		.then(({is_playing = false, progress_ms = 0, item = {}}) => ({
			is_playing,
			item: {
				// _item: item,
				artist: _.join(_.compact(_.map(_.get(item, 'artists', []), 'name')), ' & ') || '',
				title: _.get(item, 'name', '') || '',
				cover: _.get(_.first(_.orderBy(_.get(item, 'album.images', []), ['height'], ['desc'])), 'url'),
				duration: _.get(item, 'duration_ms', 0),
				progress: progress_ms || 0,
			},
		}))
		.then(({is_playing, item}) => {
			const text = _.template('<%=artist%> - <%=title%>')({
				title: item.artist,
				artist: item.title,
			});

			return ({
				is_playing,
				item: {
					...item,
					text,
				}
			});
		})
		.then(({is_playing, item}) => {
			switch(type) {
				case 'text': {
					res.type('text');

					//TODO Check if user wants to always show metadata, even if not playing
					if (is_playing) {
						return res.send(item.text);
					}

					return res.send(_.get(user, 'settings.not_playing_placeholder', ''));
				}

				case 'json':
				default: {
					res.json({is_playing, item, settings})
				}
			}
		})
		.catch((err) => next(err));
});

router.use((err, req, res, next) => {
	const error = {
		status: 500,
		message: 'error',
	};

	if (_.isInteger(err)) {
		error.status = err;

		switch (err) {
			case 401: error.message = 'unauthorized'; break;
			case 403: error.message = 'forbidden'; break;
			case 500: error.message = 'error'; break;
		}
	}
	else if (_.isString(err)) {
		error.message = err;
	}
	else {
		console.error(err);
	}

	res.status(error.status);
	res.json(error);
});

module.exports = router;
