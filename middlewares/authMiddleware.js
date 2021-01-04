const util = require("../modules/util");
const jwt = require("./jwt");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const { User, Admin } = require("../models");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  // middlewares
  // 미들웨어로 token이 있는지 없는지 확인하고
  // token이 있다면 jwt.verify 함수를 이용해서 토큰 hash를 확인하고 토큰에 들어있는 정보 해독
  // 해독한 정보는 req.decoded에 저장하고 있으며 이후 로그인 유무는 decoded가 있는지 없는지를 통해 알 수 있음
  checkToken: (role) => {
    return async (req, res, next) => {
      const token = req.headers.jwt;

      if (!token) {
        return res
          .status(statusCode.BAD_REQUEST)
          .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
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
              .send(util.fail(statusCode.FORBIDDEN, responseMessage.NOT_ADMIN));
          }
          req.admin = adminInfo;
        } else if (role === "user") {
          const userInfo = await User.findOne({ where: { id } });
          if (!userInfo) {
            return res
              .status(statusCode.FORBIDDEN)
              .send(
                util.fail(statusCode.FORBIDDEN, responseMessage.LOGIN_REQUIRED),
              );
          }
          req.user = userInfo;
        }
        next();
      }
    };
  },
};
