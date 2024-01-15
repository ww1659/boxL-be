const { fetchLeagues } = require("../models/leagues-model");

exports.getLeagues = async (req, res, next) => {
  try {
    const leagues = await fetchLeagues();
    res.status(200).send({ leagues });
  } catch (err) {
    next(err);
  }
};
