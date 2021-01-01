const express = require("express");
const videoRouter = express.Router();
const videoController = require('../controllers/videoController');


//홈화면 비디오 불러오기
videoRouter.get("/homeVideos", videoController.readHomevideos);

//디테일뷰 정보 불러오기
videoRouter.get("/:videoId", videoController.getDetail);

//좋아요 추가
videoRouter.post("/:videoId/createLike", videoController.createLike);

//좋아요 취소
videoRouter.delete("/:videoId/deleteLike", videoController.deleteLike);

//비디오 저장
videoRouter.post('/:videoId/createSave', videoController.createSave);

//비디오 저장 취소
videoRouter.delete('/:videoId/deleteSave', videoController.deleteSave);


module.exports = videoRouter;
