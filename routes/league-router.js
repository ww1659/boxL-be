const leagueRouter = require("express").Router();
const {
  getLeagues,
  getLeaguesByUserId,
  getLeagueByLeagueId,
  getStandingsByLeagueId,
} = require("../controllers/leagues-controller");

leagueRouter.route("/").get(getLeagues);
leagueRouter.route("/users/:userId").get(getLeaguesByUserId);
leagueRouter.route("/:leagueId").get(getLeagueByLeagueId);
leagueRouter.route("/:leagueId/standings").get(getStandingsByLeagueId);

module.exports = leagueRouter;
