const express = require('express');
const router = express.Router();
const async = require('async');
const _ = require('lodash');

const {User, UserSetting} = require('../../../db/models');

router.use(function (req, res, next) {
	if (!req.user) return next(403);

	next();
});

router.post('/', async function (req, res, next) {
	const user = req.user;
	const values = _.pick(req.body, ['animation']);

	await async.eachOf(values, async (value, key) => {
		const setting = await UserSetting.findOrCreate({
			where: {
				key,
				userId: req.user.id,
			}
		})
			.then(([setting]) => setting);

		return setting.update({
			value,
		});
	});

	await user.reload();

	const settings = user.get({plain: true}).settings;

	res.json(settings);

});

module.exports = router;
