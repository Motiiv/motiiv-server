const passport = require("passport");
const { Admin, Video } = require("../models");
// const crypto = require("../modules/crypto");
const bcrypt = require("bcrypt");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { encrypt } = require("../modules/crypto");

module.exports = {
  createAdmin: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE);
    }

    try {
      const usernameExists = await Admin.findOne({ where: { username } });
      if (usernameExists) {
        return res
          .status(statusCode.CONFLICT)
          .send(statusCode.CONFLICT, responseMessage.ALREADY_USERNAME_ADMIN);
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
};
