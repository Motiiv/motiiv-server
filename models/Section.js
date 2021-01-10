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
      hide: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
