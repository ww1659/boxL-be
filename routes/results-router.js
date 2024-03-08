const resultsRouter = require("express").Router();
const { deserialiseUser } = require("../JWTmiddleware/deserialiseUser");
const {
  getResultsByLeagueId,
  getResultsByUserId,
  postNewResult,
} = require("../controllers/results-controller");

resultsRouter.route("/").post(deserialiseUser, postNewResult);
resultsRouter
  .route("/leagues/:leagueId")
  .get(deserialiseUser, getResultsByLeagueId);
resultsRouter.route("/users/:userId").get(deserialiseUser, getResultsByUserId);

module.exports = resultsRouter;
