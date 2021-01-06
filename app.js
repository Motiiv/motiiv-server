var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const { sequelize } = require("./models");

var indexRouter = require("./routes/index");
const kakao = require("./config/kakao");

sequelize.query("SET FOREIGN_KEY_CHECKS = 0").then(() =>
  sequelize
    // .sync({ alter: true, force: true })
    .sync({ alter: false, force: false })
    .then(() => {
      console.log("✅ Connected to the database!");
    })
    .catch((error) => {
      console.log(error);
    }),
);

var app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/motiiv/api/v1", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Trace warnings on node
// process.on("warning", (e) => console.warn(e.stack));

module.exports = app;
