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

exports.enterUser = async (newUser) => {
  const { username, name, email, password_hash, avatar_url, club } = newUser;

  if (!username || !name || !email || !password_hash || !club) {
    return Promise.reject({ status: 400, msg: "missing user data" });
  }

  const postUserQuery = `
  INSERT INTO users
  (username, name, email, password_hash, avatar_url, club)
  VALUES
  ($1, $2, $3, $4, $5, $6)
  RETURNING *
  ;`;

  try {
    const result = await db.query(postUserQuery, [
      username,
      name,
      email,
      password_hash,
      avatar_url,
      club,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
