const {
  fetchLeagues,
  fetchLeaguesByUserId,
  fetchLeagueByLeagueId,
  fetchStandingsByLeagueId,
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
  const userId = req.user.user_id;

  if (!userId) {
    res.status(401).send({ msg: "user does not exist" });
  }

  try {
    const allUserIds = await fetchUserIds();
    const user_exists = allUserIds.some(
      (user) => user.user_id === Number(userId)
    );
    if (!isNaN(Number(userId)) && !user_exists) {
      res.status(404).send({ msg: "user does not exist" });
    }
    const leaguesByUserId = await fetchLeaguesByUserId(userId);
    if (leaguesByUserId.length === 0) {
      return res.status(200).send({ msg: "user is not in any leagues" });
    }
    res.status(200).send({ leaguesByUserId });
  } catch (err) {
    next(err);
  }
};

exports.getLeagueByLeagueId = async (req, res, next) => {
  const { leagueId } = req.params;
  const userId = req.user.user_id;

  if (!userId) {
    res.status(401).send({ msg: "user does not exist" });
  }

  try {
    const leagueByLeagueId = await fetchLeagueByLeagueId(leagueId);
    res.status(200).send({ league: leagueByLeagueId });
  } catch (err) {
    next(err);
  }
};

exports.getStandingsByLeagueId = async (req, res, next) => {
  const { leagueId } = req.params;
  const userId = req.user.user_id;

  if (!userId) {
    res.status(401).send({ msg: "user does not exist" });
  }
  try {
    const standings = await fetchStandingsByLeagueId(leagueId);
    console.log(standings);
    res.status(200).send({ standings });
  } catch (err) {
    next(err);
  }
};
