const sequelize = require("sequelize");
const ut = require("../modules/util");
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");
const {
  Comment,
  CommentLike,
  Section,
  Tag,
  User,
  Video_Section,
  Video_Tag,
  Video,
  VideoLike,
  Workspace,
} = require("../models");
const { success } = require("../modules/util");
// const { VERSION } = require('sequelize/types/lib/query-types');
const { post } = require("../routes");
const Op = sequelize.Op;

module.exports = {
  readAllPost: async (req, res) => {
    const filters = req.query.filters;
    try {
      const video = await Video.findAll({
        group: "id",
        attributes: [
          "id",
          "videoUrl",
          "title",
          "description",
          "thumbnailImageUrl",
          "viewCount",
          "videoLength",
          "channelName",
          [sequelize, fn("COUNT", "LikedVideos.VideoLike.VideoId"), "likeCnt"],
        ],
        include: [
          {
            model: User,
            as: "VideoLikers",
            attributes: [],
            through: { attributes: [] },
          },
        ],
      });

      return res
        .status(sc.OK)
        .send(ut(success(sc.OK, rm.GET_ALL_POST_SUCCESS, video)));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_ALL_POST_FAIL));
    }
  },

  /*
    exports.addComment = async (req, res, next) => {
        const video = await Video.findByPk(req.params.id);

        if (!video) {
            return next({
                message: `No video found for ID - ${req.params.id}`,
                statusCode: 404,
            });
        }

        const comment = await Comment.create({
            text: req.body.text,
            userId: req.user.id,
            videoId: req.params.id,
        });

        const User = {
            id: req.user.id,
            avatar: req.user.avatar,
            username: req.user.username,
        };

        comment.setDataValue("User", User);

        res.status(200).json({ success: true, data: comment });
    };
    */
};
