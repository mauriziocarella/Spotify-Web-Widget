const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		displayName: DataTypes.STRING,
		settings: {
			type: DataTypes.VIRTUAL,
			get: function () {
				const settings = _.mapValues(_.keyBy(this.get('_settings'), 'key'), 'value');
				return _.reduce(settings, (obj, value, key) => {
					_.set(obj, key, value);

					return obj;
				}, {});
			},
		}
	}, {
		tableName: 'users',
		hooks: {
			beforeCreate: async function(user) {
				if (user.changed('password')) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			},
			beforeUpdate: async function(user) {
				if (user.changed('password')) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			}
		},
	});

	User.setup = function (models) {
		User.addScope('defaultScope', {
			attributes: {
				exclude: ['password'],
			},
			include: [
				{
					model: models.SpotifyCredentials,
					as: 'spotify',
				},
				{
					model: models.UserSetting,
					as: '_settings',
				},
			],
		});
	};

	User.associate = function (models) {
		User.hasOne(models.SpotifyCredentials, {
			as: 'spotify',
			foreignKey: 'userId'
		});
		User.hasMany(models.UserSetting, {
			as: '_settings',
		});
	};

	User.prototype.validPassword = async function(password) {
		return await bcrypt.compare(password, this.password);
	};

	return User;
};
