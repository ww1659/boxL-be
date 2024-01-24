const {
  fetchResultsByLeagueId,
  fetchResultsByUserId,
} = require("../models/results-model");

exports.getResultsByLeagueId = async (req, res, next) => {
  const { leagueId } = req.params;
  try {
    const resultsByLeagueId = await fetchResultsByLeagueId(leagueId);
    res.status(200).send({ resultsByLeagueId });
  } catch (err) {
    next(err);
  }
};

exports.getResultsByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const resultsByUserId = await fetchResultsByUserId(userId);
    res.status(200).send({ resultsByUserId });
  } catch (err) {
    next(err);
  }
};
