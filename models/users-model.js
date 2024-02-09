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

exports.fetchUsersByLeagueId = async (leagueId) => {
  const getUsersQuery = `
        SELECT u.user_id, u.username, u.name, u.email, u.avatar_url, u.club_id 
        FROM users u
        JOIN users_leagues ul ON u.user_id = ul.user_id
        WHERE ul.league_id = $1
        ;`;
  try {
    const result = await db.query(getUsersQuery, [leagueId]);
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "league does not exist" });
    } else {
      return result.rows;
    }
  } catch (err) {
    throw err;
  }
};

exports.enterUser = async (newUser) => {
  const { username, name, email, password_hash, avatar_url, club_id } = newUser;

  if (!username || !name || !email || !password_hash || !club_id) {
    return Promise.reject({ status: 400, msg: "missing user data" });
  }

  const postUserQuery = `
  INSERT INTO users
  (username, name, email, password_hash, avatar_url, club_id)
  VALUES
  ($1, $2, $3, $4, $5, $6)
  RETURNING user_id, username, name, email, avatar_url, club_id
  ;`;

  try {
    const result = await db.query(postUserQuery, [
      username,
      name,
      email,
      password_hash,
      avatar_url,
      club_id,
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.getHashedPassword = async (username) => {
  const passwordQuery = `
  SELECT password_hash
  FROM users
  WHERE username = $1
  ;`;

  try {
    const result = await db.query(passwordQuery, [username]);
    if (result.rows.length === 0) {
      return Promise.reject({ status: 400, msg: "username does not exist" });
    }
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

exports.getUserByUsername = async (username) => {
  const userQuery = `
  SELECT user_id, username, name, email, avatar_url, club_id
  FROM users
  WHERE username = $1
  ;`;

  try {
    const result = await db.query(userQuery, [username]);
    if (result.rows.length === 0) {
      return Promise.reject({ status: 400, msg: "username does not exist" });
    }
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
