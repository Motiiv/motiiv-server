const express = require("express");
const sectionController = require("../controllers/sectionController");
const authMiddleware = require("../middlewares/authMiddleware");
const sectionRouter = express.Router();

// Create an Section
sectionRouter.post(
  "/",
  authMiddleware.checkToken("admin"),
  sectionController.createSection,
);

// Read all Sections
sectionRouter.get(
  "/",
  authMiddleware.checkToken("admin"),
  sectionController.getAllSections,
);

// Read one Section
sectionRouter.get(
  "/:sectionId",
  authMiddleware.checkToken("admin"),
  sectionController.getOneSection,
);

// Update Section
sectionRouter.put(
  "/:sectionId",
  authMiddleware.checkToken("admin"),
  sectionController.updateSection,
);

// Delete Section
sectionRouter.delete(
  "/:sectionId",
  authMiddleware.checkToken("admin"),
  sectionController.deleteSection,
);

// TODO: checkAdmin
// Add Video to a Section
sectionRouter.post("/:sectionId/video", sectionController.addVideoToSection);

// Remove Video from a Section
sectionRouter.delete(
  "/:sectionId/video",
  sectionController.removeVideoFromSection,
);

module.exports = sectionRouter;
