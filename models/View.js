const User = require("./User");
const Video = require("./Video");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "View",
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
            UserCnt: {
                type: DataTypes.INTEGER,
                allowNull: true,
            }
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
};
