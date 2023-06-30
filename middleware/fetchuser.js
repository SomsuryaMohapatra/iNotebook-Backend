const jwt = require("jsonwebtoken");

const JWT_SECRET = "narut$o";

const fetchuser = (req, res, next) => {
  //get the user from the jwt token and add id to the req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticte using a valid token" });
  } else {
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.User;
      next();
    } catch (error) {
      res.status(401).send({ error: "please authenticte using a valid token" });
    }
  }
};

module.exports = fetchuser;
