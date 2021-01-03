module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Workspace",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(400),
        allowNull: false,
      },
      logoUrl: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
