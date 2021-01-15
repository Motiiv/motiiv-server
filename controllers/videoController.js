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
  User_Keyword,
  Keyword,
  Viewhistory
} = require("../models");
const { Sequelize } = require("sequelize");
const { STRING } = require("sequelize");
const Op = sequelize.Op;
const dayjs = require("dayjs");

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
  /*
    recommanVideos: async (req, res) => {
      const { id: user } = req.user;
      const DB_NAME =
        process.env.NODE_ENV === "production" ? "MOTIIV_PROD" : "MOTIIV_DEV"
      try {
  
        const sectiononeId = [1, 2, 3, 4, 5, 6];
        const sectiononeName = "이영진 바보";
        const sectiononeNameSub = "이영진 바보";
        const sectiontwoId = [7, 8, 9, 10, 11, 12];
        const sectionTwoName = "메종L안맞음";
        const sectionTwoNameSub = "메종L안맞음 부우";
        const sectionthreeId = [13, 14, 15, 16, 17, 18];
        const sectionThreeName = "허허 돼지 이영진";
        const sectionThreeNameSub = "돼에지";
        const sectionFourId = [19, 20, 21, 22, 23, 24];
        const sectionFourName = "정신차려 이영진";
        const sectionFourNameSub = "이 각박한 세상 속에서";
        const sectionFiveId = [4, 12, 17, 14, 7, 28];
        const sectionFiveName = "정차영";
        const sectionFiveNameSub = "정신 차려이 영진";
        const sectionSixId = [5, 26, 18, 19, 21, 1];
        const sectionSixName = "부우~ 부부부우~";
        const sectionSixNameSub = "뿌우우우~"
  
        const sectionOnes = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.in]: sectiononeId }
              ],
            },
          },
          attributes: ["id", "title", "thumbnailImageUrl", "viewCount", "videoLength", "channelName", "videoLength", "videoGif", "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
  
        });
  
        const sectionOne = { sectionOnes, sectiononeName, sectiononeNameSub };
  
        const sectionTwos = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.in]: sectiontwoId }
              ],
            },
          },
          attributes: ["id", "title", "thumbnailImageUrl", "viewCount", "videoLength", "channelName", "videoLength", "videoGif", "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
        });
  
        const sectionTwo = { sectionTwos, sectionTwoName, sectionTwoNameSub };
        const sectionThrees = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.in]: sectionthreeId }
              ],
            },
          },
          attributes: ["id", "title", "thumbnailImageUrl", "viewCount", "videoLength", "channelName", "videoLength", "videoGif", "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
        });
        const sectionThree = { sectionThrees, sectionThreeName, sectionThreeNameSub };
  
        const sectionFours = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.in]: sectionFourId }
              ],
            },
          },
          attributes: ["id", "title", "thumbnailImageUrl", "viewCount", "videoLength", "channelName", "videoLength", "videoGif", "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
        });
        const sectionFour = { sectionFours, sectionFourName, sectionFourNameSub };
  
        const sectionFives = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.in]: sectionFiveId }
              ],
            },
          },
          attributes: ["id", "title", "thumbnailImageUrl", "viewCount", "videoLength", "channelName", "videoLength", "videoGif", "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
        });
        const sectionFive = { sectionFives, sectionFiveName, sectionFiveNameSub };
  
        const sectionSixs = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.in]: sectionSixId }
              ],
            },
          },
          attributes: ["id", "title", "thumbnailImageUrl", "viewCount", "videoLength", "channelName", "videoLength", "videoGif", "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
        });
        const sectionSix = { sectionSixs, sectionSixName, sectionSixNameSub };
  
        return res
          .status(sc.OK)
          .send(ut.success(sc.OK, rm.GET_VIDEO_RECOMMAND_SUCCESS, { sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive, sectionSix }));
  
      } catch (err) {
        return res
          .status(sc.INTERNAL_SERVER_ERROR)
          .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_VIDEO_RECOMMAND_FAIL));
      }
    },
  
  */

  recommendVideos: async (req, res) => {
    const { id: user } = req.user;
    const DB_NAME =
      process.env.NODE_ENV === "production" ? "MOTIIV_PROD" : "MOTIIV_DEV"
    try {
      let sectionOne;
      let sectionTwo;
      let sectionThree;
      let sectionFour;
      let sectionFive;
      let sectionSix;
      ///let sectionSeven;
      let titleOne = {};

      if (user) {
        /*
        직군 기반 추천하기
        return sectionOne
        2-1군
        */
        // 1. user 직군 불러오기
        const userJob = await User.findOne({
          where: { id: user }
        });
        const userJobId = userJob.JobId;

        // 2. 해당 직군의 태그 id값 검색
        const findJobName = await Job.findOne({
          where: { id: userJobId },
          attributes: ["name"]
        });
        let jobName = findJobName.dataValues.name;

        // Section 1번째
        titleOne['title'] = "|" + jobName + "|" + '에게 추천하는 모티브';
        titleOne['subtitle'] = "직군에 맞는 영상을 가져왔어요.";

        if (jobName === "기획자") {
          jobName = "기획";
        } else if (jobName === "디자이너") {
          jobName = "디자인"
        } else if (jobName === "개발자") {
          jobName = "개발"
        };

        if (jobName === "유노윤호") {
          sectionOne = await Video.findAll({
            where: { id: tagedVideosId },
            attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                ),
                "isSave",
              ],
            ],
            include: [
              {
                model: Tag,
                as: "VideoTags",
                attributes: ["id", "name"],
                through: { attributes: [] },
              }
            ],
            order: sequelize.literal("rand()"),
            limit: 10
          });
        } else {
          // 3. 직군의 TagId값 찾기
          const jobTag = await Tag.findOne({
            where: { name: jobName }
          });
          const jobTagId = jobTag.dataValues.id;

          // 3-1. 해당 태그를 가진 비디오 id찾기
          const tagedVideos = await Video_Tag.findAll({
            where: { TagId: jobTagId },
          });
          const tagedVideosId = tagedVideos.map((item) => item.dataValues.VideoId);

          const sectionOneVideo = await Video.findAll({
            where: { id: tagedVideosId },
            attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                ),
                "isSave",
              ],
            ],
            include: [
              {
                model: Tag,
                as: "VideoTags",
                attributes: ["id", "name"],
                through: { attributes: [] },
              }
            ],
            order: sequelize.literal("rand()"),
            limit: 10
          });

          const sectionOnesId = sectionOneVideo.map((item) => item.dataValues.id);


          if (sectionOnesId.length < 10) {
            const randomVideos = await Video.findAll({
              where: {
                id: {
                  [Op.and]: [
                    { [Op.notIn]: sectionOnesId },
                  ],
                },
              },
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],],
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ],
              order: sequelize.literal("rand()"),
              limit: 10 - sectionOnesId.length
            })
            sectionOneVideo.push(...randomVideos);
            sectionOne = sectionOneVideo;
            //sectionOne.push(titleOne);

          } else {
            sectionOne = sectionOneVideo;
            //sectionOne.push(titleOne);
          };
        }


        /*
        관심사 기반 추천하기
        return sectionTwo
        2-2군
        */
        // 사용자 관심사 불러오기

        const userInterst = await User_Keyword.findAll({
          where: {
            UserId: user
          },
          attributes: ["keywordId"],
          through: { attributes: [] }
        });
        const userInterestId = userInterst.map((item) => item.dataValues.keywordId);

        const getkeywordName = await Keyword.findOne({
          where: {
            id: userInterestId
          },
          attributes: ["name"]
        });
        const keywordName = getkeywordName.dataValues.name;

        const titleTwo = {};
        titleTwo['title'] = "|" + keywordName + "|" + "에 관한 모티브";
        titleTwo['subtitle'] = "관심사를 기반으로 추천 영상을 보여드립니다.";

        let getTags;
        //관심사 id가 가진 태그 불러오기
        getTags = await Tag.findAll({
          where: {
            keywordId: {
              [Op.and]: [
                { [Op.in]: userInterestId }
              ],
            }
          },
          attributes: ["id"]
        });
        if (!getTags) {
          getTags = await Tag.findAll({
            attributes: ["id"]
          });
        }
        const getTagsId = getTags.map((item) => item.dataValues.id);



        // 사용자가 이미 시청한 영상
        const alreadyWatched = await View.findAll({
          where: {
            UserId: user,
          },
          attributes: ["VideoId"],
        });
        const alreadyWatchedId = alreadyWatched.map((item) => item.dataValues.VideoId)


        // 유사 태그 동영상 불러오기
        const similarTag = await Video_Tag.findAll({
          where: {
            TagId: getTagsId,
          },
          attributes: [sequelize.fn("DISTINCT", "Video_Tag.VideoId"), "VideoId"],
          order: sequelize.literal("rand()"),
          limit: 10,
        });
        const similarTags = similarTag.map((item) => item.dataValues.VideoId);

        // Case1,2를 제외한 추천 영상 불러오기 (제외:현재 동영상, 이미 본 영상, 추가: 유사 태그)
        const sectionTwoVideos = await Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.in]: similarTags },
                { [Op.notIn]: alreadyWatchedId },
              ],
            },
          },
          attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
          order: sequelize.literal("rand()"),
          limit: 10
        });
        const recommands = sectionTwoVideos.map((item) => item.dataValues.id);

        recommandsLength = recommands.length;

        if (recommandsLength < 10) {
          const otherVideos = await Video.findAll({
            where: {
              id: {
                [Op.and]: [
                  { [Op.notIn]: alreadyWatchedId },
                  { [Op.notIn]: recommands },
                ],
              },
            },
            attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                ),
                "isSave",
              ],
            ],
            include: [
              {
                model: Tag,
                as: "VideoTags",
                attributes: ["id", "name"],
                through: { attributes: [] },
              }
            ],
            order: sequelize.literal("rand()"),
            limit: 10 - recommandsLength,
          });
          const otherVideosId = otherVideos.map((item) => item.dataValues.id);
          //여기서도 동영상 수가 적으면 이미 본 영상에서 가져와야 하는 로직 추가
          const noVideos = recommandsLength + otherVideosId.length;

          if (noVideos < 10) {
            const randomVideos = await Video.findAll({
              where: {
                id: {
                  [Op.and]: {
                    [Op.notIn]: similarTags
                  }
                }
              },
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ],
              order: sequelize.literal("rand()"),
              limit: 10 - noVideos,
            });
            sectionTwoVideos.push(...randomVideos);
            sectionTwo = sectionTwoVideos;
            sectionTwo.push(titleTwo);

          } else {
            sectionTwoVideos.push(...otherVideos);
            sectionTwo = sectionTwoVideos;
            //sectionTwo.push(titleTwo);
          };

        } else {
          sectionTwo = sectionTwoVideos;
          //sectionTwo.push(titleTwo);
        }


        //3군 섹션 4개 랜덤하게 불러오기 
        const unhidedSection = await Section.findAll({
          where: { hide: "0" },
          order: sequelize.literal("rand()"),
          limit: 4
        });

        const unhidedSectionId = unhidedSection.map((item) => item.dataValues.id);

        const videoSections = await Video_Section.findAll({
          where: {
            SectionId: {
              [Op.and]: [
                { [Op.in]: unhidedSectionId },
              ],
            },
          },
        });

        const sectionSet = new Set(videoSections.map(item => item.dataValues.SectionId));
        const sectionList = [...sectionSet.values()]

        // Secion 3번째 
        const getSectionThreeTitle = await Section.findOne({
          where: { id: sectionList[0] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const sectionThreeVideo = await Video_Section.findAll({
          where: {
            SectionId: sectionList[0]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },

          ]
        });
        sectionThree = sectionThreeVideo.map((item) => item.dataValues.Video);
        //sectionThree.push(getSectionThreeTitle);

        // Section 4번째
        const getSectionFourTitle = await Section.findOne({
          where: { id: sectionList[1] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const sectionFourVideo = await Video_Section.findAll({
          where: {
            SectionId: sectionList[1]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionFour = sectionFourVideo.map((item) => item.dataValues.Video);
        //sectionFour.push(getSectionFourTitle);

        // Section 5번째
        const getSectionFiveTitle = await Section.findOne({
          where: { id: sectionList[2] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const sectionFiveVideo = await Video_Section.findAll({
          where: {
            SectionId: sectionList[2]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionFive = sectionFiveVideo.map((item) => item.dataValues.Video);
        //sectionFive.push(getSectionFiveTitle);

        // Section 6번째
        const getSectionSixTitle = await Section.findOne({
          where: { id: sectionList[3] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const sectionSixVideo = await Video_Section.findAll({
          where: {
            SectionId: sectionList[3]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionSix = sectionSixVideo.map((item) => item.dataValues.Video);
        //sectionSix.push(getSectionSixTitle);
        /*
        const titleSeven = {};
        titleSeven['title'] = "이 영상을 본 80%가 워크스페이스로 바로 이동했어요!";

        sectionSeven = await Video.findOne({
          where: {
            id: '2'
          },
          attributes: ["id", "thumbnailImageUrl"],
          nest: true
        });
        const sectionSevens = [];
        sectionSevens.push(sectionSeven);
        */


        // Json to array
        //const sectionVideoResult = { sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive, sectionSix, sectionSevens };
        const sectionVideoResult = { sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive, sectionSix };
        const result = [];
        for (i in sectionVideoResult) {
          result.push(sectionVideoResult[i])
        };

        //const titleList = { titleOne, titleTwo, getSectionThreeTitle, getSectionFourTitle, getSectionFiveTitle, getSectionSixTitle, titleSeven };
        const titleList = { titleOne, titleTwo, getSectionThreeTitle, getSectionFourTitle, getSectionFiveTitle, getSectionSixTitle }
        const titleResult = [];
        for (i in titleList) {
          titleResult.push(titleList[i])
        };

        const finalresult = result;
        finalresult.push(titleResult);

        return res
          .status(sc.OK)
          .send(ut.success(sc.OK, rm.GET_VIDEO_RECOMMAND_SUCCESS, finalresult));
      } else {

        const unhidedSection = await Section.findAll({
          where: { hide: "0" },
          order: sequelize.literal("rand()"),
          limit: 6
        });

        const unhidedSectionId = unhidedSection.map((item) => item.dataValues.id);

        const videoSections = await Video_Section.findAll({
          where: {
            SectionId: {
              [Op.and]: [
                { [Op.in]: unhidedSectionId },
              ],
            },
          },
        });
        const sectionSet = new Set(videoSections.map(item => item.dataValues.SectionId));
        const sectionList = [...sectionSet.values()]


        // Secion 1번째
        const getSectionOneTitle = await Section.findOne({
          where: { id: sectionList[0] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const getSecionOne = await Video_Section.findAll({
          where: {
            SectionId: sectionList[0]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
            },
            {
              model: Video,
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionOne = getSecionOne.map((item) => item.dataValues.Video);
        //sectionOne.push(getSectionOneTitle);


        // Section 2번째
        const getSectionTwoTitle = await Section.findOne({
          where: { id: sectionList[1] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const getSectionTwo = await Video_Section.findAll({
          where: {
            SectionId: sectionList[1]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
            },
            {
              model: Video,
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionTwo = getSectionTwo.map((item) => item.dataValues.Video);
        //sectionTwo.push(getSectionTwoTitle);



        // Secion 3번째 
        const getSectionThreeTitle = await Section.findOne({
          where: { id: sectionList[2] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const getSectionThree = await Video_Section.findAll({
          where: {
            SectionId: sectionList[2]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
            },
            {
              model: Video,
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionThree = getSectionThree.map((item) => item.dataValues.Video);
        //sectionThree.push(getSectionThreeTitle);

        // Section 4번째
        const getSectionFourTitle = await Section.findOne({
          where: { id: sectionList[3] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const getSectionFour = await Video_Section.findAll({
          where: {
            SectionId: sectionList[3]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
            },
            {
              model: Video,
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionFour = getSectionFour.map((item) => item.dataValues.Video);
        //sectionFour.push(getSectionFourTitle);


        // Section 5번째
        const getSectionFiveTitle = await Section.findOne({
          where: { id: sectionList[4] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const getSectionFive = await Video_Section.findAll({
          where: {
            SectionId: sectionList[4]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
            },
            {
              model: Video,
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ]
        });
        sectionFive = getSectionFive.map((item) => item.dataValues.Video);
        //sectionFive = { sectionFive, ...getSectionFiveTitle };


        // Section 6번째
        const getSectionSixTitle = await Section.findOne({
          where: { id: sectionList[5] },
          attributes: ["title", "subtitle"],
          raw: true
        });

        const getSectionSix = await Video_Section.findAll({
          where: {
            SectionId: sectionList[5]
          },
          attributes: ["SectionId"],
          include: [
            {
              model: Video,
              attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName",
                [
                  Sequelize.literal(
                    `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                  ),
                  "isSave",
                ],
              ],
            },
            {
              model: Video,
              include: [
                {
                  model: Tag,
                  as: "VideoTags",
                  attributes: ["id", "name"],
                  through: { attributes: [] },
                }
              ]
            },
          ],
        });
        sectionSix = getSectionSix.map((item) => item.dataValues.Video);
        //sectionSix = { sectionSix, ...getSectionSixTitle };

        const titleSeven = {};
        titleSeven['title'] = "이 영상을 본 80%가 워크스페이스로 바로 이동했어요!";

        sectionSeven = await Video.findOne({
          where: {
            id: '2'
          },
          attributes: ["id", "thumbnailImageUrl"]
        });

        const sectionSevens = [];
        sectionSevens.push(sectionSeven);

        //const sectionListUp = { sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive, sectionSix, sectionSevens };
        const sectionListUp = { sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive, sectionSix };
        const sectionResult = []
        for (i in sectionListUp) {
          sectionResult.push(sectionListUp[i])
        }

        //const titleList = { getSectionOneTitle, getSectionTwoTitle, getSectionThreeTitle, getSectionFourTitle, getSectionFiveTitle, getSectionSixTitle, titleSeven };
        const titleList = { getSectionOneTitle, getSectionTwoTitle, getSectionThreeTitle, getSectionFourTitle, getSectionFiveTitle, getSectionSixTitle };
        const titleResult = []
        for (i in titleList) {
          titleResult.push(titleList[i])
        }

        const finalResult = sectionResult;
        finalResult.push(titleResult);

        return res
          .status(sc.OK)
          .send(ut.success(sc.OK, rm.GET_VIDEO_RECOMMAND_SUCCESS, finalResult));
      };


    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_VIDEO_RECOMMAND_FAIL));
    }
  },


  /*
  // 2군 세션 추천하기 (관심사 / 직군 기반)
  recommanVideos: async (req, res) => {
    const { id: user } = req.user;
    try {
      // 사용자 관심사 불러오기
      const userInterst = await User_Keyword.findAll({
        where: {
          UserId: user
        },
        attributes: ["keywordId"],
        through: { attributes: [] }
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
      

      // 1. user 직군 불러오기
      const userJob = await User.findOne({
        where: { id: user }
      });
      const userJobId = userJob.JobId;

      // 2. 해당 직권의 태그 id값 검색
      const findJobName = await Job.findOne({
        where: { id: userJobId },
        attributes: ["name"]
      });
      const jobName = findJobName.dataValues.name;

      // 3. 직군의 TagId값 찾기
      const jobTag = await Tag.findOne({
        where: { name: jobName }
      });
      const jobTagId = jobTag.dataValues.id;
      console.log(jobTagId);

      // 3-1. 해당 태그를 가진 비디오 id찾기
      const tagedVideos = await Video_Tag.findAll({
        where: { TagId: jobTagId },
      });
      const tagedVideosId = tagedVideos.map((item) => item.dataValues.VideoId);


      let sectionOne;
      const sectionOneVideo = await Video.findAll({
        where: { id: tagedVideosId },
        attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName"],
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          }
        ],
        order: sequelize.literal("rand()"),
      });

      const sectionOneLen = sectionOneVideo.map((item) => item.dataValues.id);
      const sectionOneLength = sectionOneLen.length;

      if (sectionOneLength < 6) {
        const randomVideos = Video.findAll({
          where: {
            id: {
              [Op.and]: [
                { [Op.notIn]: sectionOneLen },
              ],
            },
          },
          attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName"],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
          order: sequelize.literal("rand()"),
          limit: 6 - sectionOneLength
        })
        sectionOne = { ...sectionOneVideo, randomVideos }
      }

      //10개 미만인 경우 동영상 추가


      // 2. 직군의 이름 찾기

      // 2-2군: 사용자 관심사 기반 유사한 영상 추천하기 
      /*
        case1(제외): 이미 시청한 영상인 경우 제외
        case2(추가): 사용자 관심사 기준 태그 동영상 불러오기
        case3(예외): 불러온 동영상 갯수가 4개 미만일 경우(4개 기준은 기획과 논의 필요)
      

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
        attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName"],
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
          attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName"],
          order: sequelize.literal("rand()"),
          limit: 7 - recommandsLength,
        });
        //여기서도 동영상 수가 적으면 이미 본 영상에서 가져와야 하는 로직 추가
        recommandVideos.push(...otherVideos);
      };


      // 3군 어드민이 설정한 세션 불러오기

      const checkHomeSection = await Section.findAll({
        where: { hide: "0" },
        include: [{
          model: Video, as: "SectionVideos", attributes: ["id", "title", "videoLength", "thumbnailImageUrl", "viewCount", "videoGif", "channelName"]
          , through: { attributes: [] }
        }],
        order: sequelize.literal("rand()"),
        limit: 4
      });
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, rm.GET_VIDEO_RECOMMAND_SUCCESS, { sectionOne, recommandVideos, checkHomeSection }));

    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_VIDEO_RECOMMAND_FAIL));
    }
  },
  */

  //홈화면 비디오 읽기
  bannerVideos: async (req, res) => {
    const video = req.query.filters;
    const { id: user } = req.user;
    const DB_NAME =
      process.env.NODE_ENV === "production" ? "MOTIIV_PROD" : "MOTIIV_DEV"
    try {
      //Top10 동영상
      const toptenVideos = await Video.findAll({
        attributes: [
          "id",
          "title",
          "description",
          "thumbnailImageUrl",
          "viewCount",
          "videoLength",
          "channelName",
          "videoGif",
          "createdAt",
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM ${DB_NAME}.Like WHERE ${DB_NAME}.Like.VideoId = ${DB_NAME}.Video.id)`,
            ),
            "likeCnt",
          ],
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
            ),
            "isSave",
          ],
        ],
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });

      const top_map = new Map();
      toptenVideos.map((view) => {
        top_map.set(view.VideoId, view.createdAt);
      });
      const toptensId = toptenVideos.map((item) => item.dataValues.VideoId)

      toptenVideos.map((tops, i) => {
        const createdAt = top_map.get(tops.dataValues.id);
        toptenVideos[i].dataValues.createdAt = dayjs(createdAt).format('YYYY.MM.DD');
      });


      const toptenView = toptenVideos.map((item) => item.dataValues.viewCount);
      const toptenLike = toptenVideos.map((item) => item.dataValues.likeCnt);
      const orderCnt = [];
      for (i = 0; i < toptenVideos.length; i++) {
        orderCnt.push([i] + Math.pow(toptenLike[i], 2));
      };

      for (i = 0; i < toptenVideos.length; i++) {
        toptenVideos[i].totalCnt = orderCnt[i];
      };

      toptenVideos.sort((a, b) => {
        return b.totalCnt - a.totalCnt;
      });

      const toptenVideo = [];
      for (i = 0; i < 10; i++) {
        toptenVideo.push(toptenVideos[i]);
      };

      const yesterday = ((d) => new Date(d.setDate(d.getDate() - 1)))(
        new Date(),
      );
      const today = ((d) => new Date(d.setDate(d.getDate())))(new Date());


      /* 배너 동영상 */
      // 어제 조회수가 가장 높았던 동영상 => View에서 어제 동영상 목록 가져오기 => 동영상 갯수가 가장 많은것 순서대로 sort

      /*
      const mostView = await View.findAll({
        group: ["VideoId"],
        where: {
          updatedAt: {
            [Op.and]: [{ [Op.lte]: today }, { [Op.gte]: yesterday }],
          },
        },
        attributes: ["VideoId", [sequelize.fn("Count", "VideoId"), "viewCnt"]],
        order: [[sequelize.literal("viewCnt"), "DESC"]],
        limit: 1,
      });
      const mostViewId = mostView.map((item) => item.dataValues.VideoId);
      */
      const mostView = await Viewhistory.findAll({
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

      let mostViewVideo;
      // 어제 조회수가 가장 높았던 영상 추출
      mostViewVideo = await Video.findOne({
        where: { id: mostViewId },
        attributes: [
          "id",
          "title",
          "description",
          "thumbnailImageUrl",
          "videoLength",
          "videoGif",
        ],
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });


      if (!mostViewVideo) {
        mostViewVideo = await Video.findOne({
          where: { id: '3' },
          attributes: [
            "id",
            "title",
            "description",
            "thumbnailImageUrl",
            "videoLength",
            "videoGif",
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        });
      };


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
      });

      const mostLikeIds = mostLike.map((item) => item.dataValues.VideoId);
      let mostLikeId = [];


      // 좋아요와 조회수 값이 일치하는 경우도 처리해야함
      if (mostViewId == mostLikeIds) {
        mostLikeId = mostLikeIds[1];
      } else {
        mostLikeId = mostLikeIds[0];
      };
      console.log(mostLikeId);
      let mostLikeVideo;

      if (mostLikeId) {
        mostLikeVideo = await Video.findOne({
          where: { id: mostLikeId },
          attributes: [
            "id",
            "title",
            "description",
            "thumbnailImageUrl",
            "videoLength",
            "videoGif",
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        });

      } else {
        mostLikeVideo = await Video.findOne({
          where: { id: '20' },
          attributes: [
            "id",
            "title",
            "description",
            "thumbnailImageUrl",
            "videoLength",
            "videoGif",
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        });
      }


      // 3번째 배너 비디오 임의값 넣기
      const thirdVideos = await Video.findOne({
        where: { id: '83' },
        attributes: [
          "id",
          "title",
          "description",
          "thumbnailImageUrl",
          "videoLength",
          "videoGif",
        ],
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });

      //광고 배너
      const adTitle = {};
      adTitle['title'] = "이 영상을 본 80%가 워크스페이스로 바로 이동했어요!";

      const adBanner = await Video.findOne({
        where: {
          id: '3'
        },
        attributes: ["id", "thumbnailImageUrl"],
      });
      adBanners = [];
      adBanners.push(adBanner);
      adBanners.push(adTitle);

      return res.status(sc.OK).send(
        ut.success(sc.OK, rm.GET_ALL_POST_SUCCESS, {
          toptenVideo,
          mostViewVideo,
          mostLikeVideo,
          thirdVideos,
          adBanners
        }),
      );

    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_ALL_POST_FAIL));
    }
  },

  getMyMotiiv: async (req, res) => {
    const { id: user } = req.user;

    try {
      /* 1. 가장 많이 본 모티브 */
      const mostViewMy = await View.findAll({
        attributes: ["VideoId", "UserCnt"],
        where: {
          UserId: user
        }
      });

      const most_map = new Map();
      mostViewMy.map((view) => {
        most_map.set(view.VideoId, view.UserCnt);
      });
      const mostViewMyId = mostViewMy.map((item) => item.dataValues.VideoId)

      const mostViewMyMotiiv = await Video.findAll({
        attributes: ['id', 'title', 'videoLength', 'thumbnailImageUrl', 'viewCount', 'channelName', "videoGif"],
        where: {
          id: mostViewMyId
        },
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          }
        ],
      });

      mostViewMyMotiiv.map((mostViewed, i) => {
        const UserCnt = most_map.get(mostViewed.dataValues.id);
        mostViewMyMotiiv[i].dataValues.UserCnt = UserCnt;
      });

      const mostViewSort = mostViewMyMotiiv.sort((a, b) => {
        return b.dataValues.UserCnt - a.dataValues.UserCnt;
      });

      // 내림차순 or 오름차순
      //사용자 시청 기록 불러오기

      /* 2. 내가 저장한 모티브 */
      const savedMotiiv = await Save.findAll({
        attributes: ['VideoId', 'createdAt'],
        where: {
          UserId: user
        },
      });
      const save_map = new Map();
      savedMotiiv.map((save) => {
        save_map.set(save.VideoId, save.createdAt);
      });
      const savedMotiivId = savedMotiiv.map((item) => item.dataValues.VideoId);

      const recentSavedVideos = await Video.findAll({
        // 배열
        attributes: ['id', 'title', 'videoLength', 'thumbnailImageUrl', 'viewCount', "videoGif", 'channelName'],
        where: {
          id: savedMotiivId,
        },
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          }
        ],
      });

      recentSavedVideos.map((savedvideo, i) => {
        const createdAt = save_map.get(savedvideo.dataValues.id); // updatedAt
        recentSavedVideos[i].dataValues.createdAt = createdAt;
      });

      const savedResult = recentSavedVideos.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      /* 3.최근 재생한 모티브 */

      const recentViews = await View.findAll({
        attributes: ['VideoId', 'updatedAt'],
        where: {
          UserId: user,
        },
      });
      const view_map = new Map();
      recentViews.map((view) => {
        view_map.set(view.VideoId, view.updatedAt);
      });
      const recentViewId = recentViews.map((item) => item.dataValues.VideoId);

      const recentViewVideos = await Video.findAll({
        // 배열
        attributes: ['id', 'title', 'videoLength', 'thumbnailImageUrl', 'viewCount', "videoGif", 'channelName', 'updatedAt'],
        where: {
          id: recentViewId,
        },
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          }
        ],
        order: [[sequelize.literal("updatedAt"), "DESC"]],
      });

      recentViewVideos.map((viewVideo, i) => {
        const updatedAt = view_map.get(viewVideo.dataValues.id); // updatedAt
        recentViewVideos[i].dataValues.updatedAt = updatedAt;
      });

      const recentViewSort = recentViewVideos.sort((a, b) => {
        return b.updatedAt - a.updatedAt;
      });

      return res
        .status(sc.OK)
        .send(
          ut.success(sc.OK, rm.GET_MYMOTIIV_VIDEOS_SUCCESS, {
            mostViewSort,
            savedResult,
            recentViewSort
          }),
        );

    } catch (err) {
      console.log(err)
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_MYMOTIIV_VIDEOS_FAIL));
    }
  },

  getCategoryKeyword: async (req, res) => {
    try {
      const keywords = await Keyword.findAll({
        attributes: ["id", "name"],
        order: [[sequelize.literal("id"), "ASC"]],
      })

      return res
        .status(sc.OK)
        .send(
          ut.success(sc.OK, rm.GET_KEYWORD_CATEGORY_SUCCESS, keywords),
        );
    } catch (err) {
      console.log(err)
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_KEYWORD_CATEGORY_FAIL));
    }
  },

  getCategory: async (req, res) => {
    const DB_NAME =
      process.env.NODE_ENV === "production" ? "MOTIIV_PROD" : "MOTIIV_DEV"

    const { id: user } = req.user;
    const keyword = req.params.keyword;
    const filter = req.params.filters;

    try {
      let getFilterVideoId;
      // 직군(keyword) 필터링 (keyword==0 => 전체보기)
      if (keyword == 0) {
        const filterKeywords = await Video.findAll({
          attributes: ["id"]
        });
        const getFilterVideoIds = filterKeywords.map((item) => item.dataValues.id);
        getFilterVideoId = Array.from(new Set(getFilterVideoIds));

      } else {
        const filterKeywords = await Keyword.findAll({
          where: { id: keyword }
        });
        const filterKeywordId = filterKeywords.map((item) => item.dataValues.id);

        //keyword의 태그값 불러오기
        const keywordTags = await Tag.findAll({
          where: {
            KeywordId: {
              [Op.and]: [
                { [Op.in]: filterKeywordId }
              ],
            }
          },
        });
        const keywordTagsId = keywordTags.map((item) => item.dataValues.id);

        const getFilterVideo = await Video_Tag.findAll({
          where: { TagId: keywordTagsId },
          attributes: ["VideoId"]
        });
        const getFilterVideoIds = getFilterVideo.map((item) => item.dataValues.VideoId);
        getFilterVideoId = Array.from(new Set(getFilterVideoIds));
      }


      if (filter == 'new') {
        const filteredVideo = await Video.findAll({
          //group: ["id"],
          where: { id: getFilterVideoId },
          attributes: ['id', 'title', 'videoLength', 'thumbnailImageUrl', 'viewCount', 'channelName', "videoGif", 'createdAt',
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
          order: [[sequelize.literal("createdAt"), "DESC"]],
        });
        const calCnt = filteredVideo.map((item) => item.dataValues.id);
        const videoCnt = calCnt.length;

        return res
          .status(sc.OK)
          .send(
            ut.success(sc.OK, rm.GET_FILTER_KEYWORD_CATEGORY_SUCCESS, { filteredVideo, videoCnt }),
          );
      } else if (filter == 'like') {
        const filteredVideo = await Video.findAll({
          where: {
            id: getFilterVideoId
          },
          attributes: [
            "id",
            "title",
            "videoLength",
            "thumbnailImageUrl",
            "viewCount",
            "videoGif",
            "channelName",
            "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Like WHERE ${DB_NAME}.Like.VideoId = ${DB_NAME}.Video.id)`,
              ),
              "LikeCount",
            ],
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          order: [[Sequelize.literal("LikeCount"), "DESC"]],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
        });
        const calCnt = filteredVideo.map((item) => item.dataValues.id);
        const videoCnt = calCnt.length;

        return res
          .status(sc.OK)
          .send(
            ut.success(sc.OK, rm.GET_FILTER_KEYWORD_CATEGORY_SUCCESS, { filteredVideo, videoCnt }),
          );

      } else if (filter == 'save') {
        const filteredVideo = await Video.findAll({
          where: {
            id: getFilterVideoId
          },
          attributes: [
            "id",
            "title",
            "videoLength",
            "thumbnailImageUrl",
            "viewCount",
            "videoGif",
            "channelName",
            "createdAt",
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE ${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id)`,
              ),
              "SaveCount",
            ],
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          order: [[Sequelize.literal("SaveCount"), "DESC"]],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
        });
        const calCnt = filteredVideo.map((item) => item.dataValues.id);
        const videoCnt = calCnt.length;

        return res
          .status(sc.OK)
          .send(
            ut.success(sc.OK, rm.GET_FILTER_KEYWORD_CATEGORY_SUCCESS, { filteredVideo, videoCnt }),
          );
      } else if (filter == 'view') {
        const filteredVideo = await Video.findAll({
          where: { id: getFilterVideoId },
          attributes: ['id', 'title', 'videoLength', 'thumbnailImageUrl', 'viewCount', 'channelName', "videoGif", 'createdAt',
            [
              Sequelize.literal(
                `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.Video.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
              ),
              "isSave",
            ],
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }
          ],
          order: [[sequelize.literal("viewCount"), "DESC"]],
        });
        const calCnt = filteredVideo.map((item) => item.dataValues.id);
        const videoCnt = calCnt.length;
        return res
          .status(sc.OK)
          .send(
            ut.success(sc.OK, rm.GET_FILTER_KEYWORD_CATEGORY_SUCCESS, { filteredVideo, videoCnt }),
          );
      }
    }
    catch (err) {
      console.log(err)
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_ALL_CATEGORY_FAIL));
    }
  },

  // 태그 비디오 불러오기

  TagVideo: async (req, res) => {
    const DB_NAME =
      process.env.NODE_ENV === "production" ? "MOTIIV_PROD" : "MOTIIV_DEV";
    const { id: user } = req.user
    const tag = req.params.tagId;
    let findTagVideo;

    try {
      if (user) {
        findTagVideo = await Tag.findAll({
          attributes: { exclude: ["createdAt", "updatedAt", "KeywordId"] },
          include: [{
            model: Video,
            as: "TaggedVideos",
            attributes: ['id', 'title', 'videoLength', 'thumbnailImageUrl', 'viewCount', 'channelName', "videoGif", 'createdAt',
              [
                Sequelize.literal(
                  `(SELECT COUNT(*) FROM ${DB_NAME}.Save WHERE (${DB_NAME}.Save.VideoId = ${DB_NAME}.TaggedVideos.id) AND (${DB_NAME}.Save.UserId = ${user}))`,
                ),
                "isSave",
              ],
            ],
            through: { attributes: [] },
            include: [{
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }]
          }],
          where: { id: tag },
          through: { attributes: [] },
          plain: true
        });
        //const findTagVideoId = findTagVideo.map((item) => item.VideoTags.id);
        //console.log(findTagVideoId)

        return res
          .status(sc.OK)
          .send(
            ut.success(sc.OK, rm.GET_CATEGORY_TAGS_SUCCESS, findTagVideo),
          );
      } else {
        findTagVideo = await Tag.findAll({
          attributes: { exclude: ["createdAt", "updatedAt", "KeywordId"] },
          include: [{
            model: Video,
            as: "TaggedVideos",
            attributes: ['id', 'title', 'videoLength', 'thumbnailImageUrl', 'viewCount', 'channelName', "videoGif", 'createdAt'],
            through: { attributes: [] },
            include: [{
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            }]
          }],
          where: { id: tag },
          through: { attributes: [] },
        });
        return res
          .status(sc.OK)
          .send(
            ut.success(sc.OK, rm.GET_CATEGORY_TAGS_SUCCESS, ...findTagVideo),
          );
      };

    } catch (err) {
      console.log(err)
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_CATEGORY_TAGS_FAIL));
    }
  },

  // 동영상 디테일
  getDetail: async (req, res) => {
    const video = req.params.videoId;
    const { id: user } = req.user;
    console.log(video)
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
          "id",
          "title",
          "description",
          "videoUrl",
          "viewCount",
          "channelName",
          "videoGif",
          "createdAt",
        ],
        include: [
          {
            model: Tag,
            as: "VideoTags",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });

      details.dataValues.createdAt = dayjs(details.dataValues.createdAt).format('YYYY.MM.DD');

      if (user) {
        const like = await Like.findOne({
          where: {
            VideoId: video,
            UserId: user
          }
        });

        const save = await Save.findOne({
          where: {
            VideoId: video,
            UserId: user
          }
        });

        const isLiked = like ? true : false;
        const isSaved = save ? true : false;

        const videoDetailData = { ...details.dataValues, isLiked, isSaved };

        /* 조회수 증가 */

        // Video 테이블 조회수 증가
        let cnt = details.viewCount + 1;
        await Video.update(
          {
            viewCount: cnt,
          },
          { where: { id: video } },
        );

        // Viewhistory 테이블 조회수 증가
        await Viewhistory.create({
          videoId: video,
          userId: user
        })

        const viewcount = await View.findOne({
          where: {
            VideoId: video,
            UserId: user,
          },
          attributes: ["UserCnt"],
        });

        if (viewcount) {
          viewcounts = viewcount.dataValues.UserCnt;
          viewcounts += 1;

          await View.update(
            {
              UserCnt: viewcounts,
            },
            { where: { VideoId: video, UserId: user } },
          );

        } else {
          await View.create({
            VideoId: video,
            UserId: user,
            UserCnt: 1
          });
        };
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

        // Case2. 해당 영상의 태그를 가진 다른 영상 (포함)
        const taggedVideos = details.dataValues.VideoTags;
        const tagId = taggedVideos.map((item) => item.dataValues.id);


        // 유사 태그 동영상 불러오기
        const similarTag = await Video_Tag.findAll({
          where: {
            tagId,
          },
          attributes: [sequelize.fn("DISTINCT", "Video_Tag.VideoId"), "VideoId"],
          order: sequelize.literal("rand()"),
          limit: 6,
        });
        const similarTags = similarTag.map((item) => item.dataValues.VideoId);
        alreadyWatchedId.push(video);

        console.log(similarTags);
        console.log(alreadyWatchedId);
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
          attributes: ["id", "title", "videoUrl", "thumbnailImageUrl", "videoLength", "videoGif", "channelName"],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
          order: sequelize.literal("rand()"),
          limit: 6
        });
        recommands = recommandVideos.map((item) => item.dataValues.id);
        console.log(recommands);
        recommandsLength = recommands.length;
        console.log(recommandsLength);

        if (recommandsLength < 6) {
          const otherVideos = await Video.findAll({
            where: {
              id: {
                [Op.and]: [
                  { [Op.notIn]: alreadyWatchedId },
                  { [Op.notIn]: recommands },
                ],
              },
            },
            attributes: ["id", "title", "videoUrl", "thumbnailImageUrl", "videoLength", "videoGif", "channelName"],
            include: [
              {
                model: Tag,
                as: "VideoTags",
                attributes: ["id", "name"],
                through: { attributes: [] },
              },
            ],
            order: sequelize.literal("rand()"),
            limit: 6 - recommandsLength,
          });
          recommandVideos.push(...otherVideos);
        }
        // 여기서도 하나도 없으면 동영상 추가

        const recommandVideosLen = recommandVideos.map((item) => item.dataValues.id);
        const recommandVideosLength = recommandVideosLen.length;

        if (recommandVideosLength < 6) {
          const otherVideo = await Video.findAll({
            attributes: ["id", "title", "videoUrl", "thumbnailImageUrl", "videoLength", "videoGif", "channelName"],
            include: [
              {
                model: Tag,
                as: "VideoTags",
                attributes: ["id", "name"],
                through: { attributes: [] },
              },
            ],
            order: sequelize.literal("rand()"),
            limit: 6 - recommandVideosLength
          });
          recommandVideos.push(...otherVideo);

          return res.status(sc.OK).send(
            ut.success(sc.OK, rm.GET_VIDEO_DETAIL_SUCCESS, {
              videoDetailData,
              recommandVideos,
            }),
          );
        } else {
          const recommandVideos = await Video.findAll({
            where: {
              id: {
                [Op.not]: video
              }
            },
            attributes: ["id", "title", "videoUrl", "thumbnailImageUrl", "videoLength", "videoGif", "channelName"],
            include: [
              {
                model: Tag,
                as: "VideoTags",
                attributes: ["id", "name"],
                through: { attributes: [] },
              },
            ],
            order: sequelize.literal("rand()"),
            limit: 6
          });

          return res.status(sc.OK).send(
            ut.success(sc.OK, rm.GET_VIDEO_DETAIL_SUCCESS, {
              videoDetailData,
              recommandVideos,
            }),
          );
        }
      } else {
        /* 조회수 증가 */
        // Video 테이블 조회수 증가

        const details = await Video.findOne({
          where: {
            id: video,
          },
          attributes: [
            "id",
            "title",
            "description",
            "videoUrl",
            "viewCount",
            "channelName",
            "videoGif",
            "createdAt",
          ],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        });
        let cnt = details.viewCount + 1;
        await Video.update(
          {
            viewCount: cnt,
          },
          { where: { id: video } },
        );

        details.dataValues.createdAt = dayjs(details.dataValues.createdAt).format('YYYY.MM.DD');

        const isLiked = false;
        const isSaved = false;

        const videoDetailData = { ...details.dataValues, isLiked, isSaved };

        const recommandVideos = await Video.findAll({
          where: {
            id: {
              [Op.not]: video
            }
          },
          attributes: ["id", "title", "videoUrl", "thumbnailImageUrl", "videoLength", "videoGif", "channelName"],
          include: [
            {
              model: Tag,
              as: "VideoTags",
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
          order: sequelize.literal("rand()"),
          limit: 6
        });
        return res.status(sc.OK).send(
          ut.success(sc.OK, rm.GET_VIDEO_DETAIL_SUCCESS, {
            videoDetailData,
            recommandVideos,
          }),
        );

      }


    } catch (err) {
      console.log(err);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_VIDEO_DETAIL_FAIL));
    }
  },

  likeControl: async (req, res) => {
    const video = req.params.videoId;
    const { id: user } = req.user;

    try {
      const isLikeTable = await Like.findAll({
        where: { VideoId: video, UserId: user }
      });
      const isLike = isLikeTable.map((item) => item.dataValues.VideoId);


      if (isLike.length) {
        await Like.destroy({
          where: {
            VideoId: video,
            UserId: user,
          },
        });
        const isLikeTables = await Like.findAll({
          where: { VideoId: video, UserId: user }
        });

        if (isLikeTables.length) {
          const isLikes = true;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.DELETE_VIDEO_LIKE_SUCCESS, isLikes));
        } else {
          const isLikes = false;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.DELETE_VIDEO_LIKE_SUCCESS, isLikes));
        }



      } else {
        const like = await Like.create({ VideoId: video, UserId: user });
        const isLikeTable = await Like.findAll({
          where: { VideoId: video, UserId: user }
        });

        if (isLikeTable.length) {
          const isLikes = true;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.POST_VIDEO_LIKE_SUCCESS, isLikes));
        } else {
          const isLikes = false;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.POST_VIDEO_LIKE_FAIL, isLikes));
        }

      }
    } catch (err) {
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.POST_VIDEO_LIKE_FAIL));
    }

  },

  saveControl: async (req, res) => {
    const video = req.params.videoId;
    const { id: user } = req.user;

    try {
      const isSaveTable = await Save.findAll({
        where: { VideoId: video, UserId: user }
      });
      const isSave = isSaveTable.map((item) => item.dataValues.VideoId);
      console.log(isSave);
      if (isSave.length) {
        await Save.destroy({
          where: {
            VideoId: video,
            UserId: user,
          },
        });

        const isSaveTables = await Save.findAll({
          where: { VideoId: video, UserId: user }
        });

        if (isSaveTables.length) {
          const isSaved = true;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.DELETE_VIDEO_SAVE_FAIL, isSaved));
        } else {
          const isSaved = false;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.DELETE_VIDEO_SAVE_SUCCESS, isSaved));
        };
      } else {
        const save = await Save.create({ VideoId: video, UserId: user });
        const isSaveTables = await Save.findAll({
          where: { VideoId: video, UserId: user }
        });
        if (isSaveTables.length) {
          const isSaved = true;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.POST_VIDEO_SAVE_SUCCESS, isSaved));
        } else {
          const isSaved = false;
          return res
            .status(sc.OK)
            .send(ut.success(sc.OK, rm.POST_VIDEO_SAVE_FAIL, isSaved));
        };

      }
    } catch (err) {
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.POST_VIDEO_SAVE_FAIL));
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
