module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Tag",
    {
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    { freezeTableName: true, timestamps: true },
  );
};
