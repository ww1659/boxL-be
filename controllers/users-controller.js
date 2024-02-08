const {
  enterUser,
  getHashedPassword,
  getUserByUsername,
} = require("../models/users-model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.createNewUser = async (req, res, next) => {
  try {
    const { username, name, email, password, avatar_url, club_id } = req.body;
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
        club_id,
      };
      const createdUser = await enterUser(newUser);
      res.status(201).send({ newUser: createdUser, msg: "new user created" });
    }
  } catch (err) {
    next(err);
  }
};

exports.checkUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    //get password from the db
    const userPassword = await getHashedPassword(username);
    const hashedPassword = userPassword.password_hash;

    //compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (isPasswordCorrect) {
      const user = await getUserByUsername(username);
      res
        .status(201)
        .send({ status: true, user: user, msg: "authentication successful" });
    } else if (!isPasswordCorrect) {
      res.status(400).send({
        status: false,
        msg: "authentication failed: incorrect password",
      });
    }
  } catch (err) {
    next(err);
  }
};
