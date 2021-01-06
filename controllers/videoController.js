const sequelize = require('sequelize');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');
const { Section, Tag, User, Video_Section, Video_Tag, Video, Like, Save, Workspace, View } = require('../models');
const { Sequelize } = require('sequelize');
const { STRING } = require('sequelize');
const Op = sequelize.Op;

module.exports = {
  


    //홈화면 비디오 읽기
    bannerVideos: async (req, res) => {
        const video = req.query.filters;
        try {
            // 전체 비디오 불러오기
            const video = await Video.findAll({
                group: 'id',
                attributes: ['id', 'videoUrl', 'title', 'description', 'thumbnailImageUrl', 'viewCount', 'videoLength', 'channelName',
                    [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d'), 'createdAt']
                ],

            });

            //Top10 동영상 
            const topTen = video.map(item => item.dataValues).sort((a, b) => b.viewCount - a.viewCount);
            topTens = topTen.slice(0, 10);


            //어제 날짜 포맷 변경 함수
            function getFormatDate(date) {
                var year = date.getFullYear();              //yyyy
                var month = (1 + date.getMonth());          //M
                month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
                var day = date.getDate();                   //d
                day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
                return year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
            }
            const yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
            const today = (d => new Date(d.setDate(d.getDate())))(new Date);


            /* 배너 동영상 */

            // 어제 조회수가 가장 높았던 동영상 => View에서 어제 동영상 목록 가져오기 => 동영상 갯수가 가장 많은것 순서대로 sort

            const mostView = await View.findAll({
                group: ['VideoId'],
                where: {
                    createdAt: {
                        [Op.and]: [{ [Op.lte]: today }, { [Op.gte]: yesterday }],
                    }
                },
                attributes: ['VideoId', [sequelize.fn('Count', 'VideoId'), 'viewCnt']],
                order: [[sequelize.literal('viewCnt'), 'DESC']],
                limit: 1
            });
            const mostViewId = mostView.map(item => item.dataValues.VideoId);

            // 어제 조회수가 가장 높았던 영상 추출
            const mostViewVideo = await Video.findOne({
                where: { id: mostViewId },
                attributes: ['id', 'videoUrl', 'title', 'description', 'thumbnailImageUrl', 'videoLength'],
                include: [{
                    model: Tag,
                    as: 'TaggedVideos',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                }],

            });


            // 어제 좋아요가 가장 높았던 영상   
            const mostLike = await Like.findAll({
                group: ['VideoId'],
                where: {
                    createdAt: {
                        [Op.and]: [{ [Op.lte]: today }, { [Op.gte]: yesterday }],
                    }
                },
                attributes: ['VideoId', [sequelize.fn('Count', 'VideoId'), 'likeCnt']],
                order: [[sequelize.literal('likeCnt'), 'DESC']],
                limit: 1
            });
            const mostLikeId = mostLike.map(item => item.dataValues.VideoId);
            console.log(mostLikeId);

            const mostLikeVideo = await Video.findOne({
                where: { id: mostLikeId },
                attributes: ['id', 'videoUrl', 'title', 'description', 'thumbnailImageUrl', 'videoLength'],
                include: [{
                    model: Tag,
                    as: 'TaggedVideos',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                }],
            });

            // 좋아요와 조회수 값이 일치하는 경우도 처리해야함 



            return res
                .status(sc.OK)
                .send(
                    ut.success(sc.OK, rm.GET_HOME_BANNER_SUCCES, { topTens, mostViewVideo, mostLikeVideo }
                    ));
        } catch (err) {
            console.log(err);
            return res
                .status(sc.INTERNAL_SERVER_ERROR).
                send(ut.fail(
                    sc.INTERNAL_SERVER_ERROR,
                    rm.GET_HOME_BANNER_FAIL
                ));
        }
    },


    // 동영상 디테일 
    getDetail: async (req, res) => {
        const video = req.params.videoId;
        const user = req.body.userId;

        //video id check
        if (!video) {
            res.status(400).json({
                message: "video id가 비어있습니다."
            })
            return
        }

        // get info from video
        try {

            /* 디테일 정보 불러오기 */

            //해당 동영상의 정보 불러오기
            const details = await Video.findOne({
                where: {
                    id: video,
                },
                attributes: ['title', 'description', 'videoUrl', 'viewCount', 'channelName', 'createdAt'],
                include: [{
                    model: Tag,
                    as: 'TaggedVideos',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }],
            });


            /* 조회수 증가 */

            // Video 테이블 조회수 증가
            let cnt = details.viewCount + 1;
            await Video.update({
                viewCount: cnt
            }, { where: { id: video } })

            // View 테이블 사용자별 비디오 조회수 저장
            const viewcount = await View.findAll({
                where: {
                    VideoId: video,
                    UserId: user
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
                    UserId: user
                },
                attributes: ['VideoId']
            });
            const alreadyWatchedId = alreadyWatched.map(item => item.dataValues.VideoId);
            console.log('이미 시청한 영상');
            console.log(alreadyWatchedId);


            // Case2. 해당 영상의 태그를 가진 다른 영상 (포함)
            const taggedVideos = details.dataValues.TaggedVideos;
            const tagId = taggedVideos.map(item => item.dataValues.id);


            // 유사 태그 동영상 불러오기
            const similarTag = await Video_Tag.findAll({
                where: {
                    tagId,
                },
                attributes: [sequelize.fn('DISTINCT', 'Video_Tag.VideoId'), 'VideoId'],
                order: sequelize.literal('rand()'), limit: 5
            });
            const similarTags = similarTag.map(item => item.dataValues.VideoId);

            console.log('비슷한 태그의 비디오들');
            console.log(similarTags);

            alreadyWatchedId.push(video);

            // Case1,2를 제외한 추천 영상 불러오기 (제외:현재 동영상, 이미 본 영상, 추가: 유사 태그)
            const recommandVideos = await Video.findAll({
                where: {
                    id: {
                        [Op.and]: [{ [Op.in]: similarTags }, { [Op.notIn]: alreadyWatchedId }],
                    },
                },
                attributes: ['id', 'title', 'videoUrl', 'thumbnailImageUrl'],
                order: sequelize.literal('rand()')
            });
            recommands = recommandVideos.map(item => item.dataValues.id);
            console.log(recommands);

            recommandsLength = recommands.length;

            if (recommandsLength < 4) {
                const otherVideos = await Video.findAll({
                    where: {
                        id: {
                            [Op.and]: [{ [Op.notIn]: alreadyWatchedId }, { [Op.notIn]: recommands }],
                        }
                    },
                    attributes: ['id', 'title', 'videoUrl', 'thumbnailImageUrl'],
                    order: sequelize.literal('rand()'), limit: (4 - recommandsLength)
                });
                //여기서도 동영상 수가 적으면 이미 본 영상에서 가져와야 하는 로직 추가
                recommandVideos.push(...otherVideos);
            }

            return res
                .status(sc.OK)
                .send(ut.success(sc.OK, rm.GET_VIDEO_DETAIL_SUCCESS, { details, recommandVideos }));

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
        const user = req.body.userId;

        try {
            const like = await Like.create({ VideoId: video, UserId: user });

            // 중복 처리 추가

            return res
                .status(sc.OK)
                .send(ut.success(sc.OK, rm.POST_VIDEO_LIKE_SUCCESS, like));
        } catch (err) {
            console.log(err)
            return res
                .status(sc.INTERNAL_SERVER_ERROR)
                .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.POST_VIDEO_LIKE_FAIL));
        }
    },

    //좋아요 취소
    deleteLike: async (req, res) => {
        const video = req.params.videoId;
        const user = req.body.userId;
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
        const user = req.body.userId;

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
        const user = req.body.userId;

        try {
            await Save.destroy({
                where: {
                    VideoId: video,
                    UserId: user
                }
            });
            return res
                .status(sc.Ok)
                .send(ut.success(sc.OK, rm.DELETE_VIDEO_SAVE_SUCCESS));
        } catch (err) {
            console.log(err);
            return res
                .status(sc.INTERNAL_SERVER_ERROR)
                .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.DELETE_VIDEO_SAVE_FAIL));
        }
    }
}
