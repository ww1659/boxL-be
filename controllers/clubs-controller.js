const { fetchClubById } = require("../models/clubs-model");

exports.getClubById = async (req, res, next) => {
  const { clubId } = req.params;
  try {
    const club = await fetchClubById(clubId);
    console.log(club);
    res.status(200).send({ club });
  } catch (err) {
    next(err);
  }
};
