const express = require("express");
const user = require("../models/User");

const router = express.Router();

//create a user using: POST "/api/auth" , does not require athentication
router.post("/", (req, res) => {
  const User = user(req.body);
  User.save();
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;