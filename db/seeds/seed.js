const format = require("pg-format");
const db = require("../connection");

const seed = ({
  userData,
  leagueData,
  clubData,
  resultsData,
  usersLeaguesData,
  standingsData,
}) => {
  return db
    .query("DROP TABLE IF EXISTS results;")
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS standings;`);
    })
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
      return db.query(`DROP TABLE IF EXISTS clubs;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE clubs (
            club_id SERIAL PRIMARY KEY, 
            name VARCHAR NOT NULL, 
            address VARCHAR NOT NULL,
            postcode VARCHAR(10) NOT NULL,
            number_of_courts INT NOT NULL,
            court_surface VARCHAR(255)[], 
            website VARCHAR(255),
            image_url VARCHAR(255)
        );`);
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
            club_id INT REFERENCES clubs(club_id),
            CONSTRAINT unique_username UNIQUE (username),
            CONSTRAINT unique_email UNIQUE (email)
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
            club_id INT REFERENCES clubs(club_id) NOT NULL,
            format VARCHAR NOT NULL,
            type VARCHAR NOT NULL
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
        CREATE TABLE standings (
            standing_id SERIAL PRIMARY KEY,
            league_id INT REFERENCES leagues(league_id) NOT NULL,
            group_name VARCHAR(255) NOT NULL,
            player_id INT REFERENCES users(user_id) NOT NULL,
            matches_played INT NOT NULL,
            wins INT NOT NULL,
            sets_won INT NOT NULL,
            sets_lost INT NOT NULL,
            games_won INT NOT NULL,
            games_lost INT NOT NULL,
            CONSTRAINT unique_player_group UNIQUE (league_id, group_name, player_id)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE results (
            result_id SERIAL PRIMARY KEY,
            league_id INTEGER NOT NULL REFERENCES leagues(league_id),
            winner_id INTEGER NOT NULL REFERENCES users(user_id),
            loser_id INTEGER NOT NULL REFERENCES users(user_id),
            group_name VARCHAR(20) NOT NULL,
            first_set_score VARCHAR(255) NOT NULL,
            first_set_tiebreak VARCHAR(255),
            second_set_score VARCHAR(255) NOT NULL,
            second_set_tiebreak VARCHAR(255),
            third_set_score VARCHAR(255),
            third_set_tiebreak VARCHAR(255),
            championship_tiebreak BOOLEAN NOT NULL DEFAULT false,
            championship_tiebreak_score VARCHAR(255),
            match_date DATE NOT NULL,
            club_id INT REFERENCES clubs(club_id) NOT NULL,
            court_number INTEGER NOT NULL,
            court_surface VARCHAR(50) NOT NULL,
            match_notes TEXT
        );`);
    })
    .then(() => {
      const insertCLubsQuery = format(
        `INSERT INTO clubs (name, address, postcode, number_of_courts, court_surface, website, image_url) VALUES %L;`,
        clubData.map(
          ({
            name,
            address,
            postcode,
            number_of_courts,
            court_surface,
            website,
            image_url,
          }) => [
            name,
            address,
            postcode,
            number_of_courts,
            `{${court_surface.join(",")}}`,
            website,
            image_url,
          ]
        )
      );
      return db.query(insertCLubsQuery);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        `INSERT INTO users (username, name, email, password_hash, avatar_url, club_id) VALUES %L RETURNING *;`,
        userData.map(
          ({ username, name, email, password_hash, avatar_url, club_id }) => [
            username,
            name,
            email,
            password_hash,
            avatar_url,
            club_id,
          ]
        )
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertLeaguesQueryStr = format(
        `INSERT INTO leagues (name, admin, start_date, end_date, club_id, format, type) VALUES %L;`,
        leagueData.map(
          ({ name, admin, start_date, end_date, club_id, format, type }) => [
            name,
            admin,
            start_date,
            end_date,
            club_id,
            format,
            type,
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
      const insertStandingsQuery = format(
        `INSERT INTO standings (league_id, group_name, player_id, matches_played, wins, sets_won, sets_lost, games_won, games_lost) VALUES %L;`,
        standingsData.map(
          ({
            league_id,
            group_name,
            player_id,
            matches_played,
            wins,
            sets_won,
            sets_lost,
            games_won,
            games_lost,
          }) => [
            league_id,
            group_name,
            player_id,
            matches_played,
            wins,
            sets_won,
            sets_lost,
            games_won,
            games_lost,
          ]
        )
      );
      return db.query(insertStandingsQuery);
    })
    .then(() => {
      const insertResultsQueryStr = format(
        `INSERT INTO results (league_id, winner_id, loser_id, group_name, first_set_score, first_set_tiebreak, second_set_score, second_set_tiebreak, third_set_score, third_set_tiebreak, championship_tiebreak, championship_tiebreak_score, match_date, club_id, court_number, court_surface, match_notes) VALUES %L;`,
        resultsData.map(
          ({
            league_id,
            winner_id,
            loser_id,
            group_name,
            first_set_score,
            first_set_tiebreak,
            second_set_score,
            second_set_tiebreak,
            third_set_score,
            third_set_tiebreak,
            championship_tiebreak,
            championship_tiebreak_score,
            match_date,
            club_id,
            court_number,
            court_surface,
            match_notes,
          }) => [
            league_id,
            winner_id,
            loser_id,
            group_name,
            first_set_score,
            first_set_tiebreak,
            second_set_score,
            second_set_tiebreak,
            third_set_score,
            third_set_tiebreak,
            championship_tiebreak,
            championship_tiebreak_score,
            match_date,
            club_id,
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
