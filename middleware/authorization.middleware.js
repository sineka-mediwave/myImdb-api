const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
  isAuthorised: async (req, res, next) => {
    try {
      let token = req.headers.Authorization || req.headers.authorization;
      if (token) {
        token = token.substr("Bearer ".length);
        const decoded = await jwt.verify(token, config.jwtSecret);
        if (!decoded) {
          return res.status(401).json({ message: "unauthorized not decoded" });
        }
        req.decoded = decoded;
        return next();
      }
      return res.status(401).json({ message: "unauthorised or no token" });
    } catch (error) {
      return res.status(401).json({ message: "unauthorised user error" });
    }
  },
};
