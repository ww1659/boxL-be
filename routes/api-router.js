const apiRouter = require("express").Router();
const leagueRouter = require("./league-router");
const userRouter = require("./user-router");
const resultsRouter = require("./results-router");

// apiRouter.get("/", getEndpoints); need to complete this by the end
// apiRouter.use("/users", userRouter);
apiRouter.use("/leagues", leagueRouter);
apiRouter.use("/results", resultsRouter);

module.exports = { apiRouter };
