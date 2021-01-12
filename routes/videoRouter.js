const express = require("express");
const videoRouter = express.Router();
const videoController = require("../controllers/videoController");
const authMiddleware = require("../middlewares/authMiddleware");


//좋아요 추가/취소
videoRouter.put("/like/:videoId", authMiddleware.checkToken("user"), videoController.likeControl);

//비디오 저장 추가/취소
videoRouter.put("/save/:videoId", authMiddleware.checkToken("user"), videoController.saveControl);

//마이모티브 불러오기
videoRouter.get(
  "/myMotiiv",
  authMiddleware.checkToken("user"),
  videoController.getMyMotiiv);

//카테고리뷰 키워드 불러오기
videoRouter.get("/category/keywords", videoController.getCategoryKeyword);

//카테고리뷰 불러오기
videoRouter.get("/category/:keyword/:filters",
  authMiddleware.handleRequestWithoutUserToken,
  authMiddleware.checkToken("user"),
  videoController.getCategory);

//카테고리뷰 특정 태그값 검색하기
videoRouter.get("/category/:tagId", videoController.TagVideo);

//비디오 업로드
videoRouter.post("/postVideo", videoController.postVideo);

//홈화면 배너 불러오기
videoRouter.get("/getBanners",
  authMiddleware.handleRequestWithoutUserToken,
  authMiddleware.checkToken("user"),
  videoController.bannerVideos);

//홈화면 추천 영상 불러오기
videoRouter.get(
  "/getRecommand",
  authMiddleware.handleRequestWithoutUserToken,
  authMiddleware.checkToken("user"),
  videoController.recommanVideos);

//디테일뷰 정보 불러오기
videoRouter.get("/:videoId",
  authMiddleware.handleRequestWithoutUserToken,
  authMiddleware.checkToken("user"),
  videoController.getDetail);


module.exports = videoRouter;
