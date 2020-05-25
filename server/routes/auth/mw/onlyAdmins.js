const jwt = require("jsonwebtoken");
require("dotenv").config();

const onlyAdmins = (req, res, next) => {
  const token = req.header("token");

  if (token) {
    jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
      if (err) throw err.message;
      if (decoded.isAdmin) {
        req.token = decoded;
        next();
      } else {
        res.status(401).send("Not authorized.");
      }
    });
  } else {
    res.status(401).send("You need to login.");
  }
};

module.exports = onlyAdmins;
