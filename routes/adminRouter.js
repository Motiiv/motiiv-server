const express = require("express");
const adminRouter = express.Router();

// Create an Admin
adminRouter.post("/");

// Read all Admins
adminRouter.get("/");

// Read one Admin
adminRouter.get("/:adminId");

// Update Admin
adminRouter.put("/:adminId");

// Delete Admin
adminRouter.delete("/:adminId");

module.exports = adminRouter;
