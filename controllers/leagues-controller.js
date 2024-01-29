const leagues = require("../db/data/test-data/leagues");
const {
  fetchLeagues,
  fetchLeaguesByUserId,
} = require("../models/leagues-model");
const { fetchUserIds } = require("../models/users-model");

exports.getLeagues = async (req, res, next) => {
  try {
    const leagues = await fetchLeagues();
    res.status(200).send({ leagues });
  } catch (err) {
    next(err);
  }
};

exports.getLeaguesByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const allUserIds = await fetchUserIds();
    const user_exists = allUserIds.some(
      (user) => user.user_id === Number(userId)
    );
    if (!isNaN(Number(userId)) && !user_exists) {
      res.status(404).send({ msg: "user does not exist" });
    } else {
      const leaguesByUserId = await fetchLeaguesByUserId(userId);
      res.status(200).send({ leaguesByUserId });
    }
  } catch (err) {
    next(err);
  }
};
