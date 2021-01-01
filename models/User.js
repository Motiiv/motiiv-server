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
        allowNull: true,
      },
      job: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      socialType: {
        type: DataTypes.STRING(30),
        // allowNull: false,
      },
      snsId: {
        type: DataTypes.STRING(100),
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
