const { Video, Tag } = require("./index");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Video_Tag",
    {
      VideoId: {
        type: DataTypes.INTEGER,
        reference: {
          model: Video,
          key: "id",
        },
      },
      TagId: {
        type: DataTypes.INTEGER,
        reference: {
          model: Tag,
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
