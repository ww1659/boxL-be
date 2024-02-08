const db = require("../db/connection");

exports.fetchClubById = async (clubId) => {
  const clubByClubIdQuery = `
      SELECT *
      FROM clubs
      WHERE club_id = $1;
      ;`;
  try {
    const result = await db.query(clubByClubIdQuery, [clubId]);
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 200,
        msg: "club does not exist",
      });
    } else {
      return result.rows;
    }
  } catch (err) {
    throw err;
  }
};
