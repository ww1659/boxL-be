const leagueRouter = require("express").Router();
const {
  getLeagues,
  getLeaguesByUserId,
  getLeagueByLeagueId,
  getStandingsByLeagueId,
} = require("../controllers/leagues-controller");
const { deserialiseUser } = require("../JWTmiddleware/deserialiseUser");

leagueRouter.route("/").get(getLeagues);
leagueRouter.route("/users/:userId").get(deserialiseUser, getLeaguesByUserId);
leagueRouter.route("/:leagueId").get(deserialiseUser, getLeagueByLeagueId);
leagueRouter
  .route("/:leagueId/standings")
  .get(deserialiseUser, getStandingsByLeagueId);

module.exports = leagueRouter;
