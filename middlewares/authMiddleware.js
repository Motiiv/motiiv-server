const util = require("../modules/util");
const jwt = require("./jwt");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const { User, Admin } = require("../models");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  handleRequestWithoutUserToken: (req, res, next) => {
    const requestHasUserToken = req.headers.usertoken;
    if (!requestHasUserToken) {
      req.noUserToken = true;
    }
    next();
  },

  checkToken: (role) => {
    return async (req, res, next) => {
      const noUserToken = req.noUserToken;
      console.log(noUserToken);
      if (noUserToken === true) {
        req.user = { id: null };
        next();
      } else {
        let token;
        if (role === "admin") {
          token = req.headers.admintoken;
        } else if (role === "user") {
          token = req.headers.usertoken;
        }
        if (!token) {
          return res
            .status(statusCode.BAD_REQUEST)
            .send(
              util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN),
            );
        }

        const decodedToken = await jwt.verify(token);
        if (decodedToken === TOKEN_EXPIRED) {
          return res
            .status(statusCode.UNAUTHORIZED)
            .send(
              util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN),
            );
        }
        if (decodedToken === TOKEN_INVALID) {
          return res
            .status(statusCode.UNAUTHORIZED)
            .send(
              util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN),
            );
        }

        const id = decodedToken.id;

        if (!id) {
          return res
            .status(statusCode.UNAUTHORIZED)
            .send(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN);
        } else {
          if (role === "admin") {
            const adminInfo = await Admin.findOne({ where: { id } });
            if (!adminInfo) {
              return res
                .status(statusCode.FORBIDDEN)
                .send(
                  util.fail(statusCode.FORBIDDEN, responseMessage.NOT_ADMIN),
                );
            }
            req.admin = adminInfo;
          } else if (role === "user") {
            const userInfo = await User.findOne({ where: { id } });
            if (!userInfo) {
              return res
                .status(statusCode.FORBIDDEN)
                .send(
                  util.fail(
                    statusCode.FORBIDDEN,
                    responseMessage.LOGIN_REQUIRED,
                  ),
                );
            }
            req.user = userInfo;
          }
        }
        next();
      }
    };
  },
};
