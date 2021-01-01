const { User, Video } = require("../models");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const axios = require("axios");
const qs = require("qs");
const {
  KAKAO_ID,
  KAKAO_SECRET,
  KAKAO_REDIRECT_URI,
} = require("../config/kakao");

// TODO: populate Videos
// TODO: Cleanup Response data
// TODO: Distinguish unique fields
module.exports = {
  kakaoLogin: (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

    return res.redirect(kakaoAuthUrl);
  },
  kakaoLoginCallback: async (req, res) => {
    const { code } = req.query;
    let tokenResponse;
    try {
      tokenResponse = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          grant_type: "authorization_code",
          client_id: KAKAO_ID,
          client_secret: KAKAO_SECRET,
          redirect_uri: KAKAO_REDIRECT_URI,
          code,
        }),
      });
    } catch (error) {
      // TODO: Cleanup
      console.log(error);
      return res.json(error.data);
    }
    console.info("==== tokenResponse.data ====");
    console.log(tokenResponse.data);

    const { access_token } = tokenResponse.data;

    let userResponse;
    try {
      userResponse = await axios({
        method: "GET",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    } catch (error) {
      // TODO: Cleanup
      console.log(error);
      return res.json(error.data);
    }
    console.info("==== userResponse.data ====");
    const userData = userResponse.data;
    console.log(userData);
    const snsId = userData.id;
    const resultUser = await User.findOne({
      where: { snsId, socialType: "kakao" },
    });
    if (resultUser) {
      const { accessToken } = await jwt.sign(resultUser);
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.KAKAO_LOGIN_SUCCESS, {
          resultUser,
          accessToken,
        }),
      );
    } else {
      const newUser = await User.create({
        name: userData.kakao_account.profile.nickname,
        snsId,
        socialType: "kakao",
      });
      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.CREATE_USER_SUCCESS,
            newUser,
          ),
        );
    }
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
        attributes: ["id", "name", "snsId", "socialType"],
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
