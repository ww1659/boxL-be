const { verifyJWT } = require("../utils/jwt");

exports.deserialiseUser = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).send({ msg: "access denied: no token provided." });
  }

  try {
    const token = accessToken.split(" ")[1];
    const verification = verifyJWT(token);

    if (verification.success) {
      const { exp } = verification.payload;
      const currentTime = Math.floor(Date.now() / 1000);
      if (exp && exp < currentTime) {
        return res
          .status(401)
          .send({ msg: "access denied: token has expired." });
      }
      req.user = verification.payload;
      console.log(req.user);
      next();
    } else {
      return res.status(403).send({ msg: "invalid token." });
    }
  } catch (error) {
    return res.status(403).send({ msg: "invalid token" });
  }
};
