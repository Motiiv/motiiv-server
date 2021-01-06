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
    const { user: userWithoutJobAndKeywords } = req;
    const { id: UserId } = req.user;
    const { jobName, keywordNames } = req.body;
    if (!jobName || !keywordNames) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    // Some workaround to properly display updated user info T_T
    try {
      const keywordIds = [];
      const UserKeywords = [];
      for (let i = 0; i < keywordNames.length; i++) {
        const keyword = await Keyword.findOne({
          where: { name: keywordNames[i] },
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
        keywordIds.push(keyword.id);
        const {
          createdAt: _,
          updatedAt: __,
          ...UserKeywordInfo
        } = keyword.dataValues;
        UserKeywords.push(UserKeywordInfo);
      }
      const job = await Job.findOne({ where: { name: jobName } });
      if (!job) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_SUCH_JOB));
      }
      await User_Keyword.destroy({ where: { UserId } });
      keywordIds.map(async (KeywordId) => {
        await User_Keyword.create({ UserId, KeywordId });
      });
      userWithoutJobAndKeywords.JobId = job.id;
      await userWithoutJobAndKeywords.save();

      const {
        createdAt: __,
        updatedAt: ___,
        JobId,
        ...updatedUser
      } = userWithoutJobAndKeywords.dataValues;
      const { createdAt, updatedAt, ...jobInfo } = job.dataValues;
      updatedUser.UserKeywords = UserKeywords;
      updatedUser.Job = jobInfo;

      // const user = await User.findOne({
      //   where: { id: UserId },
      //   attributes: ["id", "name", "profileImageUrl", "socialType", "snsId"],
      //   include: [
      //     {
      //       model: Job,
      //       attributes: ["id", "name"],
      //     },
      //     {
      //       model: Keyword,
      //       as: "UserKeywords",
      //       attributes: ["id", "name"],
      //       through: { attributes: [] },
      //     },
      //   ],
      // });

      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.SELECT_JOB_AND_KEYWORDS_SUCCESS,
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
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },

  // TODO: LOGOUT
  logout: async (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
  },

  getUserProfile: async (req, res) => {
    const { id: userId } = req.user;
    const profile = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["createdAt", "updatedAt", "JobId"] },
      include: [
        { model: Job, attributes: { exclude: ["createdAt", "updatedAt"] } },
        {
          model: Keyword,
          as: "UserKeywords",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: { attributes: [] },
        },
      ],
    });
    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.GET_USER_PROFILE_SUCCESS,
          profile,
        ),
      );
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "profileImageUrl", "socialType", "snsId"],
      });
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
        include: [
          { model: Job, attributes: ["id", "name"] },
          {
            model: Keyword,
            as: "UserKeywords",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
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
    const { user } = req;
    const { newName, newJobName, newKeywordNames } = req.body;
    try {
      const keywordIds = [];
      if (newKeywordNames) {
        for (let i = 0; i < newKeywordNames.length; i++) {
          console.log(newKeywordNames[i]);
          const keyword = await Keyword.findOne({
            where: { name: newKeywordNames[i] },
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
          keywordIds.push(keyword.id);
        }
      }
      let job;
      if (newJobName) {
        job = await Job.findOne({ where: { name: newJobName } });
        if (!job) {
          return res
            .status(statusCode.BAD_REQUEST)
            .send(
              util.fail(statusCode.BAD_REQUEST, responseMessage.NO_SUCH_JOB),
            );
        }
      }
      if (newKeywordNames) {
        await User_Keyword.destroy({ where: { UserId: user.id } });
        keywordIds.map(async (KeywordId) => {
          await User_Keyword.create({ UserId: user.id, KeywordId });
        });
      }
      const profileImageUrl =
        (req.file && req.file.location) || user.profileImageUrl;
      user.JobId = job?.id;
      user.name = newName;
      user.profileImageUrl = profileImageUrl;
      await user.save();

      const updatedUser = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ["createdAt", "updatedAt", "JobId"] },
        include: [
          { model: Job, attributes: { exclude: ["createdAt", "updatedAt"] } },
          {
            model: Keyword,
            as: "UserKeywords",
            attributes: { exclude: ["createdAt", "updatedAt"] },
            through: { attributes: [] },
          },
        ],
      });
      // const { JobId,createdAt, updatedAt, ...userInfo } = user.dataValues;
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
            responseMessage.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  },

  deleteUser: async (req, res) => {
    const { user } = req;
    try {
      const { createdAt, updatedAt, ...deletedUser } = user.dataValues;
      user.destroy();
      res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            responseMessage.DELETE_USER_SUCCESS,
            deletedUser,
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

  deleteSpecificUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["id", "name", "profileImageUrl", "socialType", "snsId"],
      });
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
