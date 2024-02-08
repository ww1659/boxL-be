const clubRouter = require("express").Router();
const { getClubById } = require("../controllers/clubs-controller");

clubRouter.route("/:clubId").get(getClubById);

module.exports = clubRouter;
