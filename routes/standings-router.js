const standingsRouter = require("express").Router();
const { deserialiseUser } = require("../JWTmiddleware/deserialiseUser");
const { patchStandings } = require("../controllers/standings-controller");

standingsRouter.route("/").patch(deserialiseUser, patchStandings);

module.exports = standingsRouter;
