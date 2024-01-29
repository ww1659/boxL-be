const { enterUser } = require("../models/users-model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.createNewUser = async (req, res, next) => {
  try {
    const { username, name, email, password, avatar_url, club } = req.body;
    if (password.length < 8) {
      res
        .status(400)
        .send({ msg: "password must be at least 8 characters long" });
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = {
        username,
        name,
        email,
        password_hash: hashedPassword,
        avatar_url,
        club,
      };
      const createdUser = await enterUser(newUser);
      res.status(201).send({ newUser: createdUser, msg: "new user created" });
    }
  } catch (err) {
    next(err);
  }
};
