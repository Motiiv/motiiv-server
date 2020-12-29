const { Video, Section } = require("./index");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Video_Section",
    {
      VideoId: {
        type: DataTypes.INTEGER,
        reference: {
          model: Video,
          key: "id",
        },
      },
      SectionId: {
        type: DataTypes.INTEGER,
        reference: {
          model: Section,
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
