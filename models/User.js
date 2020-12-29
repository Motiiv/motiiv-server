module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      profileImageUrl: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      job: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      socialType: {
        type: DataTypes.STRING(30),
        // allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
