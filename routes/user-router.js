const userRouter = require("express").Router();
const {
  createNewUser,
  checkUser,
  getUsersByLeagueId,
} = require("../controllers/users-controller");

userRouter.route("/").post(createNewUser);
userRouter.route("/login").post(checkUser);
userRouter.route("/leagues/:leagueId").get(getUsersByLeagueId);

module.exports = userRouter;
