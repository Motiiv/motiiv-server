const express = require("express");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();

// Create an Admin
adminRouter.post("/", adminController.createAdmin);

// Read all Admins
adminRouter.get("/");

// Read one Admin
adminRouter.get("/:adminId");

// Update Admin
adminRouter.put("/:adminId");

// Delete Admin
adminRouter.delete("/:adminId");

module.exports = adminRouter;
