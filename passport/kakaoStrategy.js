const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const passportEnv = require("../config/passportEnv");
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: passportEnv.KAKAO_ID,
        callbackURL:
          "http://127.0.0.1:3004/motiiv/api/v1/users/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile._json.kakao_account);
          const alreadyUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (alreadyUser) {
            done(null, alreadyUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kaccaount_email,
              username: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.log(error);
          done(error);
        }
      },
    ),
  );
};
