const userRouter = require("express").Router();
const { createNewUser } = require("../controllers/users-controller");

userRouter.route("/").post(createNewUser);

module.exports = userRouter;
