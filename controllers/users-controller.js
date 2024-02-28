const {
  enterUser,
  getHashedPassword,
  getUserByUsername,
  fetchUsersByLeagueId,
  fetchUserById,
} = require("../models/users-model");
const bcrypt = require("bcrypt");
const { signJWT, verifyJWT } = require("../utils/jwt");
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

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await fetchUserById(userId);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.createUserSession = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    //get hashed_password
    const hashedPassword = user.password_hash;

    //compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!user || !isPasswordCorrect) {
      return res.status(401).send({ msg: "invalid username or password" });
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      club_id: user.club_id,
    };

    //create access token
    const accessToken = signJWT(payload, "1h");

    //set access token in cookie
    res.cookie("accessToken", accessToken, { maxAge: 300000, httpOnly: true });

    //verify token
    const verification = verifyJWT(accessToken);

    return res.status(201).send({
      status: "success",
      token: accessToken,
      data: verification.payload,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsersByLeagueId = async (req, res, next) => {
  try {
    const { leagueId } = req.params;
    const users = await fetchUsersByLeagueId(leagueId);
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};
