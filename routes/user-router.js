const userRouter = require("express").Router();
const { createNewUser, checkUser } = require("../controllers/users-controller");

userRouter.route("/").post(createNewUser);
userRouter.route("/login").post(checkUser);

module.exports = userRouter;
