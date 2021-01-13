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

// Standalone Tables
db.User = require("./User")(sequelize, Sequelize);
db.Video = require("./Video")(sequelize, Sequelize);
db.Section = require("./Section")(sequelize, Sequelize);
db.Tag = require("./Tag")(sequelize, Sequelize);
db.Workspace = require("./Workspace")(sequelize, Sequelize);
db.Admin = require("./Admin")(sequelize, Sequelize);
db.Keyword = require("./Keyword")(sequelize, Sequelize);
db.Job = require("./Job")(sequelize, Sequelize);

// Junction Tables
db.Save = require("./Save")(sequelize, Sequelize);
db.Like = require("./Like")(sequelize, Sequelize);
db.View = require("./View")(sequelize, Sequelize);

db.Video_Tag = require("./Video_Tag")(sequelize, Sequelize);
db.Video_Section = require("./Video_Section")(sequelize, Sequelize);
db.User_Keyword = require("./User_Keyword")(sequelize, Sequelize);

// N : M    User : Video => View
db.User.belongsToMany(db.Video, { through: "View", as: "ViewedVideos" });
db.Video.belongsToMany(db.User, { through: "View", as: "VideoViewer" });

// N : M    User : Video => Like
db.User.belongsToMany(db.Video, { through: "Like", as: "LikedVideos" });
db.Video.belongsToMany(db.User, { through: "Like", as: "VideoLikers" });

// N : M    User : Video => Save
db.User.belongsToMany(db.Video, { through: "Save", as: "SavedVideos" });
db.Video.belongsToMany(db.User, { through: "Save", as: "VideoSavers" });

// 1 : N    User : Workspace
db.User.hasMany(db.Workspace, { onDelete: "cascade" });
db.Workspace.belongsTo(db.User);

// N : M    User : Keyword
db.User.belongsToMany(db.Keyword, {
  through: "User_Keyword",
  as: "UserKeywords",
});
db.Keyword.belongsToMany(db.User, {
  through: "User_Keyword",
  as: "KeywordUsers",
});

// 1 : N    Job : User
db.Job.hasMany(db.User, { onDelete: "SET NULL" });
db.User.belongsTo(db.Job);

// N : M    Video : Tag => Video_Tag
db.Video.belongsToMany(db.Tag, { through: "Video_Tag", as: "VideoTags" });
db.Tag.belongsToMany(db.Video, { through: "Video_Tag", as: "TaggedVideos" });

// N : M    Video : Section => Video_Section
db.Video.belongsToMany(db.Section, {
  through: "Video_Section",
  as: "VideoSections",
});
db.Section.belongsToMany(db.Video, {
  through: "Video_Section",
  as: "SectionVideos",
});

// 1 : M    Video : Video_Section
db.Video.hasMany(db.Video_Section);
db.Video_Section.belongsTo(db.Video);

// 1 : M    Section : Video_Section
db.Section.hasMany(db.Video_Section);
db.Video_Section.belongsTo(db.Section);


// 1 : N    Keyword : Tag
db.Keyword.hasMany(db.Tag, { onDelete: "SET NULL" });
db.Tag.belongsTo(db.Keyword);

module.exports = db;