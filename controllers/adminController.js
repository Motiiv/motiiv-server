const { Admin, Video } = require("../models");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { encrypt, encryptWithSalt } = require("../modules/crypto");
const crypto = require("../modules/crypto");

module.exports = {
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
      const { accessToken } = await jwt.sign(admin);
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.CREATE_ADMIN_SUCCESS, {
          id: admin.id,
          username: admin.username,
          adminToken: accessToken,
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

  adminLogin: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const admin = await Admin.findOne({
        where: { username },
      });

      const salt = admin.salt;
      const hashed = await encryptWithSalt(password, salt);
      if (hashed === admin.password) {
        const { accessToken } = await jwt.sign(admin);
        return res.status(statusCode.OK).send(
          util.success(statusCode.OK, responseMessage.LOGIN_ADMIN_SUCCESS, {
            id: admin.id,
            username: admin.username,
            adminToken: accessToken,
          }),
        );
      } else {
        return res
          .status(statusCode.FORBIDDEN)
          .send(
            util.fail(
              statusCode.FORBIDDEN,
              responseMessage.LOGIN_ADMIN_FAIL_PASSWORD,
            ),
          );
      }
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

  adminLogout: async (req, res) => {
    res
      .status(statusCode.OK)
      .clearCookie("adminToken")
      .send(util.success(statusCode.OK, responseMessage.LOGOUT_ADMIN_SUCCESS));
  },

  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.findAll({ attributes: ["id", "username"] });
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
    try {
      const admin = await Admin.findOne({
        where: { id: adminId },
        attributes: ["id", "username"],
      });
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
    const { admin } = req;
    const { newUsername } = req.body;
    if (!newUsername) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      if (admin.username === newUsername) {
        return res
          .status(statusCode.CONFLICT)
          .send(
            util.fail(
              statusCode.CONFLICT,
              responseMessage.SAME_ADMIN_USERNAME_AS_BEFORE,
            ),
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
            { id: admin.id, username: admin.username },
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
    const { admin } = req;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
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
            { id: admin.id, username: admin.username },
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
    const { admin } = req;
    try {
      const {
        password,
        salt,
        createdAt,
        updatedAt,
        ...deletedAdmin
      } = admin.dataValues;
      await admin.destroy({ where: { id: admin.id } });
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.DELETE_ADMIN_SUCCESS,
            deletedAdmin,
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
