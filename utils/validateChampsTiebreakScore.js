exports.validateChampsTiebreak = (score) => {
  // Regular expression to match the format 'number-number'
  const regex = /^[0-9]+-[0-9]+$/;

  if (regex.test(score)) {
    const [player1Score, player2Score] = score.split("-");
    const p1 = parseInt(player1Score);
    const p2 = parseInt(player2Score);

    if (p1 >= 0 && p2 >= 0) {
      if (p1 > p2) {
        if (p1 === 10 && p1 - p2 >= 2) {
          return true;
        } else if (p1 > 10 && p1 - p2 === 2) {
          return true;
        }
      } else if (p2 > p1) {
        if (p2 === 10 && p2 - p1 >= 2) {
          return true;
        } else if (p2 > 10 && p2 - p1 === 2) {
          return true;
        }
      }
    }
  }

  return false; // Invalid championship tiebreak score
};
