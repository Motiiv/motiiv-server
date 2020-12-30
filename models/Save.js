const User = require("./User");
const Video = require("./Video");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Save",
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
