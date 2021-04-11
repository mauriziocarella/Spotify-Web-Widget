module.exports = (sequelize, DataTypes) => {
	const SpotifyCredentials = sequelize.define('SpotifyCredentials', {
		access_token: DataTypes.STRING,
		refresh_token: DataTypes.STRING,
		userId: DataTypes.INTEGER,
	}, {
		tableName: 'spotify_credentials',
	});

	SpotifyCredentials.associate = function (models) {
		SpotifyCredentials.User = SpotifyCredentials.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'userId',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
	};
	return SpotifyCredentials;
};
