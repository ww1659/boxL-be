const leagueRouter = require("express").Router();
const {
  getLeagues,
  getLeaguesByUserId,
  getLeagueByLeagueId,
} = require("../controllers/leagues-controller");

leagueRouter.route("/").get(getLeagues);
leagueRouter.route("/users/:userId").get(getLeaguesByUserId);
leagueRouter.route("/:leagueId").get(getLeagueByLeagueId);

module.exports = leagueRouter;
