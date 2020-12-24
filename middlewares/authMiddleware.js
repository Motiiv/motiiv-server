const util = require("../modules/util");
const jwt = require("../modules/jwt");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const { User } = require("../models");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
  // middlewares
  // 미들웨어로 token이 있는지 없는지 확인하고
  // token이 있다면 jwt.verify 함수를 이용해서 토큰 hash를 확인하고 토큰에 들어있는 정보 해독
  // 해독한 정보는 req.decoded에 저장하고 있으며 이후 로그인 유무는 decoded가 있는지 없는지를 통해 알 수 있음
  checkToken: async (req, res, next) => {
    const token = req.headers.jwt;

    if (!token) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.EMPTY_TOKEN));
    }

    const user = await jwt.verify(token);
    if (user === TOKEN_EXPIRED) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.EXPIRED_TOKEN),
        );
    }
    if (user === TOKEN_INVALID) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(
          util.fail(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN),
        );
    }

    const userId = user.id;

    if (!userId) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(statusCode.UNAUTHORIZED, responseMessage.INVALID_TOKEN);
    } else {
      const userInfo = await User.findOne({ where: { id: userId } });
      //   console.log(userInfo);
      req.user = userInfo;
      next();
    }
  },
};
