const db = require("../db/connection");

exports.fetchResultsByLeagueId = async (leagueId) => {
  const getResultsByLeagueQuery = `
  SELECT * 
  FROM results 
  WHERE league_id = $1
  ;`;
  try {
    const result = await db.query(getResultsByLeagueQuery, [leagueId]);
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no results for this league",
      });
    } else {
      return result.rows;
    }
  } catch (err) {
    throw err;
  }
};

exports.fetchResultsByUserId = async (userId) => {
  const getResultsByUserQuery = `
    SELECT * 
    FROM results 
    WHERE winner_id = $1 OR loser_id = $1
  ;`;
  try {
    const result = await db.query(getResultsByUserQuery, [userId]);
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no results for this user",
      });
    } else {
      return result.rows;
    }
  } catch (err) {
    throw err;
  }
};
