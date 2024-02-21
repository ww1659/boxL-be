const userRouter = require("express").Router();
const {
  createNewUser,
  checkUser,
  getUsersByLeagueId,
  getUserById,
} = require("../controllers/users-controller");

userRouter.route("/").post(createNewUser);
userRouter.route("/:userId").get(getUserById);
userRouter.route("/login").post(checkUser);
userRouter.route("/leagues/:leagueId").get(getUsersByLeagueId);

module.exports = userRouter;
