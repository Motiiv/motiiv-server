module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Job",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    { freezeTableName: true },
  );
};
