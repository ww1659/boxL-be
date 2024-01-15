const apiRouter = require("express").Router();
const leagueRouter = require("./league-router");
const userRouter = require("./user-router");

// apiRouter.get("/", getEndpoints); need to complete this by the end
// apiRouter.use("/users", userRouter);
apiRouter.use("/leagues", leagueRouter);

module.exports = { apiRouter };
