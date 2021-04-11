const config = require('../config');

const def = {
	username: config.db.username,
	password: config.db.password,
	database: config.db.database || 'spotify-web-widget',
	host: config.db.hostname || 'localhost',
	port: config.db.port || 3306,
	dialect: "mysql",
	migrationStorageTableName: "migrations",
	define: {
		timestamps: true,
	},
	logging: function (query, time) {},
	benchmark: true,
};

module.exports = {
	development: {
		...def,
	},
	production: {
		...def,
	}
};
