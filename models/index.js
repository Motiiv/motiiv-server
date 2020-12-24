const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./User")(sequelize, Sequelize);
db.Video = require("./Video")(sequelize, Sequelize);
db.Comment = require("./Comment")(sequelize, Sequelize);
db.CommentLike = require("./CommentLike")(sequelize, Sequelize);
db.VideoLike = require("./VideoLike")(sequelize, Sequelize);
db.Tag = require("./Tag")(sequelize, Sequelize);
db.Video_Tag = require("./Video_Tag")(sequelize, Sequelize);

// 1 : N    User : Video
db.User.hasMany(db.Video, { onDelete: "CASCADE" });
db.Video.belongsTo(db.User);

// N : M    User : Video => VideoLike
db.User.belongsToMany(db.Video, { through: "VideoLike", as: "LikedVideos" });
db.Video.belongsToMany(db.User, { through: "VideoLike", as: "VideoLikers" });

// 1 : N    User : Comment
db.User.hasMany(db.Comment, { onDelete: "CASCADE" });
db.Comment.belongsTo(db.User);

// N : M    User : Comment => CommentLike
db.User.belongsToMany(db.Comment, {
  through: "CommentLike",
  as: "LikedComments",
});
db.Comment.belongsToMany(db.User, {
  through: "CommentLike",
  as: "CommentLikers",
});

// 1 : N    Video : Comment
db.Video.hasMany(db.Comment, { onDelete: "CASCADE" });
db.Comment.belongsTo(db.Video);

// N : M    Video : Tag => Video_Tag
db.Video.belongsToMany(db.Tag, { through: "Video_Tag", as: "TaggedVideos" });
db.Tag.belongsToMany(db.Video, { through: "Video_Tag", as: "VideoTags" });

module.exports = db;
