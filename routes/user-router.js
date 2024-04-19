const userRouter = require("express").Router();
const userController = require("../controllers/users.controller");

userRouter.get("/", userController.getAllUsers);

userRouter.get("/:username", userController.getUserByUserID);

module.exports = userRouter;
