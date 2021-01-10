const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("../middlewares/multer");
const userRouter = express.Router();

// Kakao Login
// userRouter.get("/auth/kakao", userController.kakaoLogin);
// userRouter.get("/auth/kakao/callback", userController.kakaoLoginCallback);

// Naver Login
userRouter.get("/auth/naver", userController.naverLogin);
userRouter.get("/auth/naver/callback", userController.naverLoginCallback);

// Check
userRouter.post("/login", userController.login);

// Login
userRouter.post("/signup", userController.signup);

// Logout
userRouter.post("/logout", userController.logout);

userRouter.post("/naver", userController.getNaverProfile);

// Select Job and Keywords
// userRouter.post(
//   "/addInfo",
//   authMiddleware.checkToken("user"),
//   userController.selectJobAndKeywords,
// );

userRouter.get(
  "/profile",
  authMiddleware.checkToken("user"),
  userController.getUserProfile,
);

// Read all users
userRouter.get("/", userController.getAllUsers);

// Read a user by ID
userRouter.get("/:userId", userController.getOneUser);

// Update a user
userRouter.put(
  "/",
  authMiddleware.checkToken("user"),
  multer.uploadProfileImage,
  userController.updateUser,
);

userRouter.delete(
  "/",
  authMiddleware.checkToken("user"),
  userController.deleteUser,
);

// Delete a user
// TODO: Who has authority to delete a user?
userRouter.delete(
  "/:userId",
  // authMiddleware.checkToken("user"),
  userController.deleteSpecificUser,
);

module.exports = userRouter;
