const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const {User, SpotifyCredentials} = require('../../../db/models');

const config = require('../../../config');

const api = () => new SpotifyWebApi({
	clientId: config.spotify.client_id,
	clientSecret: config.spotify.secret,
	redirectUri: `${config.app.public_url}/api/auth/spotify/callback`,
});
const spotify = api();

router.get('/spotify/callback', async function (req, res, next) {
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
router.get('/spotify', function (req, res, next) {
	const url = spotify.createAuthorizeURL(['user-read-private', 'user-read-email', 'user-read-currently-playing', 'user-read-playback-state']);
	res.redirect(url);
});

router.get('/me', function (req, res, next) {
	if (req.user) {
		res.json(req.user.get());
	}
	else {
		next(403);
	}
});
router.post('/login', function (req, res, next) {
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
router.post('/register', function (req, res, next) {
	User.create({
		email: req.body.email,
		password: req.body.password,
	})
		.then((user) => {
			res.json(user);
		});
});

module.exports = router;
