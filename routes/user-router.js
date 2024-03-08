const userRouter = require("express").Router();
const { deserialiseUser } = require("../JWTmiddleware/deserialiseUser");
const {
  createNewUser,
  getUsersByLeagueId,
  getUserById,
  createUserSession,
} = require("../controllers/users-controller");

userRouter.route("/").post(createNewUser);
userRouter.route("/:userId").get(getUserById);
userRouter.route("/login").post(createUserSession);
userRouter.route("/leagues/:leagueId").get(deserialiseUser, getUsersByLeagueId);

module.exports = userRouter;
