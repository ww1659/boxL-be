const { fetchLeagues } = require("../models/leagues-model");
const {
  fetchResultsByLeagueId,
  fetchResultsByUserId,
} = require("../models/results-model");
const { fetchUserIds } = require("../models/users-model");

exports.getResultsByLeagueId = async (req, res, next) => {
  const { leagueId } = req.params;
  try {
    const allLeagues = await fetchLeagues();
    const league_exists = allLeagues.some(
      (league) => league.league_id === Number(leagueId)
    );
    if (!isNaN(Number(leagueId)) && !league_exists) {
      res.status(404).send({ msg: "league does not exist" });
    } else {
      const resultsByLeagueId = await fetchResultsByLeagueId(leagueId);
      res.status(200).send({ resultsByLeagueId });
    }
  } catch (err) {
    next(err);
  }
};

exports.getResultsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const allUserIds = await fetchUserIds();
    const user_exists = allUserIds.some(
      (user) => user.user_id === Number(userId)
    );
    if (!isNaN(Number(userId)) && !user_exists) {
      res.status(404).send({ msg: "user does not exist" });
    } else {
      const resultsByUserId = await fetchResultsByUserId(userId);
      res.status(200).send({ resultsByUserId });
    }
  } catch (err) {
    next(err);
  }
};
