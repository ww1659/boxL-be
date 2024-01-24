const resultsRouter = require("express").Router();
const {
  getResultsByLeagueId,
  getResultsByUserId,
} = require("../controllers/results-controller");

resultsRouter.route("/leagues/:leagueId").get(getResultsByLeagueId);
resultsRouter.route("/users/:userId").get(getResultsByUserId);

module.exports = resultsRouter;
