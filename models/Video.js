const { INTEGER } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Video",
    {
      videoUrl: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      thumbnailImageUrl: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      viewCount: {
        type: DataTypes.INTEGER,
      },
      videoLength: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      channelName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      videoGif: {
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
