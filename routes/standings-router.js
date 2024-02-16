const standingsRouter = require("express").Router();

const { patchStandings } = require("../controllers/standings-controller");

standingsRouter.route("/").patch(patchStandings);

module.exports = standingsRouter;
