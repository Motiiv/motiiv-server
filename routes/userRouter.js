const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

// Kakao Login
userRouter.get("/auth/kakao", passport.authenticate("kakao"));
userRouter.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.send(req.user);
    // res.redirect("/");
  },
);

// Sign up
// userRouter.post("/signup", isNotLoggedIn, userController.signup);

// Login
// userRouter.post("/login", isNotLoggedIn, userController.login);

// Logout
userRouter.post("/logout", isLoggedIn, userController.logout);

// Get Mypage
userRouter.get("/mypage", isLoggedIn, userController.mypage);

// Read all users
userRouter.get("/", userController.getAllUsers);

// Read a user by ID
userRouter.get("/:userId", userController.getOneUser);

// Update a user
userRouter.put("/:userId", userController.updateUser);

// Delete a user
userRouter.delete("/:userId", userController.deleteUser);

module.exports = userRouter;
