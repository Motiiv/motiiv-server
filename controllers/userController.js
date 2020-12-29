const passport = require("passport");
const { User, Video } = require("../models");
// const crypto = require("../modules/crypto");
const bcrypt = require("bcrypt");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");

// TODO: populate rooms
module.exports = {
  signup: async (req, res, next) => {
    const { email, username, password } = req.body;
    try {
      const alreadyUser = await User.find({ where: { email } });
      if (alreadyUser) {
        return res
          .status(statusCode.CONFLICT)
          .send(util.fail(statusCode.CONFLICT, responseMessage.ALREADY_USER));
      }
      const hashedPassword = await bcrypt(password, 12);
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_USER_SUCCESS,
            newUser,
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

  login: async (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        console.log("Login Error");
        return res.redirect("/");
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect("/");
      })(req, res, next);
    });
  },

  logout: async (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  },

  mypage: async (req, res, next) => {
    const { id } = req.user;
    try {
      const myUploads = await Video.findAll({
        where: { uploaderId: id },
      });
      const myComments = await Comments.findAll({
        where: { UserId: id },
      });
      let videosWithMyComment = [];

      let likedVideos = [];

      const videoLike = await VideoLike.findAll({ where: { UserId: id } });

      myComments.map(async (comment) => {
        const video = await Video.findOne({ where: { id: comment.VideoId } });
        videosWithMyComment.push(video);
      });

      videoLike.map(async (vl) => {
        const video = await Video.findOne({ where: { id: vl.id } });
        likedVideos.push(video);
      });

      res
        .status(statusCode.OK)
        .send(
          statusCode.OK,
          responseMessage.GET_MY_PAGE_SUCCESS,
          myUploads,
          videosWithMyComment,
          likedVideos,
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR,
        );
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "username"],
      });
      if (!users) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ALL_USERS_FAIL,
            ),
          );
      }
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ALL_USERS_SUCCESS,
            users,
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

  // TODO: user verification
  getOneUser: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findOne({
        where: { id: userId },
      });
      if (!user) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(
            util.fail(
              statusCode.BAD_REQUEST,
              responseMessage.GET_ONE_USER_FAIL,
            ),
          );
      }
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.GET_ONE_USER_SUCCESS,
            user,
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

  updateUser: async (req, res) => {
    const { email, userName, password, image } = req.body;
    const { id } = req.params;
    try {
      const salt = crypto.randomBytes(64).toString("base64");

      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("base64");
      const updatedUser = await User.update(
        {
          email,
          password: hashedPassword,
          userName,
          salt,
          image,
        },
        {
          where: {
            id,
          },
        },
      );
      if (!updatedUser) {
        console.log("존재하지 않는 아이디입니다.");
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
      }
      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.UPDATE_USER_SUCCESS,
            updatedUser,
          ),
        );
    } catch (error) {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            responseMessage.UPDATE_USER_FAIL,
          ),
        );
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      await User.destroy({
        where: { id: userId },
      });
      res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, responseMessage.DELETE_USER_SUCCESS));
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
