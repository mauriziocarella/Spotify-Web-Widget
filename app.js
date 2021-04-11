const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const config = require('./config');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
	secret: config.app.secret,
	resave: false,
	saveUninitialized: true,
	// cookie: {
	// 	secure: true
	// },
}));

app.use('/', require('./routes'));

module.exports = app;
