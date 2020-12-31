const express = require("express");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();

// Create an Admin
adminRouter.post("/", adminController.createAdmin);

// Read all Admins
adminRouter.get("/", adminController.getAllAdmins);

// Read one Admin
adminRouter.get("/:adminId", adminController.getOneAdmin);

// Update Admin username
adminRouter.put("/:adminId/username", adminController.updateAdminUsername);

//Update Admin password
adminRouter.put("/:adminId/password", adminController.updateAdminPassword);

// Delete Admin
adminRouter.delete("/:adminId", adminController.deleteAdmin);

module.exports = adminRouter;
