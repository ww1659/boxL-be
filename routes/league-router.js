const leagueRouter = require("express").Router();
const { getLeagues } = require("../controllers/leagues-controller");

leagueRouter.route("/").get(getLeagues);

module.exports = leagueRouter;
