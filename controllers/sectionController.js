const { Section, Video } = require("../models");
// const crypto = require("../modules/crypto");
const bcrypt = require("bcrypt");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");

module.exports = {
  // TODO: JWT TOKEN
  // TODO: Clean up response data
  // TODO: Limit number of videos in each section
  // TODO: Sorting options
  createSection: async (req, res) => {
    const { title, subtitle } = req.body;
    if (!title || !subtitle) {
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
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_SECTION_SUCCESS,
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

  getAllSections: async (req, res) => {
    try {
      const sections = await Section.findAll();
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
      const section = await Section.findOne({ where: { id: sectionId } });
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
    if (!newTitle) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const section = await Section.findOne({
        where: { id: sectionId },
      });
      if (section.title === newTitle) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(statusCode.CONFLICT, responseMessage.SAME_SECTION_TITLE),
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
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.UPDATE_ADMIN_USERNAME_SUCCESS,
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
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.DELETE_SECTION_SUCCESS, {
          deletedSection: section,
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
};
