const clubRouter = require("express").Router();
const { deserialiseUser } = require("../JWTmiddleware/deserialiseUser");
const { getClubById } = require("../controllers/clubs-controller");

clubRouter.route("/:clubId").get(deserialiseUser, getClubById);

module.exports = clubRouter;
