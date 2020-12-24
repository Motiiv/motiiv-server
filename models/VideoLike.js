const { User, Video } = require("./index");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "VideoLike",
    {
      VideoId: {
        type: DataTypes.INTEGER,
        reference: {
          model: Video,
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        reference: {
          model: User,
          key: "id",
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
