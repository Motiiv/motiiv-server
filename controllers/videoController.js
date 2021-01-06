const sequelize = require("sequelize");
const ut = require("../modules/util");
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");
const {
  Section,
  Tag,
  User,
  Video_Section,
  Video_Tag,
  Video,
  Like,
  Save,
  Workspace,
  View,
  Job,
  User_Keyword
} = require("../models");
const { Sequelize } = require("sequelize");
const { STRING } = require("sequelize");
const Op = sequelize.Op;

module.exports = {
  //비디오 추가하기
  postVideo: async (req, res) => {
    const { user, videoUrl, title, description, thumbnailImageUrl, channelName, videoLength, tagOne, tagTwo, tagThree } = req.body;
    try {
      const video = await Video.create({
        videoUrl,
        title,
        description,
        thumbnailImageUrl,
        channelName,
        videoLength,
      });
      videoId = video.dataValues.id;

      //태그 id 검사하기 
      const getTags = await Tag.findAll({
        where: {
          name: {
            [Op.or]: [tagOne, tagTwo, tagThree]
          }
        }
      });
      const getTagsId = getTags.map((item) => item.dataValues.id);

      await Video_Tag.create({
        VideoId: videoId,
        TagId: getTagsId[0]
      });

      await Video_Tag.create({
        VideoId: videoId,
        TagId: getTagsId[1]
      });

      await Video_Tag.create({
        VideoId: videoId,
        TagId: getTagsId[2]
      });

      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.POST_VIDEO_SUCCESS, video));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.POST_VIDEO_FAIL));
    }
  },


  // 2군 세션 추천하기 (관심사 / 직군 기반)
  recommanVideos: async (req, res) => {
    const user = req.body.userId;

    try {
      // 사용자 관심사 불러오기
      const userInterst = await User_Keyword.findAll({
        where: {
          UserId: user
        },
        attributes: ["keywordId"]
      });
      //사용자 관심사 id값 불러오기 
      const userInterestId = userInterst.map((item) => item.dataValues.keywordId);

      //관심사 id가 가진 태그 불러오기
      const getTags = await Tag.findAll({
        where: {
          keywordId: {
            [Op.and]: [
              { [Op.in]: userInterestId }
            ],
          }
        },
        attributes: ["id"]
      });
      const getTagsId = getTags.map((item) => item.dataValues.id);


      // 2-1군: 직군 태그를 포함한 영상 불러오기 
      /*
        1. user 직군 불러오기
        2. 해당 직군의 태그 id값 검색
        3. 해당 태그를 가진 비디오 검색
        4. 영상 랜덤하게 리턴
      */

      // 1. 사용자 관심 직군 찾기
      const userJob = await User.findOne({
        where: { id: user }
      });
      const userJobId = userJob.JobId;
      console.log("job ID");
      console.log(userJobId);

      // 2. 직군의 이름 찾기
      const findJobName = await Job.findOne({
        where: { id: userJobId },
        attributes: ["name"]
      });
      const jobName = findJobName.dataValues.name;
      console.log(jobName);

      // 3. 직군의 TagId값 찾기
      const jobTag = await Tag.findOne({
        where: { name: jobName }
      });
      const jobTagId = jobTag.dataValues.id;
      console.log(jobTagId);

      // 4. 해당 태그를 가진 비디오 id찾기
      const tagedVideos = await Video_Tag.findAll({
        where: { TagId: jobTagId }
      });
      const tagedVideosId = tagedVideos.map((item) => item.dataValues.VideoId);
      console.log(tagedVideosId);

      const jobVideos = await Video.findAll({
        where: { id: tagedVideosId },
        attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "channelName"],
        include: [
          {
            model: Tag,
            as: "TaggedVideos",
            attributes: ["id", "name"],
            through: { attributes: [] },
          }
        ],
      });


      // 2-2군: 사용자 관심사 기반 유사한 영상 추천하기 
      /*
        case1(제외): 이미 시청한 영상인 경우 제외
        case2(추가): 사용자 관심사 기준 태그 동영상 불러오기
        case3(예외): 불러온 동영상 갯수가 4개 미만일 경우(4개 기준은 기획과 논의 필요)
      */

      // 사용자가 이미 시청한 영상
      const alreadyWatched = await View.findAll({
        where: {
          UserId: user,
        },
        attributes: ["VideoId"],
      });
      const alreadyWatchedId = alreadyWatched.map((item) => item.dataValues.VideoId)
      console.log(alreadyWatchedId);

      // 유사 태그 동영상 불러오기
      const similarTag = await Video_Tag.findAll({
        where: {
          TagId: getTagsId,
        },
        attributes: [sequelize.fn("DISTINCT", "Video_Tag.VideoId"), "VideoId"],
        order: sequelize.literal("rand()"),
        limit: 8,
      });
      const similarTags = similarTag.map((item) => item.dataValues.VideoId);

      console.log("비슷한 태그의 비디오들");
      console.log(similarTags);


      // Case1,2를 제외한 추천 영상 불러오기 (제외:현재 동영상, 이미 본 영상, 추가: 유사 태그)
      const recommandVideos = await Video.findAll({
        where: {
          id: {
            [Op.and]: [
              { [Op.in]: similarTags },
              { [Op.notIn]: alreadyWatchedId },
            ],
          },
        },
        attributes: ["id", "title", "videoUrl", "thumbnailImageUrl"],
        order: sequelize.literal("rand()"),
      });
      const recommands = recommandVideos.map((item) => item.dataValues.id);
      console.log(recommands);

      recommandsLength = recommands.length;

      if (recommandsLength < 7) {
        const otherVideos = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.notIn]: alreadyWatchedId },
                { [Op.notIn]: recommands },
              ],
            },
          },
          attributes: ["id", "title", "videoUrl", "thumbnailImageUrl"],
          order: sequelize.literal("rand()"),
          limit: 4 - recommandsLength,
        });
        //여기서도 동영상 수가 적으면 이미 본 영상에서 가져와야 하는 로직 추가
        recommandVideos.push(...otherVideos);
      };


      /* 3군 어드민이 설정한 세션 불러오기
      1. 세션 admincheck를 통한 설정한 세션 id 저장
      2. Video_Section에서 해당 id값을 가진 VideoId값 불러오기
      3. 해당 아이디를 가진 비디오 영상 목록 불러오기
      */



      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.GET_VIDEO_RECOMMAND_SUCCESS, { jobVideos, recommandVideos }));

    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_VIDEO_RECOMMAND_FAIL));
    }
  },


  //홈화면 비디오 읽기
  bannerVideos: async (req, res) => {
    const video = req.query.filters;
    try {
      // 전체 비디오 불러오기
      const video = await Video.findAll({
        attributes: [
          "id",
          "videoUrl",
          "title",
          "description",
          "thumbnailImageUrl",
          "viewCount",
          "videoLength",
          "channelName",
          "createdAt"
        ],
        include: [
          {
            model: Tag,
            as: "TaggedVideos",
            attributes: ["id", "name"],
            through: { attributes: [] },
          }
        ],
      });

      //Top10 동영상
      const topTen = video
        .map((item) => item.dataValues)
        .sort((a, b) => b.viewCount - a.viewCount);
      topTens = topTen.slice(0, 10);

      //어제 날짜 포맷 변경 함수
      function getFormatDate(date) {
        var year = date.getFullYear(); //yyyy
        var month = 1 + date.getMonth(); //M
        month = month >= 10 ? month : "0" + month; //month 두자리로 저장
        var day = date.getDate(); //d
        day = day >= 10 ? day : "0" + day; //day 두자리로 저장
        return year + "-" + month + "-" + day; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
      }
      const yesterday = ((d) => new Date(d.setDate(d.getDate() - 1)))(
        new Date(),
      );
      const today = ((d) => new Date(d.setDate(d.getDate())))(new Date());

      /* 배너 동영상 */

      // 어제 조회수가 가장 높았던 동영상 => View에서 어제 동영상 목록 가져오기 => 동영상 갯수가 가장 많은것 순서대로 sort

      const mostView = await View.findAll({
        group: ["VideoId"],
        where: {
          createdAt: {
            [Op.and]: [{ [Op.lte]: today }, { [Op.gte]: yesterday }],
          },
        },
        attributes: ["VideoId", [sequelize.fn("Count", "VideoId"), "viewCnt"]],
        order: [[sequelize.literal("viewCnt"), "DESC"]],
        limit: 1,
      });
      const mostViewId = mostView.map((item) => item.dataValues.VideoId);



      // 어제 조회수가 가장 높았던 영상 추출
      const mostViewVideo = await Video.findOne({
        where: { id: mostViewId },
        attributes: [
          "id",
          "videoUrl",
          "title",
          "description",
          "thumbnailImageUrl",
          "videoLength",
        ],
        include: [
          {
            model: Tag,
            as: "TaggedVideos",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });

      // 어제 좋아요가 가장 높았던 영상
      const mostLike = await Like.findAll({
        group: ["VideoId"],
        where: {
          createdAt: {
            [Op.and]: [{ [Op.lte]: today }, { [Op.gte]: yesterday }],
          },
        },
        attributes: ["VideoId", [sequelize.fn("Count", "VideoId"), "likeCnt"]],
        order: [[sequelize.literal("likeCnt"), "DESC"]],
        limit: 1,
      });
      const mostLikeId = mostLike.map((item) => item.dataValues.VideoId);
      console.log(mostLikeId);

      const mostLikeVideo = await Video.findOne({
        where: { id: mostLikeId },
        attributes: [
          "id",
          "videoUrl",
          "title",
          "description",
          "thumbnailImageUrl",
          "videoLength",
        ],
        include: [
          {
            model: Tag,
            as: "TaggedVideos",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });

      // 좋아요와 조회수 값이 일치하는 경우도 처리해야함

      return res.status(sc.OK).send(
        ut.success(sc.OK, rm.GET_ALL_POST_SUCCESS, {
          topTens,
          mostViewVideo,
          mostLikeVideo,
        }),
      );
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_ALL_POST_FAIL));
    }
  },

  getUseRecommandVideos: async (req, res) => {
    const id = req.body.userId;

  },



  // 동영상 디테일
  getDetail: async (req, res) => {
    const video = req.params.videoId;
    const user = req.body.userId;

    //video id check
    if (!video) {
      res.status(400).json({
        message: "video id가 비어있습니다.",
      });
      return;
    }

    // get info from video
    try {
      /* 디테일 정보 불러오기 */

      //해당 동영상의 정보 불러오기
      const details = await Video.findOne({
        where: {
          id: video,
        },
        attributes: [
          "title",
          "description",
          "videoUrl",
          "viewCount",
          "channelName",
          "createdAt",
        ],
        include: [
          {
            model: Tag,
            as: "TaggedVideos",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });

      /* 조회수 증가 */

      // Video 테이블 조회수 증가
      let cnt = details.viewCount + 1;
      await Video.update(
        {
          viewCount: cnt,
        },
        { where: { id: video } },
      );

      // View 테이블 사용자별 비디오 조회수 저장
      const viewcount = await View.findAll({
        where: {
          VideoId: video,
          UserId: user,
        },
      });

      // 테이블에 중복이 없을 경우 View에 비디오, 사용자 추가
      if (!viewcount) {
        const viewcount = await View.create({ VideoId: video, UserId: user });
      }

      /* 추천 영상 불러오기 */

      // Case1. 사용자가 이미 시청한 영상(제외)
      const alreadyWatched = await View.findAll({
        where: {
          UserId: user,
        },
        attributes: ["VideoId"],
      });
      const alreadyWatchedId = alreadyWatched.map(
        (item) => item.dataValues.VideoId,
      );
      console.log("이미 시청한 영상");
      console.log(alreadyWatchedId);

      // Case2. 해당 영상의 태그를 가진 다른 영상 (포함)
      const taggedVideos = details.dataValues.TaggedVideos;
      const tagId = taggedVideos.map((item) => item.dataValues.id);

      // 유사 태그 동영상 불러오기
      const similarTag = await Video_Tag.findAll({
        where: {
          tagId,
        },
        attributes: [sequelize.fn("DISTINCT", "Video_Tag.VideoId"), "VideoId"],
        order: sequelize.literal("rand()"),
        limit: 5,
      });
      const similarTags = similarTag.map((item) => item.dataValues.VideoId);

      console.log("비슷한 태그의 비디오들");
      console.log(similarTags);

      alreadyWatchedId.push(video);

      // Case1,2를 제외한 추천 영상 불러오기 (제외:현재 동영상, 이미 본 영상, 추가: 유사 태그)
      const recommandVideos = await Video.findAll({
        where: {
          id: {
            [Op.and]: [
              { [Op.in]: similarTags },
              { [Op.notIn]: alreadyWatchedId },
            ],
          },
        },
        attributes: ["id", "title", "videoUrl", "thumbnailImageUrl"],
        order: sequelize.literal("rand()"),
      });
      recommands = recommandVideos.map((item) => item.dataValues.id);
      console.log(recommands);

      recommandsLength = recommands.length;

      if (recommandsLength < 4) {
        const otherVideos = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.notIn]: alreadyWatchedId },
                { [Op.notIn]: recommands },
              ],
            },
          },
          attributes: ["id", "title", "videoUrl", "thumbnailImageUrl"],
          order: sequelize.literal("rand()"),
          limit: 4 - recommandsLength,
        });
        //여기서도 동영상 수가 적으면 이미 본 영상에서 가져와야 하는 로직 추가
        recommandVideos.push(...otherVideos);
      }

      return res.status(sc.OK).send(
        ut.success(sc.OK, rm.GET_VIDEO_DETAIL_SUCCESS, {
          details,
          recommandVideos,
        }),
      );
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_VIDEO_DETAIL_FAIL));
    }
  },

  //좋아요 기능
  createLike: async (req, res) => {
    const video = req.params.videoId;
    const { id: user } = req.user;

    try {
      const like = await Like.create({ VideoId: video, UserId: user });

      // 중복 처리 추가

      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.POST_VIDEO_LIKE_SUCCESS, like));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.POST_VIDEO_LIKE_FAIL));
    }
  },

  //좋아요 취소
  deleteLike: async (req, res) => {
    const video = req.params.videoId;
    const { id: user } = req.user;

    try {
      await Like.destroy({
        where: {
          VideoId: video,
          UserId: user,
        },
      });
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.DELETE_VIDEO_LIKE_SUCCESS));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.DELETE_VIDEO_LIKE_FAIL));
    }
  },

  // 동영상 저장
  createSave: async (req, res) => {
    const video = req.params.videoId;
    const { id: user } = req.user;

    try {
      const save = await Save.create({ VideoId: video, UserId: user });

      //중복 추가
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.POST_VIDEO_SAVE_SUCCESS, save));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.POST_VIDEO_SAVE_FAIL));
    }
  },

  // 동영상 저장 취소
  deleteSave: async (req, res) => {
    const video = req.params.videoId;
    const { id: user } = req.user;

    try {
      await Save.destroy({
        where: {
          VideoId: video,
          UserId: user,
        },
      });
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.DELETE_VIDEO_SAVE_SUCCESS));
    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.DELETE_VIDEO_SAVE_FAIL));
    }
  },
};
