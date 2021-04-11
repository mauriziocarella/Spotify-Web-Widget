module.exports = (sequelize, DataTypes) => {
	const UserSetting = sequelize.define('UserSetting', {
		key: DataTypes.STRING,
		value: DataTypes.STRING,
		userId: DataTypes.INTEGER,
	}, {
		tableName: 'users_settings',
	});
	UserSetting.associate = function (models) {
		UserSetting.User = UserSetting.belongsTo(models.User, {
			as: 'user',
			foreignKey: 'userId',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
	};
	return UserSetting;
};
