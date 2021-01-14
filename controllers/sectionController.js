const { Section, Video, Video_Section } = require("../models");
// const crypto = require("../modules/crypto");
const bcrypt = require("bcrypt");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");

module.exports = {
  createSection: async (req, res) => {
    const { title, subtitle } = req.body;
    if (!title) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const sectionExists = await Section.findOne({ where: { title } });
      if (sectionExists) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(statusCode.CONFLICT, responseMessage.ALREADY_SECTION),
          );
      }
      const section = await Section.create({ title, subtitle });

      const { createdAt, updatedAt, ...sectionData } = section.dataValues;

      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_SECTION_SUCCESS,
            sectionData,
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

  getAllSections: async (req, res) => {
    try {
      const sections = await Section.findAll({
        attributes: ["id", "title", "subtitle", "hide"],
      });
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ALL_SECTIONS_SUCCESS,
            sections,
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

  getOneSection: async (req, res) => {
    const { sectionId } = req.params;
    try {
      const section = await Section.findOne({
        where: { id: sectionId },
        attributes: ["id", "title", "subtitle", "hide"],
        include: [
          {
            model: Video,
            as: "SectionVideos",
            attributes: [
              "id",
              "title",
              "description",
              "channelName",
              "videoUrl",
              "viewCount",
              "videoLength",
              "createdAt",
            ],
            through: { attributes: [] },
          },
        ],
      });
      if (!section) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(
              statusCode.NOT_FOUND,
              responseMessage.GET_ONE_SECTION_FAIL,
            ),
          );
      }
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ONE_SECTION_SUCCESS,
            section,
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

  updateSection: async (req, res) => {
    const { sectionId } = req.params;
    const { newTitle, newSubtitle } = req.body;
    console.log(newSubtitle);
    if (!newTitle) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const section = await Section.findOne({
        where: { id: sectionId },
      });
      if (!section) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(
              statusCode.NOT_FOUND,
              responseMessage.GET_ONE_SECTION_FAIL,
            ),
          );
      }
      const sectionNameExists = await Section.findOne({
        where: { title: newTitle },
      });
      if (sectionNameExists) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(
              statusCode.CONFLICT,
              responseMessage.ALREADY_SECTION_TITLE,
            ),
          );
      }
      section.title = newTitle;
      section.subtitle = newSubtitle || section.subtitle;
      await section.save();
      const { createdAt, updatedAt, ...sectionData } = section.dataValues;
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.UPDATE_SECTION_SUCCESS,
            sectionData,
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

  deleteSection: async (req, res) => {
    const { sectionId } = req.params;
    try {
      const section = await Section.findOne({ where: { id: sectionId } });
      if (!section) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ONE_SECTION_FAIL,
            ),
          );
      }
      await section.destroy();
      const { createdAt, updatedAt, ...sectionData } = section.dataValues;
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.DELETE_SECTION_SUCCESS, {
          deletedSection: sectionData,
        }),
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

  addVideoToSection: async (req, res) => {
    const { sectionId } = req.params;
    const { videoId } = req.body;
    if (!videoId) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const video = await Video.findOne({ where: { id: videoId } });
      if (!video) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(statusCode.NOT_FOUND, responseMessage.GET_ONE_VIDEO_FAIL),
          );
      }
      const section = await Section.findOne({ where: { id: sectionId } });
      if (!section) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ONE_SECTION_FAIL,
            ),
          );
      }
      const [_, created] = await Video_Section.findOrCreate({
        where: { VideoId: videoId, SectionId: sectionId },
      });
      if (!created) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(
              statusCode.CONFLICT,
              responseMessage.DUPLICATE_VIDEO_IN_THE_SECTION,
            ),
          );
      }

      const { createdAt, updatedAt, ...addedVideo } = video.dataValues;
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.ADD_VIDEO_TO_SECTION_SUCCESS,
            addedVideo,
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
  removeVideoFromSection: async (req, res) => {
    const { sectionId } = req.params;
    const { videoId } = req.body;
    if (!videoId) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const video = await Video.findOne({ where: { id: videoId } });
      if (!video) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(statusCode.NOT_FOUND, responseMessage.GET_ONE_VIDEO_FAIL),
          );
      }
      const section = await Section.findOne({ where: { id: sectionId } });
      if (!section) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ONE_SECTION_FAIL,
            ),
          );
      }
      const sectionVideo = await Video_Section.findOne({
        where: { SectionId: sectionId, VideoId: videoId },
      });
      if (!sectionVideo) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(
            util.fail(
              statusCode.NOT_FOUND,
              responseMessage.NO_SUCH_VIDEO_IN_THE_SECTION,
            ),
          );
      }
      await sectionVideo.destroy();
      const { createdAt, updatedAt, ...removedVideo } = video.dataValues;
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.REMOVE_VIDEO_FROM_SECTION_SUCCESS,
            { removedVideo },
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
};
