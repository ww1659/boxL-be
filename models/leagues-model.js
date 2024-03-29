const db = require("../db/connection");

exports.fetchLeagues = async () => {
  const leaguesQuery = `SELECT * FROM leagues;`;
  try {
    const result = await db.query(leaguesQuery);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

exports.fetchLeaguesByUserId = async (userId) => {
  const leaguesByUserIdQuery = `
    SELECT *
    FROM leagues AS l
    INNER JOIN users_leagues AS ul ON l.league_id = ul.league_id
    WHERE ul.user_id = $1;
    ;`;
  try {
    const result = await db.query(leaguesByUserIdQuery, [userId]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

exports.fetchLeagueByLeagueId = async (leagueId) => {
  const leagueByLeagueId = `
    SELECT *
    FROM leagues
    WHERE league_id = $1;
    ;`;
  try {
    const result = await db.query(leagueByLeagueId, [leagueId]);
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "league does not exist",
      });
    } else {
      return result.rows;
    }
  } catch (err) {
    throw err;
  }
};

exports.fetchStandingsByLeagueId = async (leagueId) => {
  const standings = `
      SELECT s.*, u.name AS player_name
      FROM standings s
      JOIN users u ON s.player_id = u.user_id
      WHERE league_id = $1;
      ;`;

  try {
    const result = await db.query(standings, [leagueId]);
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "league does not exist",
      });
    } else {
      return result.rows;
    }
  } catch (err) {
    throw err;
  }
};
