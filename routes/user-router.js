const userRouter = require("express").Router();
const userController = require("../controllers/users.controller");

userRouter.get("/", userController.getAllUsers);

module.exports = userRouter;
