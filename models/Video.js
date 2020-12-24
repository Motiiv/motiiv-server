module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Video",
    {
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnailImageUrl: {
        type: DataTypes.STRING(100),
      },
      fileUrl: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      author: {
        type: DataTypes.STRING(30),
      },
      sourceUrl: {
        type: DataTypes.STRING(400),
      },
      viewCount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    },
  );
};
