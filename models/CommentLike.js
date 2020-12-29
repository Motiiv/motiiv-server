const User = require("./User");
const Comment = require("./Comment");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "CommentLike",
    {
      CommentId: {
        type: DataTypes.INTEGER,
        reference: {
          model: Comment,
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
