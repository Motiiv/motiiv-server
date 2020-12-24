module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      profileImageUrl: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
