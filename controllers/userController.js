const axios = require("axios");
const qs = require("qs");
const { User, Keyword, User_Keyword, Job } = require("../models");
const jwt = require("../middlewares/jwt");
const responseMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const {
  NAVER_ID,
  NAVER_SECRET,
  NAVER_REDIRECT_URI,
  NAVER_STATE,
} = require("../config/naver");
const request = require("request");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

module.exports = {
  // kakaoLogin: (req, res) => {
  //   // const { backToClientURL } = req.body;
  //   const backToClientURL = "http://127.0.0.1:3004/motiiv/api/v1/users";
  //   const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  //   return res
  //     .cookie("backToClientURL", backToClientURL)
  //     .redirect(kakaoAuthUrl);
  // },
  // kakaoLoginCallback: async (req, res) => {
  //   const { code } = req.query;
  //   const { backToClientURL } = req.cookies;
  //   let tokenResponse;
  //   try {
  //     tokenResponse = await axios({
  //       method: "POST",
  //       url: "https://kauth.kakao.com/oauth/token",
  //       headers: {
  //         "content-type": "application/x-www-form-urlencoded",
  //       },
  //       data: qs.stringify({
  //         grant_type: "authorization_code",
  //         client_id: KAKAO_ID,
  //         client_secret: KAKAO_SECRET,
  //         redirect_uri: KAKAO_REDIRECT_URI,
  //         code,
  //       }),
  //     });
  //   } catch (error) {
  //     // TODO: Cleanup
  //     console.log(error);
  //     return res.json(error.data);
  //   }
  //   console.info("==== tokenResponse.data ====");

  //   const { access_token } = tokenResponse.data;

  //   let userResponse;
  //   try {
  //     userResponse = await axios({
  //       method: "GET",
  //       url: "https://kapi.kakao.com/v2/user/me",
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //   } catch (error) {
  //     // TODO: Cleanup
  //     console.log(error);
  //     return res.json(error.data);
  //   }
  //   console.info("==== userResponse.data ====");
  //   console.log(userResponse.data);

  //   const {
  //     data: {
  //       properties: { nickname: username, profile_image: profileImageUrl },
  //       id: snsId,
  //     },
  //   } = userResponse;
  //   const socialType = "kakao";
  //   const socialInfo = {
  //     username,
  //     profileImageUrl,
  //     snsId,
  //     socialType,
  //   };
  //   console.log("si", socialInfo);
  //   return res
  //     .cookie("socialInfo", socialInfo, { httpOnly: true })
  //     .redirect(backToClientURL);
  // },

  naverProxy: (req, res) => {
    return res.redirect("http://127.0.0.1:3004/motiiv/api/v1/users/auth/naver");
  },

  naverLogin: (req, res) => {
    // const { backToClientURL } = req.body;
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
      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", NAVER_REDIRECT_URI);
      params.append("client_id", NAVER_ID);
      params.append("client_secret", NAVER_SECRET);
      params.append("code", code);
      params.append("state", state);
      console.log(params);
      const tokenData = await fetch("https://nid.naver.com/oauth2.0/token", {
        method: "POST",
        body: params,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      });
      // tokenResponse = await tokenData.json();
    } catch (error) {
      console.log(error);
      return res.json(error.data);
    }
    console.info("==== tokenResponse.data ====");

    const { access_token } = tokenResponse.data;

    let userResponse;
    try {
      // userResponse = await axios({
      //   method: "GET",
      //   url: "https://openapi.naver.com/v1/nid/me",
      //   headers: {
      //     "content-type": "application/x-www-form-urlencoded",
      //     Authorization: `Bearer ${access_token}`,
      //   },
      // });
      const userData = await fetch("https://openapi.naver.com/v1/nid/me", {
        method: "GET",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      });
      userResponse = await userData.json();
    } catch (error) {
      console.log(error);
      return res.json(error.data);
    }
    console.info("==== userResponse.data ====");
    const {
      response: { name: username, profile_image: profileImageUrl, id: snsId },
    } = userResponse;
    const socialType = "naver";

    const socialInfo = {
      username,
      profileImageUrl,
      snsId,
      socialType,
    };
    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.GET_PROFILE_NAVER_SUCCESS,
          socialInfo,
        ),
      );
  },

  // TODO: Cleanup

  getNaverProfile: async (req, res) => {
    // const {access_token} = req.body
    const { access_token } = req.body;

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
    const {
      data: {
        response: { name: username, profile_image: profileImageUrl, id: snsId },
      },
    } = userResponse;
    const socialType = "naver";

    const socialInfo = {
      username,
      profileImageUrl,
      snsId,
      socialType,
    };
    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          responseMessage.GET_PROFILE_NAVER_SUCCESS,
          socialInfo,
        ),
      );
  },

  login: async (req, res) => {
    const { snsId, socialType } = req.body;
    if (!snsId || !socialType) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const user = await User.findOne({
        where: { snsId, socialType },
        attributes: [
          "id",
          "username",
          "profileImageUrl",
          "snsId",
          "socialType",
        ],
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
      if (!user) {
        if (socialType === "naver") {
        }
        return res.status(statusCode.OK).send(
          util.success(statusCode.OK, responseMessage.PROCEED_WITH_SIGNUP, {
            isSignedUp: false,
          }),
        );
      }
      const { accessToken } = await jwt.sign(user);
      res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.LOGIN_SUCCESS, {
          isSignedUp: true,
          ...user.dataValues,
          userToken: accessToken,
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

  signup: async (req, res) => {
    const {
      username,
      profileImageUrl,
      snsId,
      socialType,
      jobName,
      keywordNames,
    } = req.body;
    if (!username || !snsId || !socialType || !keywordNames) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
    }
    try {
      const alreadyUser = await User.findOne({
        where: { snsId, socialType },
      });
      if (alreadyUser) {
        return res
          .status(statusCode.CONFLICT)
          .send(util.fail(statusCode.CONFLICT, responseMessage.ALREADY_USER));
      }
      const keywordIds = [];
      if (keywordNames) {
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
        }
      }
      let job;
      if (jobName) {
        job = await Job.findOne({ where: { name: jobName } });
        if (!job) {
          return res
            .status(statusCode.BAD_REQUEST)
            .send(
              util.fail(statusCode.BAD_REQUEST, responseMessage.NO_SUCH_JOB),
            );
        }
      }
      const newUser = await User.create({
        username,
        profileImageUrl,
        snsId,
        socialType,
      });
      if (jobName && job) {
        newUser.JobId = job.id;
      }
      await newUser.save();
      if (keywordNames) {
        await Promise.all(
          keywordIds.map(async (keywordId) => {
            await User_Keyword.create({
              UserId: newUser.id,
              KeywordId: keywordId,
            });
          }),
        );
      }

      const { accessToken } = await jwt.sign(newUser);
      const newUserInfo = await User.findOne({
        where: { snsId, socialType },
        attributes: [
          "id",
          "username",
          "profileImageUrl",
          "snsId",
          "socialType",
        ],
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
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.CREATE_USER_SUCCESS, {
          ...newUserInfo.dataValues,
          userToken: accessToken,
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

  // selectJobAndKeywords: async (req, res) => {
  //   const { user: userWithoutJobAndKeywords } = req;
  //   const { id: UserId } = req.user;
  //   const { jobName, keywordNames } = req.body;
  //   if (!jobName || !keywordNames) {
  //     return res
  //       .status(statusCode.BAD_REQUEST)
  //       .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  //   }
  //   // Some workaround to properly display updated user info T_T
  //   try {
  //     const keywordIds = [];
  //     const UserKeywords = [];
  //     for (let i = 0; i < keywordNames.length; i++) {
  //       const keyword = await Keyword.findOne({
  //         where: { name: keywordNames[i] },
  //       });
  //       if (!keyword) {
  //         return res
  //           .status(statusCode.BAD_REQUEST)
  //           .send(
  //             util.fail(
  //               statusCode.BAD_REQUEST,
  //               responseMessage.NO_SUCH_KEYWORD,
  //             ),
  //           );
  //       }
  //       keywordIds.push(keyword.id);
  //       const {
  //         createdAt: _,
  //         updatedAt: __,
  //         ...UserKeywordInfo
  //       } = keyword.dataValues;
  //       UserKeywords.push(UserKeywordInfo);
  //     }
  //     const job = await Job.findOne({ where: { name: jobName } });
  //     if (!job) {
  //       return res
  //         .status(statusCode.BAD_REQUEST)
  //         .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_SUCH_JOB));
  //     }
  //     await User_Keyword.destroy({ where: { UserId } });
  //     keywordIds.map(async (KeywordId) => {
  //       await User_Keyword.create({ UserId, KeywordId });
  //     });
  //     userWithoutJobAndKeywords.JobId = job.id;
  //     await userWithoutJobAndKeywords.save();

  //     const {
  //       createdAt: __,
  //       updatedAt: ___,
  //       JobId,
  //       ...updatedUser
  //     } = userWithoutJobAndKeywords.dataValues;
  //     const { createdAt, updatedAt, ...jobInfo } = job.dataValues;
  //     updatedUser.UserKeywords = UserKeywords;
  //     updatedUser.Job = jobInfo;

  //     // const user = await User.findOne({
  //     //   where: { id: UserId },
  //     //   attributes: ["id", "username", "profileImageUrl", "socialType", "snsId"],
  //     //   include: [
  //     //     {
  //     //       model: Job,
  //     //       attributes: ["id", "username"],
  //     //     },
  //     //     {
  //     //       model: Keyword,
  //     //       as: "UserKeywords",
  //     //       attributes: ["id", "username"],
  //     //       through: { attributes: [] },
  //     //     },
  //     //   ],
  //     // });

  //     res
  //       .status(statusCode.OK)
  //       .send(
  //         util.success(
  //           statusCode.OK,
  //           responseMessage.SELECT_JOB_AND_KEYWORDS_SUCCESS,
  //           updatedUser,
  //         ),
  //       );
  //   } catch (error) {
  //     console.log(error);
  //     res
  //       .status(statusCode.INTERNAL_SERVER_ERROR)
  //       .send(
  //         util.fail(
  //           statusCode.INTERNAL_SERVER_ERROR,
  //           responseMessage.INTERNAL_SERVER_ERROR,
  //         ),
  //       );
  //   }
  // },

  logout: async (req, res, next) => {
    res
      .status(statusCode.OK)
      .clearCookie("userToken")
      .send(util.success(statusCode.OK, responseMessage.LOGOUT_SUCCESS));
  },

  checkIfTokenExpired: async (req, res) => {
    const { id } = req.user;
    if (id) {
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, responseMessage.LOGGED_IN));
    } else {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.LOGIN_REQUIRED),
        );
    }
  },
  getUserProfile: async (req, res) => {
    const { id: userId } = req.user;
    try {
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

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: [
          "id",
          "username",
          "profileImageUrl",
          "socialType",
          "snsId",
        ],
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
        attributes: [
          "id",
          "username",
          "profileImageUrl",
          "socialType",
          "snsId",
        ],
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
    const {
      newName,
      newJobName,
      newKeywordNames: newKeyWordNamesString,
    } = req.body;
    console.log(newKeyWordNamesString);
    const newKeywordNames = JSON.parse(newKeyWordNamesString);
    console.log(newKeywordNames);
    try {
      const keywordIds = [];
      if (newKeywordNames) {
        for (let i = 0; i < newKeywordNames.length; i++) {
          console.log(typeof newKeywordNames[i]);
          const keyword = await Keyword.findOne({
            where: { name: newKeywordNames[i] },
          });
          console.log(keyword);
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
      user.JobId = job && job.id;
      user.username = newName;
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
        attributes: [
          "id",
          "username",
          "profileImageUrl",
          "socialType",
          "snsId",
        ],
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
