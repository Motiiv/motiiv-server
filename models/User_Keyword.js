const User = require("./User");
const Keyword = require("./Keyword");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User_Keyword",
    {
      UserId: {
        type: DataTypes.INTEGER,
        reference: {
          model: User,
          key: "id",
        },
      },
      KeywordId: {
        type: DataTypes.INTEGER,
        reference: {
          model: Keyword,
          key: "id",
        },
      },
    },
    {
      freezeTableName: true,
    },
  );
};
