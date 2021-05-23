const config = require("../../config");
const jwt = require("jsonwebtoken");

module.exports = {
  verifyUserToken: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token)
      return res
        .status(401)
        .json({ message: "Access Denied / Unauthorized request" });

    try {
      token = token.split(" ")[1];

      if (token === "null" || !token)
        return res.status(401).json({ message: "Unauthorized request" });

      let verifiedUser = jwt.verify(token, config.TOKEN_SECRET);
      
      if (!verifiedUser)
        return res.status(401).json({ message: "Unauthorized request" });

      req.user = verifiedUser;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user.admin) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  },
};
