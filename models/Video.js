module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Video",
    {
      videoUrl: {
        type: DataTypes.STRING(400),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnailImageUrl: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      viewCount: {
        type: DataTypes.INTEGER,
      },
      videoLength: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      channelName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
