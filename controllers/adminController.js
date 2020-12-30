const passport = require("passport");
const { Admin, Video } = require("../models");
// const crypto = require("../modules/crypto");
const bcrypt = require("bcrypt");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { encrypt } = require("../modules/crypto");
const crypto = require("../modules/crypto");

module.exports = {
  // TODO: JWT TOKEN
  // TODO: Clean up response data
  createAdmin: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }

    try {
      const usernameExists = await Admin.findOne({ where: { username } });
      if (usernameExists) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(
              statusCode.CONFLICT,
              responseMessage.ALREADY_USERNAME_ADMIN,
            ),
          );
      }
      const { salt, hashed } = await encrypt(password);
      const admin = await Admin.create({ username, password: hashed, salt });
      console.log(admin);
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_ADMIN_SUCCESS,
            admin,
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

  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.findAll();
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ALL_ADMINS_SUCCESS,
            admins,
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

  getOneAdmin: async (req, res) => {
    const { adminId } = req.params;
    if (!adminId) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const admin = await Admin.findOne({ where: { id: adminId } });
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ONE_ADMIN_SUCCESS,
            admin,
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

  updateAdminUsername: async (req, res) => {
    const { adminId } = req.params;
    const { newUsername } = req.body;
    try {
      const admin = await Admin.findOne({
        where: { id: adminId },
      });
      if (admin.username === newUsername) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(statusCode.CONFLICT, responseMessage.SAME_ADMIN_USERNAME),
          );
      }
      const usernameExists = await Admin.findOne({
        where: { username: newUsername },
      });
      if (usernameExists) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(
              statusCode.CONFLICT,
              responseMessage.ALREADY_USERNAME_ADMIN,
            ),
          );
      }
      admin.username = newUsername;
      await admin.save();
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.UPDATE_ADMIN_USERNAME_SUCCESS,
            admin,
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

  updateAdminPassword: async (req, res) => {
    const { adminId } = req.params;
    const { newPassword } = req.body;
    if (!adminId || !newPassword) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const admin = await Admin.findOne({ where: { id: adminId } });
      if (!admin) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ONE_ADMIN_FAIL,
            ),
          );
      }
      const { salt, hashed } = await crypto.encrypt(newPassword);
      admin.password = hashed;
      admin.salt = salt;
      await admin.save();
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.UPDATE_ADMIN_PASSWORD_SUCCESS,
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
  deleteAdmin: async (req, res) => {
    const { adminId } = req.params;
    try {
      const admin = await Admin.findOne(
        { where: { id: adminId } },
        { attributes: ["id", "username"] },
      );
      if (!admin) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ONE_ADMIN_FAIL,
            ),
          );
      }
      await admin.destroy({ where: { id: adminId } });
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.DELETE_ADMIN_SUCCESS, {
          deletedAdmin: admin,
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
