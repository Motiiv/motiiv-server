module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Viewhistory",
        {
            videoId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: true,
        },
    );
};
