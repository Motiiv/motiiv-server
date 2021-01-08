const express = require("express");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminRouter = express.Router();

// Admin Signup
adminRouter.post("/signup", adminController.createAdmin);

// Admin Login
adminRouter.post("/login", adminController.adminLogin);

// Admin Logout
adminRouter.post("/logout", adminController.adminLogout);

// Read all Admins
adminRouter.get("/", adminController.getAllAdmins);

// Update Admin username
adminRouter.put(
  "/username",
  authMiddleware.checkToken("admin"),
  adminController.updateAdminUsername,
);

//Update Admin password
adminRouter.put(
  "/password",
  authMiddleware.checkToken("admin"),
  adminController.updateAdminPassword,
);

// Read one Admin
adminRouter.get("/:adminId", adminController.getOneAdmin);

// Delete Admin
adminRouter.delete(
  "/",
  authMiddleware.checkToken("admin"),
  adminController.deleteAdmin,
);

module.exports = adminRouter;
