const { Video, User } = require("../models");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");

module.exports = {
  createVideo: async (req, res) => {
    const { title, contents, fileUrl } = req.body;
    if (!title) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    const { id: userId } = req.user;

    try {
      const user = await User.findOne({ where: { id: userId } });
      const video = await Video.create({
        title,
        contents,
        fileUrl,
      });

      await user.addVideo(video);
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_VIDEO_SUCCESS,
            video,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },
  getAllVideos: async (req, res) => {
    try {
      const videos = await Video.findAll();
      if (!videos) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ALL_VIDEOS_FAIL,
            ),
          );
      }

      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ALL_VIDEOS_SUCCESS,
            videos,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },

  getOneVideo: async (req, res) => {
    const { videoId } = req.params;

    try {
      const video = await Video.findOne({
        where: { id: videoId },
      });
      if (!video) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ONE_VIDEO_FAIL,
            ),
          );
      }
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ONE_VIDEO_SUCCESS,
            video,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },
  deleteVideo: async (req, res) => {
    const { videoId } = req.params;
    try {
      await Video.destroy({
        where: { id: videoId },
      });
      res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, responseMessage.DELETE_VIDEO_SUCCESS),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },
};
