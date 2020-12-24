const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

// Kakao Login
userRouter.post("/", userController.kakaoLogin);

// Read all users
userRouter.get("/", userController.getAllUsers);

// Read a user by ID
userRouter.get("/:userId", userController.getOneUser);

// Update a user
userRouter.put("/:userId", userController.updateUser);

// Delete a user
userRouter.delete("/:userId", userController.deleteUser);

module.exports = userRouter;
