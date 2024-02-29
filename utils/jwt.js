const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: `${__dirname}/../.env.config`,
});

//sign JWT
exports.signJWT = (payload, expiresIn) => {
  try {
    const privateKey = process.env.TOKEN_PRIVATE;
    return jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn,
    });
  } catch (error) {
    console.error(error);
  }
};

//verify JWT
exports.verifyJWT = (token) => {
  try {
    const publicKey = process.env.TOKEN_PUBLIC;
    const decoded = jwt.verify(token, publicKey);
    return { success: true, payload: decoded, expired: false };
  } catch (error) {
    return {
      success: false,
      payload: null,
      expired: error.message.include("jwt expired"),
    };
  }
};
