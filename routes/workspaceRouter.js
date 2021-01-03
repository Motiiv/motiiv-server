const express = require("express");
const workspaceController = require("../controllers/workspaceController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("../middlewares/multer");
const workspaceRouter = express.Router();

// Create Workspace
workspaceRouter.post(
  "/",
  authMiddleware.checkToken("user"),
  workspaceController.createWorkspace,
);

// Get all Workspaces
workspaceRouter.get(
  "/",
  authMiddleware.checkToken("user"),
  workspaceController.getAllWorkspaces,
);

// Get one Workspace
workspaceRouter.get(
  "/:workspaceId",
  authMiddleware.checkToken("user"),
  workspaceController.getWorkspace,
);

// Update Workspace
workspaceRouter.put(
  "/:workspaceId",
  authMiddleware.checkToken("user"),
  workspaceController.updateWorkspace,
);

// Delete Workspace
workspaceRouter.delete(
  "/:workspaceId",
  authMiddleware.checkToken("user"),
  workspaceController.deleteWorkspace,
);

module.exports = workspaceRouter;
