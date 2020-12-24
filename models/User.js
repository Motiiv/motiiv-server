module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "local",
      },
      snsId: {
        type: DataTypes.STRING(50),
        allowNull: true,
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
