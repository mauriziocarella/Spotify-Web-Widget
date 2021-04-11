const express = require('express');
const cors = require('cors');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const _ = require('lodash');

const config = require('../../config');

const {User, SpotifyCredentials} = require('../../db/models');

const api = () => new SpotifyWebApi({
	clientId: config.spotify.client_id,
	clientSecret: config.spotify.secret,
	redirectUri: `${config.app.public_url}/api/auth/spotify/callback`,
});
const spotify = api();

router.use(cors());
router.use(async (req, res, next) => {
	if (req.session.user) {
		req.user = await User.findByPk(req.session.user.id);
	}

	next();
});


router.get('/auth/spotify/callback', async function (req, res, next) {
	const code = req.query.code;

	const {profile, body} = await spotify.authorizationCodeGrant(code)
		.then(function({body}) {
			spotify.setAccessToken(body.access_token);
			spotify.setRefreshToken(body.refresh_token);

			return spotify.getMe()
				.then(({body: profile}) => ({profile, body}));
		});

	const user = await User.findOrCreate({
		where: {
			email: profile.email,
		},
	})
		.then(async ([user]) => user);

	await user.update({
		displayName: profile.display_name,
	});

	if (user.spotify) {
		user.spotify.access_token = body.access_token;
		user.spotify.refresh_token = body.refresh_token;
		await user.spotify.save()
	}
	else {
		await SpotifyCredentials.create({
			userId: user.id,
			access_token: body.access_token,
			refresh_token: body.refresh_token,
		});
	}

	await user.reload();

	req.session.user = {
		id: user.id,
	};
	res.redirect(config.app.public_url);
});
router.get('/auth/spotify', function (req, res, next) {
	const url = spotify.createAuthorizeURL(['user-read-private', 'user-read-email', 'user-read-currently-playing', 'user-read-playback-state']);
	res.redirect(url);
});

router.get('/auth/me', function (req, res, next) {
	if (req.user) {
		res.json(req.user.get());
	}
	else {
		next(403);
	}
});
router.post('/auth/login', function (req, res, next) {
	User.findOne({
		where: {
			email: req.body.email,
		}
	})
		.then((user) => {
			if (user) {
				user.validPassword(req.body.password)
					.then((result) => {
						if (result) {
							req.session.user = {
								id: user.id,
							};
							res.json({
								success: result,
							});
						}
						else {
							next(404);
						}
					})
					.catch((err) => next(err));
			}
			else {
				next(404);
			}
		})
		.catch((err) => next(err));
});
router.post('/auth/register', function (req, res, next) {
	User.create({
		email: req.body.email,
		password: req.body.password,
	})
		.then((user) => {
			res.json(user);
		});
});
router.get('/widget/:id/:type?', function (req, res, next) {
	const id = req.params.id;
	const type = req.params.type || 'text';

	User.findOne({
		where: {
			id,
		},
	})
		.then((user) => {
			if (_.isEmpty(user)) return next(404);
			if (_.isEmpty(user.spotify)) return next(403);

			const spotify = api();

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
							res.json({is_playing, item})
						}
					}
				})
				.catch((err) => next(err));
		});
});


router.use((err, req, res, next) => {
	console.error('HTTP request failed', err);
	res.status(500);
	res.json({
		error: err,
	});
});

module.exports = router;
