const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminRouter = express.Router();

// Create an Admin
adminRouter.post("/", adminController.createAdmin);

// Read all Admins
adminRouter.get("/", adminController.getAllAdmins);

// Read one Admin
adminRouter.get("/:adminId", adminController.getOneAdmin);

// Update Admin username
adminRouter.put(
  "/:adminId/username",
  authMiddleware.checkToken("admin"),
  adminController.updateAdminUsername,
);

//Update Admin password
adminRouter.put(
  "/:adminId/password",
  authMiddleware.checkToken("admin"),
  adminController.updateAdminPassword,
);

// Delete Admin
adminRouter.delete(
  "/:adminId",
  authMiddleware.checkToken("admin"),
  adminController.deleteAdmin,
);

module.exports = adminRouter;
