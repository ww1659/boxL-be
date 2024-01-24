const format = require("pg-format");
const db = require("../connection");

const seed = ({ userData, leagueData, resultsData, usersLeaguesData }) => {
  return db
    .query("DROP TABLE IF EXISTS results;")
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users_leagues;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS leagues;`);
    })
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
            start_date DATE,
            end_date DATE,
            location VARCHAR NOT NULL,            
            format VARCHAR NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users_leagues (
            users_leagues_id SERIAL PRIMARY KEY, 
            user_id INT REFERENCES users(user_id) NOT NULL,
            league_id INT REFERENCES leagues(league_id) NOT NULL,
            CONSTRAINT unique_user_league UNIQUE (user_id, league_id)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE results (
            result_id SERIAL PRIMARY KEY,
            league_id INTEGER NOT NULL REFERENCES leagues(league_id),
            winner_id INTEGER NOT NULL REFERENCES users(user_id),
            loser_id INTEGER NOT NULL REFERENCES users(user_id),
            first_set_score VARCHAR(255) NOT NULL,
            first_set_tiebreak VARCHAR(255),
            second_set_score VARCHAR(255) NOT NULL,
            second_set_tiebreak VARCHAR(255),
            third_set_score VARCHAR(255),
            third_set_tiebreak VARCHAR(255),
            championship_tiebreak BOOLEAN NOT NULL DEFAULT false,
            championship_tiebreak_score VARCHAR(255),
            match_date DATE NOT NULL,
            location VARCHAR(255) NOT NULL,
            court_number INTEGER NOT NULL,
            court_surface VARCHAR(50) NOT NULL,
            match_notes TEXT
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
        `INSERT INTO leagues (name, admin, start_date, end_date, location, format) VALUES %L;`,
        leagueData.map(
          ({ name, admin, start_date, end_date, location, format }) => [
            name,
            admin,
            start_date,
            end_date,
            location,
            format,
          ]
        )
      );
      return db.query(insertLeaguesQueryStr);
    })
    .then(() => {
      const insertUsersLeaguesQuery = format(
        `INSERT INTO users_leagues (user_id, league_id) VALUES %L;`,
        usersLeaguesData.map(({ user_id, league_id }) => [user_id, league_id])
      );
      return db.query(insertUsersLeaguesQuery);
    })
    .then(() => {
      const insertResultsQueryStr = format(
        `INSERT INTO results (league_id, winner_id, loser_id, first_set_score, first_set_tiebreak, second_set_score, second_set_tiebreak, third_set_score, third_set_tiebreak, championship_tiebreak, championship_tiebreak_score, match_date, location, court_number, court_surface, match_notes) VALUES %L;`,
        resultsData.map(
          ({
            league_id,
            winner_id,
            loser_id,
            first_set_score,
            first_set_tiebreak,
            second_set_score,
            second_set_tiebreak,
            third_set_score,
            third_set_tiebreak,
            championship_tiebreak,
            championship_tiebreak_score,
            match_date,
            location,
            court_number,
            court_surface,
            match_notes,
          }) => [
            league_id,
            winner_id,
            loser_id,
            first_set_score,
            first_set_tiebreak,
            second_set_score,
            second_set_tiebreak,
            third_set_score,
            third_set_tiebreak,
            championship_tiebreak,
            championship_tiebreak_score,
            match_date,
            location,
            court_number,
            court_surface,
            match_notes,
          ]
        )
      );
      return db.query(insertResultsQueryStr);
    });
};

module.exports = seed;
