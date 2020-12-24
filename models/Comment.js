module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Comment",
    {
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
