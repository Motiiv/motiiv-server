const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
aws.config.loadFromPath(__dirname + "/../config/s3.json");

const s3 = new aws.S3();
const multerProfileImage = multer({
  storage: multerS3({
    s3,
    bucket: "sopt-27-wooyeong",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        "motiiv/user/profileImage/" +
          Date.now() +
          "." +
          file.originalname.split(".").pop(),
      );
    },
  }),
});

module.exports = {
  uploadProfileImage: multerProfileImage.single("imageFile"),
  // uploadVideo: multerVideo.single("videoFile"),
};
