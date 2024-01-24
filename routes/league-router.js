const leagueRouter = require("express").Router();
const {
  getLeagues,
  getLeaguesByUserId,
} = require("../controllers/leagues-controller");

leagueRouter.route("/").get(getLeagues);
leagueRouter.route("/:userId").get(getLeaguesByUserId);

module.exports = leagueRouter;
