const apiRouter = require("express").Router();
const leagueRouter = require("./league-router");
const userRouter = require("./user-router");
const resultsRouter = require("./results-router");
const { getEndpoints } = require("../controllers/endpoints-controller");

apiRouter.get("/", getEndpoints);
apiRouter.use("/users", userRouter);
apiRouter.use("/leagues", leagueRouter);
apiRouter.use("/results", resultsRouter);

module.exports = { apiRouter };
