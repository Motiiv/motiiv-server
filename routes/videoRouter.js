const express = require("express");
const videoRouter = express.Router();
const videoController = require("../controllers/videoController");
const authMiddleware = require("../middlewares/authMiddleware");

//마이모티브 불러오기
videoRouter.get("/myMotiiv", videoController.getMyMotiiv);

//비디오 업로드
videoRouter.post("/postVideo", videoController.postVideo);

//홈화면 배너 불러오기
videoRouter.get("/getBanners", videoController.bannerVideos);

//홈화면 추천 영상 불러오기
videoRouter.get("/getRecommand", videoController.recommanVideos);

//디테일뷰 정보 불러오기
videoRouter.get("/:videoId", videoController.getDetail);


//좋아요 추가
videoRouter.post(
  "/:videoId/createLike",
  authMiddleware.checkToken("user"),
  videoController.createLike,
);

//좋아요 취소
videoRouter.delete(
  "/:videoId/deleteLike",
  authMiddleware.checkToken("user"),
  videoController.deleteLike,
);

//비디오 저장
videoRouter.post(
  "/:videoId/createSave",
  authMiddleware.checkToken("user"),
  videoController.createSave,
);

//비디오 저장 취소
videoRouter.delete(
  "/:videoId/deleteSave",
  authMiddleware.checkToken("user"),
  videoController.deleteSave,
);

module.exports = videoRouter;
