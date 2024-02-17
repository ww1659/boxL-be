const db = require("../db/connection");

exports.fetchResultsByLeagueId = async (leagueId) => {
  const getResultsByLeagueQuery = `
    SELECT r.*, u1.name AS winner_name, u2.name AS loser_name
    FROM results r
    JOIN users u1 ON r.winner_id = u1.user_id
    JOIN users u2 ON r.loser_id = u2.user_id
    WHERE league_id = $1
    ORDER BY r.match_date DESC; 
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

exports.enterResult = async (newResult) => {
  const {
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
  } = newResult;

  //validates first and second set scores
  if (validateScore(first_set_score) === false) {
    return Promise.reject({ status: 400, msg: "first set score invalid" });
  }

  if (validateScore(second_set_score) === false) {
    return Promise.reject({ status: 400, msg: "second set score invalid" });
  }

  // variables
  let thirdSetRequired = true;
  let winnerSetsWon = 0;
  let loserSetsWon = 0;

  //calculate games won
  const winnerGames1 = first_set_score.split("-")[0];
  const loserGames1 = first_set_score.split("-")[1];
  const winnerGames2 = second_set_score.split("-")[0];
  const loserGames2 = second_set_score.split("-")[1];

  //decide if third set is required
  if (winnerGames1 > loserGames2 && winnerGames2 > loserGames2) {
    thirdSetRequired = false;
  }

  //checks if third set or championship tiebreaks are valid scores
  if (thirdSetRequired) {
    if (championship_tiebreak) {
      if (
        championship_tiebreak_score !== "" &&
        validateChampsTiebreak(championship_tiebreak_score) === false
      ) {
        return Promise.reject({
          status: 400,
          msg: "champs tiebreak score invalid",
        });
      }
    } else if (
      third_set_score !== "" &&
      validateScore(third_set_score) === false
    ) {
      return Promise.reject({
        status: 400,
        msg: "third set score invalid",
      });
    }
  }

  //calculate third set games won
  const winnerGames3 = third_set_score ? third_set_score.split("-")[0] : 0;
  const loserGames3 = third_set_score ? third_set_score.split("-")[1] : 0;

  if (
    !league_id ||
    !winner_id ||
    !loser_id ||
    !group_name ||
    !first_set_score ||
    !second_set_score ||
    (thirdSetRequired && !third_set_score && !championship_tiebreak_score) ||
    !match_date ||
    !club_id ||
    !court_number ||
    !court_surface
  ) {
    return Promise.reject({ status: 400, msg: "missing results data" });
  }

  const postResultQuery = `
  INSERT INTO results
  (league_id, winner_id, loser_id, group_name, first_set_score, first_set_tiebreak, second_set_score, second_set_tiebreak, third_set_score, third_set_tiebreak, championship_tiebreak, championship_tiebreak_score, match_date, club_id, court_number, court_surface, match_notes)
  VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
  RETURNING *
  ;`;

  try {
    const result = await db.query(postResultQuery, [
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
    ]);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
