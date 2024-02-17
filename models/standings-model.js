const db = require("../db/connection");
const {
  validateChampsTiebreak,
} = require("../utils/validateChampsTiebreakScore");
const { validateScore } = require("../utils/validateSetScore");

exports.updateStandings = async (newResult) => {
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
    (thirdSetRequired && !third_set_score && !championship_tiebreak_score)
  ) {
    return Promise.reject({ status: 400, msg: "missing standings data" });
  }

  //calculate games won
  const winnerGamesWon =
    Number(winnerGames1) + Number(winnerGames2) + Number(winnerGames3);

  const loserGamesWon =
    Number(loserGames1) + Number(loserGames2) + Number(loserGames3);

  if (winnerGames1 > loserGames1) {
    winnerSetsWon++;
  } else {
    loserSetsWon++;
  }

  if (winnerGames2 > loserGames2) {
    winnerSetsWon++;
  } else {
    loserSetsWon++;
  }

  if (third_set_score === "") {
    if (championship_tiebreak) {
      winnerSetsWon++;
    }
  } else {
    winnerSetsWon++;
  }

  const updateStandingsQuery = `
    UPDATE standings
    SET
    matches_played = matches_played + 1,
    wins = CASE WHEN player_id = $1 THEN wins + 1 ELSE wins END,
    sets_won = CASE 
                WHEN player_id = $1 THEN sets_won + $3 
                WHEN player_id = $2 THEN sets_won + $4 
                ELSE sets_won 
               END,
    sets_lost = CASE 
                WHEN player_id = $1 THEN sets_lost + $4 
                WHEN player_id = $2 THEN sets_lost + $3 
                ELSE sets_lost 
               END,
    games_won = CASE 
                WHEN player_id = $1 THEN games_won + $5 
                WHEN player_id = $2 THEN games_won + $6 
                ELSE games_won 
               END,
    games_lost = CASE 
                WHEN player_id = $1 THEN games_lost + $6 
                WHEN player_id = $2 THEN games_lost + $5 
               ELSE games_lost 
               END
    WHERE league_id = $7
    AND group_name = $8
    AND player_id IN ($1, $2)
    RETURNING *
  ;`;

  try {
    const result = await db.query(updateStandingsQuery, [
      winner_id,
      loser_id,
      winnerSetsWon,
      loserSetsWon,
      winnerGamesWon,
      loserGamesWon,
      league_id,
      group_name,
    ]);
    return result.rows;
  } catch (err) {
    throw err;
  }
};
