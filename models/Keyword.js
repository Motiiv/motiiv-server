module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Keyword",
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
