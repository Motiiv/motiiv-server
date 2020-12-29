const express = require("express");
const videoRouter = express.Router();
const videoController = require('../controllers/videoController');

videoRouter.get("/", videoController.readAllPost);

module.exports = videoRouter;
