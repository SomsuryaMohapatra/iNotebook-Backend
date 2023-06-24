const express = require("express");
const user = require("../models/User");
const { body, validationResult } = require("express-validator");

const router = express.Router();

//create a user using: POST "/api/auth" , does not require athentication
router.post(
  "/",
  [
    body("name", "Enter a valid name (Min Length 3)")
      .isLength({ min: 3 })
      .notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password (Min Length 5)")
      .isLength({ min: 5 })
      .notEmpty(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      // res.send(req.body);
      user
        .create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        })
        .then((user) => res.json(user))
        .catch((err) => {
          res.json({ Error: err.message });
        });
    } else {
      res.send({ errors: result.array() });
    }
  }
);

module.exports = router;
