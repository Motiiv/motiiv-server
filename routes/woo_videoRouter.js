const express = require("express");
const woo_videoRouter = express.Router();
const videoController = require("../controllers/jj_videoController");

//홈화면 비디오 불러오기
woo_videoRouter.get("/", videoController.bannerVideos);

//디테일뷰 정보 불러오기
woo_videoRouter.get("/:videoId", videoController.getDetail);

//좋아요 추가
woo_videoRouter.post("/:videoId/createLike", videoController.createLike);

//좋아요 취소
woo_videoRouter.delete("/:videoId/deleteLike", videoController.deleteLike);

//비디오 저장
woo_videoRouter.post("/:videoId/createSave", videoController.createSave);

//비디오 저장 취소
woo_videoRouter.delete("/:videoId/deleteSave", videoController.deleteSave);

module.exports = woo_videoRouter;
