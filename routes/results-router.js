const resultsRouter = require("express").Router();
const {
  getResultsByLeagueId,
  getResultsByUserId,
  postNewResult,
} = require("../controllers/results-controller");

resultsRouter.route("/").post(postNewResult);
resultsRouter.route("/leagues/:leagueId").get(getResultsByLeagueId);
resultsRouter.route("/users/:userId").get(getResultsByUserId);

module.exports = resultsRouter;
