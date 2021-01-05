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
        defaultValue:
          "https://sopt-27-wooyeong.s3.ap-northeast-2.amazonaws.com/motiiv/user/workspace/favicon_new.png",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
