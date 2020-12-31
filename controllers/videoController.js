const sequelize = require('sequelize');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');
const { Section, Tag, User, Video_Section, Video_Tag, Video, Like, Save, Workspace } = require('../models');
const Op = sequelize.Op;

module.exports = {

    readAllPost: async (req, res) => {
        const filters = req.query.filters;
        try {
            const video = await Video.findAll({
                group: 'id',
                attributes: ['id', 'videoUrl', 'title', 'description', 'thumbnailImageUrl', 'viewCount', 'videoLength', 'channelName',
                    [sequelize, fn("COUNT", "LikedVideos.VideoLike.VideoId"), 'likeCnt']],
                include: [{
                    model: User,
                    as: 'VideoLikers',
                    attributes: [],
                    through: { attributes: [] }
                }]
            });

            return res
                .status(sc.OK)
                .send(
                    ut(success(
                        sc.OK,
                        rm.GET_ALL_POST_SUCCESS,
                        video
                    )))
        } catch (err) {
            console.log(err);
            return res
                .status(sc.INTERNAL_SERVER_ERROR).
                send(ut.fail(
                    sc.INTERNAL_SERVER_ERROR,
                    rm.GET_ALL_POST_FAIL
                ));
        }
    },


    // 동영상 디테일 

    /*
    getDetail: async (req, res) => {
        const id = req.params.videoId;

        if (!id) {
            res.status(400).json({
                message: "video id가 비어있습니다."
            })
            return
        }
        try {
            const details = await Video.findOne({
                where: {
                    id,
                },
                attributes: ['title', 'description', 'videoUrl', 'viewCount', 'channelName', 'createdAt'],
                include: [{
                    model: Tag,
                    as: 'TaggedVideos',
                    attributes: ['name'],
                    through: { attributes: [] }
                }],
            });
            return res
                .status(sc.OK)
                .send(ut.success(sc.Ok, rm.GET_VIDEO_DETAIL_SUCCESS, details));
        } catch (err) {
            console.log(err);
            return res
                .status(sc.INTERNAL_SERVER_ERROR)
                .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.GET_VIDEO_DETAIL_FAIL));
        }
    },
    */

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
            return res.status(sc.OK).send(ut.success(sc.OK, rm.DELETE_VIDEO_LIKE_SUCCESS));
        } catch (err) {
            console.log(err);
            return res
                .status(sc.INTERNAL_SERVER_ERROR)
                .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.DELETE_VIDEO_LIKE_FAIL));
        }
    },

    // 동영상 저장


    // 동영상 저장 취소 


}

