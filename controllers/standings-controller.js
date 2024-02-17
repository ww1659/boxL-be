const { updateStandings } = require("../models/standings-model");

exports.patchStandings = async (req, res, next) => {
  try {
    const newResult = req.body;
    const updatedStandings = await updateStandings(newResult);
    res
      .status(200)
      .send({ updatedStandings, msg: "standings updated successfully" });
  } catch (err) {
    next(err);
  }
};
