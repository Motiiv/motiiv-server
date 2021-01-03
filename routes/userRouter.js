const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("../middlewares/multer");
const userRouter = express.Router();

// Kakao Login
userRouter.get("/auth/kakao", userController.kakaoLogin);
userRouter.get("/auth/kakao/callback", userController.kakaoLoginCallback);

// Naver Login
userRouter.get("/auth/naver", userController.naverLogin);
userRouter.get("/auth/naver/callback", userController.naverLoginCallback);

// logout
// userRouter.post("/logout", isLoggedIn, userController.logout);

// Select Job and Keywords
userRouter.post(
  "/addInfo",
  authMiddleware.checkToken("user"),
  userController.selectJobAndKeywords,
);

// Read all users
userRouter.get("/", userController.getAllUsers);

// Read a user by ID
userRouter.get("/:userId", userController.getOneUser);

// Update a user
userRouter.put(
  "/:userId",
  authMiddleware.checkToken("user"),
  multer.uploadProfileImage,
  userController.updateUser,
);

// Delete a user
// TODO: Who has authority to delete a user?
userRouter.delete(
  "/:userId",
  // authMiddleware.checkToken("user"),
  userController.deleteUser,
);

module.exports = userRouter;
