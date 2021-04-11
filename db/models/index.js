'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const config = require('../../config');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, require('../config')[config.env]);

const db = {};
fs
	.readdirSync(__dirname)
	.filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize);
		db[model.name] = model;
	});

Object.keys(db).forEach((model) => {
	if (db[model].setup) {
		db[model].setup(db);
	}
	if (db[model].associate) {
		db[model].associate(db);
	}
	if (db[model].scopes) {
		db[model].scopes(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
