const db = require("../db/connection");

exports.fetchUserIds = async () => {
  const getUserIdsQuery = `
        SELECT user_id  
        FROM users
        ;`;
  try {
    const result = await db.query(getUserIdsQuery);
    return result.rows;
  } catch (err) {
    throw err;
  }
};
