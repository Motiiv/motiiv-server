const express = require("express");
const videoController = require("../controllers/videoController");
const videoRouter = express.Router();

// Sign up
videoRouter.post("/", videoController.createVideo);

// Read all videos
videoRouter.get("/", videoController.getAllVideos);

// Read a video by ID
videoRouter.get("/:videoId", videoController.getOneVideo);

// Update a video
videoRouter.put("/:videoId", videoController.updateVideo);

// Delete a video
videoRouter.delete("/:videoId", videoController.deleteVideo);

module.exports = videoRouter;
