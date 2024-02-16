const { updateStandings } = require("../models/standings-model");

exports.patchStandings = async (req, res, next) => {
  try {
    const newResult = req.body;
    console.log(newResult);
    const updatedStandings = await updateStandings(newResult);
    res.status(201).send({ updatedStandings, msg: "standings updated" });
  } catch (err) {
    next(err);
  }
};
