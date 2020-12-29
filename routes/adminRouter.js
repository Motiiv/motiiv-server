const express = require("express");
const adminRouter = express.Router();

adminRouter.get("/");

module.exports = adminRouter;
