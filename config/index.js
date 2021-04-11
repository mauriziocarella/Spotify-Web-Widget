const path = require('path');

require('dotenv').config({
	path: path.resolve(__dirname, '..', '.env')
});

module.exports = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	app: {
		secret: process.env.APP_SECRET || '',
		public_url: process.env.PUBLIC_URL,
	},
	db: {
		database: process.env.MYSQL_DATABASE || 'spotify-web-widget',
		username: process.env.MYSQL_USER || 'spotify-web-widget',
		password: process.env.MYSQL_PASSWORD || '',
		hostname: process.env.MYSQL_HOST || 'localhost',
		port: process.env.MYSQL_PORT || '3306',
	},
	spotify: {
		client_id: process.env.APP_SPOTIFY_CLIENT_ID,
		secret: process.env.APP_SPOTIFY_SECRET,
	},
};
