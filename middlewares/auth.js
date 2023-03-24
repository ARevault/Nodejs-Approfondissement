const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);
    const user = await User.find(decoded.userId);
    if(!user){
      throw "user not found";
    }
    req.user = user[0];
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
