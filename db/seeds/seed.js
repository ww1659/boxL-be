const format = require("pg-format");
const db = require("../connection");

const seed = ({ userData, leagueData }) => {
  return db
    .query(`DROP TABLE IF EXISTS leagues;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR NOT NULL, 
            name VARCHAR NOT NULL, 
            email VARCHAR NOT NULL,
            password_hash VARCHAR NOT NULL, 
            avatar_url VARCHAR, 
            club VARCHAR
            );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE leagues (
            league_id SERIAL PRIMARY KEY, 
            name VARCHAR NOT NULL, 
            admin INT REFERENCES users(user_id) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            format VARCHAR NOT NULL
        );`);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        `INSERT INTO users (username, name, email, password_hash, avatar_url, club) VALUES %L RETURNING *;`,
        userData.map(
          ({ username, name, email, password_hash, avatar_url, club }) => [
            username,
            name,
            email,
            password_hash,
            avatar_url,
            club,
          ]
        )
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertLeaguesQueryStr = format(
        `INSERT INTO leagues (name, admin, created_at, format) VALUES %L;`,
        leagueData.map(({ name, admin, created_at, format }) => [
          name,
          admin,
          created_at,
          format,
        ])
      );
      return db.query(insertLeaguesQueryStr);
    });
};

module.exports = seed;
