const apiRouter = require("express").Router();
const leagueRouter = require("./league-router");
const userRouter = require("./user-router");
const resultsRouter = require("./results-router");
const clubRouter = require("./clubs-router");
const standingsRouter = require("./standings-router");
const { getEndpoints } = require("../controllers/endpoints-controller");

apiRouter.get("/", getEndpoints);
apiRouter.use("/users", userRouter);
apiRouter.use("/leagues", leagueRouter);
apiRouter.use("/clubs", clubRouter);
apiRouter.use("/results", resultsRouter);
apiRouter.use("/standings", standingsRouter);

module.exports = { apiRouter };
