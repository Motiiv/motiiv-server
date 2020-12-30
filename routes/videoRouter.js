const express = require("express");
const videoRouter = express.Router();
const videoController = require('../controllers/videoController');

videoRouter.get("/", videoController.readAllPost);

//좋아요 추가
videoRouter.post("/:videoId/createLike", videoController.createLike);

//좋아요 취소
videoRouter.delete("/:videoId/deleteLike", videoController.deleteLike);

module.exports = videoRouter;
