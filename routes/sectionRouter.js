const express = require("express");
const sectionController = require("../controllers/sectionController");
const sectionRouter = express.Router();

// Create an Section
sectionRouter.post("/", sectionController.createSection);

// Read all Sections
sectionRouter.get("/", sectionController.getAllSections);

// Read one Section
sectionRouter.get("/:sectionId", sectionController.getOneSection);

// Update Section
// sectionRouter.put("/:sectionId/username", sectionController.updateSectionUsername);

// Delete Section
sectionRouter.delete("/:sectionId", sectionController.deleteSection);

module.exports = sectionRouter;
