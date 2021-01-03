const express = require("express");
const jj_videoRouter = express.Router();
const videoController = require("../controllers/jj_videoController");
const authMiddleware = require("../middlewares/authMiddleware");

//홈화면 비디오 불러오기
jj_videoRouter.get("/", videoController.bannerVideos);

//디테일뷰 정보 불러오기
jj_videoRouter.get("/:videoId", videoController.getDetail);

//좋아요 추가
jj_videoRouter.post(
  "/:videoId/createLike",
  authMiddleware.checkToken("admin"),
  videoController.createLike,
);

//좋아요 취소
jj_videoRouter.delete("/:videoId/deleteLike", videoController.deleteLike);

//비디오 저장
jj_videoRouter.post("/:videoId/createSave", videoController.createSave);

//비디오 저장 취소
jj_videoRouter.delete("/:videoId/deleteSave", videoController.deleteSave);

module.exports = jj_videoRouter;
