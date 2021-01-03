const {
  User,
  Video,
  Workspace,
  Keyword,
  User_Keyword,
  Job,
} = require("../models");
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
const {
  NAVER_ID,
  NAVER_SECRET,
  NAVER_STATE,
  NAVER_REDIRECT_URI,
} = require("../config/naver");

// TODO: populate Videos
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
    const snsId = userData.id;
    const resultUser = await User.findOne({
      where: { snsId, socialType: "kakao" },
    });
    if (resultUser) {
      const { accessToken } = await jwt.sign(resultUser);
      const { createdAt, updatedAt, ...userInfo } = resultUser.dataValues;
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.KAKAO_LOGIN_SUCCESS, {
          ...userInfo,
          accessToken,
        }),
      );
    } else {
      const newUser = await User.create({
        name: userData.properties.nickname,
        snsId,
        socialType: "kakao",
        profileImageUrl: userData.properties.profile_image,
      });
      const { accessToken } = await jwt.sign(newUser);
      const { createdAt, updatedAt, ...userInfo } = newUser.dataValues;
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.CREATE_USER_SUCCESS, {
          ...userInfo,
          accessToken,
        }),
      );
    }
  },

  naverLogin: (req, res) => {
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_ID}&redirect_uri=${NAVER_REDIRECT_URI}&response_type=code&state=${NAVER_STATE}`;
    return res.redirect(naverAuthUrl);
  },

  naverLoginCallback: async (req, res) => {
    const { code, state } = req.query;
    let tokenResponse;
    try {
      tokenResponse = await axios({
        method: "POST",
        url: "https://nid.naver.com/oauth2.0/token",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          grant_type: "authorization_code",
          client_id: NAVER_ID,
          client_secret: NAVER_SECRET,
          redirect_uri: NAVER_REDIRECT_URI,
          state,
          code,
        }),
      });
    } catch (error) {
      console.log(error);
      return res.json(error.data);
    }
    console.info("==== tokenResponse.data ====");

    const { access_token } = tokenResponse.data;

    let userResponse;
    try {
      userResponse = await axios({
        method: "GET",
        url: "https://openapi.naver.com/v1/nid/me",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      });
    } catch (error) {
      console.log(error);
      return res.json(error.data);
    }
    console.info("==== userResponse.data ====");
    const userData = userResponse.data;
    const snsId = userData.response.id;
    const resultUser = await User.findOne({
      where: { snsId, socialType: "naver" },
    });
    if (resultUser) {
      const { accessToken } = await jwt.sign(resultUser);
      const { createdAt, updatedAt, ...userInfo } = resultUser.dataValues;
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.NAVER_LOGIN_SUCCESS, {
          ...userInfo,
          accessToken,
        }),
      );
    } else {
      const newUser = await User.create({
        name: userData.response.name,
        snsId,
        socialType: "naver",
        profileImageUrl: userData.response.profile_image,
      });
      const { accessToken } = await jwt.sign(newUser);
      const { createdAt, updatedAt, ...userInfo } = newUser.dataValues;
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.CREATE_USER_SUCCESS, {
          ...userInfo,
          accessToken,
        }),
      );
    }
  },

  // TODO: Cleanup
  selectJobAndKeywords: async (req, res) => {
    const { id: UserId } = req.user;
    console.log(UserId);
    const { jobName, keywordValues } = req.body;
    if (!jobName || !keywordValues) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      for (i = 0; i < keywordValues.length; i++) {
        const keyword = await Keyword.findOne({
          where: { name: keywordValues[i] },
        });
        if (!keyword) {
          return res
            .status(statusCode.BAD_REQUEST)
            .send(
              util.fail(
                statusCode.BAD_REQUEST,
                responseMessage.NO_SUCH_KEYWORD,
              ),
            );
        }
        await User_Keyword.create({ UserId, KeywordId: keyword.id });
      }
      const job = await Job.findOne({ where: { name: jobName } });
      job.UserId = UserId;
      await job.save();
      const user = await User.findOne({
        where: { id: UserId },
        attributes: ["id", "name", "profileImageUrl", "socialType", "snsId"],
        include: [
          {
            model: Keyword,
            as: "UserKeywords",
            through: { attributes: [] },
          },
          {
            model: Job,
            attributes: ["id", "name"],
          },
        ],
      });

      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.SELECT_JOB_AND_KEYWORDS_SUCCESS,
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

  logout: async (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  },

  // mypage: async (req, res, next) => {
  //   const { id } = req.user;
  //   try {
  //     const myUploads = await Video.findAll({
  //       where: { uploaderId: id },
  //     });
  //     const myComments = await Comments.findAll({
  //       where: { UserId: id },
  //     });
  //     let videosWithMyComment = [];

  //     let likedVideos = [];

  //     const videoLike = await VideoLike.findAll({ where: { UserId: id } });

  //     myComments.map(async (comment) => {
  //       const video = await Video.findOne({ where: { id: comment.VideoId } });
  //       videosWithMyComment.push(video);
  //     });

  //     videoLike.map(async (vl) => {
  //       const video = await Video.findOne({ where: { id: vl.id } });
  //       likedVideos.push(video);
  //     });

  //     res
  //       .status(statusCode.OK)
  //       .send(
  //         statusCode.OK,
  //         responseMessage.GET_MY_PAGE_SUCCESS,
  //         myUploads,
  //         videosWithMyComment,
  //         likedVideos,
  //       );
  //   } catch (error) {
  //     console.log(error);
  //     res
  //       .status(statusCode.INTERNAL_SERVER_ERROR)
  //       .send(
  //         statusCode.INTERNAL_SERVER_ERROR,
  //         responseMessage.INTERNAL_SERVER_ERROR,
  //       );
  //   }
  // },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "profileImageUrl", "socialType", "snsId"],
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
        attributes: ["id", "name", "profileImageUrl", "socialType", "snsId"],
        include: [{ model: Job, attributes: ["id", "name"] }],
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
    const { id: loggedInUserId } = req.user;
    const { name } = req.body;
    const { userId } = req.params;

    if (!loggedInUserId) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(statusCode.BAD_REQUEST, responseMessage.LOGIN_REQUIRED);
    }
    if (+loggedInUserId !== +userId) {
      return res
        .status(statusCode.FORBIDDEN)
        .send(util.fail(statusCode.FORBIDDEN, responseMessage.NO_AUTHORITY));
    }
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
      }
      const profileImageUrl = req.file?.location || user.profileImageUrl;
      await user.update({
        name,
        profileImageUrl,
      });
      const { createdAt, updatedAt, ...userInfo } = user.dataValues;
      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.UPDATE_USER_SUCCESS,
            userInfo,
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
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["id", "name", "profileImageUrl", "socialType", "snsId"],
      });
      console.log(user);
      if (!user) {
        return res
          .status(statusCode.NOT_FOUND)
          .send(util.fail(statusCode.NOT_FOUND, responseMessage.NO_USER));
      }
      const { createdAt, updatedAt, ...deletedUser } = user.dataValues;
      await user.destroy();
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.DELETE_USER_SUCCESS, {
          deletedUser,
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
