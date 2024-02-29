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
leagueRouter.route("/:leagueId").get(getLeagueByLeagueId);
leagueRouter.route("/:leagueId/standings").get(getStandingsByLeagueId);

module.exports = leagueRouter;
