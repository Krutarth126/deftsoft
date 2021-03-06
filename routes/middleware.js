const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send({ errorMessgage: "Unauthorized" });

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified.user;
    next();
  } catch (err) {
    res.status(401).send({ errorMessage: "Unauthorized" });
  }
};
