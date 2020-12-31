const express = require("express");
const videoRouter = express.Router();
const videoController = require('../controllers/videoController');

videoRouter.get("/", videoController.readAllPost);

//좋아요 추가
videoRouter.post("/:videoId/createLike", videoController.createLike);

//좋아요 취소
videoRouter.delete("/:videoId/deleteLike", videoController.deleteLike);

//비디오 저장
videoRouter.post('/:videoId/createSave', videoController.createSave);

//비디오 저장 취소

module.exports = videoRouter;
