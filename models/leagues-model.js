const db = require("../db/connection");

exports.fetchLeagues = async () => {
  const leaguesQuery = `SELECT * FROM leagues;`;
  try {
    const result = await db.query(leaguesQuery);
    return result.rows;
  } catch (error) {
    throw error;
  }
};
