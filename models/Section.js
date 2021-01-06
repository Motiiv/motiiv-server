module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Section",
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      adminCheck: {
        type: DataTypes.BOOLEAN,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
