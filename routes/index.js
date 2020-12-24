var express = require("express");
var router = express.Router();

router.use("/users", require("./userRouter"));
// router.use("/videos", require("./videoRouter"));

module.exports = router;
