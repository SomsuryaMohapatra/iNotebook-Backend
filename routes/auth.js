const express = require("express");
const user = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = "narut$o";

//create a user using: POST "/api/auth/createuser" , does not require athentication
router.post(
  "/createuser",
  //validations
  [
    body("name", "Enter a valid name (Min Length 3)")
      .isLength({ min: 3 })
      .notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password (Min Length 5)")
      .isLength({ min: 5 })
      .notEmpty(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    //if no error then create user
    if (result.isEmpty()) {
      try {
        //find a user with the body mail id
        let User = await user.findOne({ email: req.body.email });
        //if user found then display error
        if (User) {
          return res
            .status(400)
            .json({ error: "User already exists with this email" });
        }
        //else create the user with hashed password
        else {
          //salt generation to secure password
          const salt = await bcrypt.genSalt(10);
          //password hashing
          const securePassword = await bcrypt.hash(req.body.password, salt);
          //user creation
          User = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
          });
          //JWT auuthentication
          const data = {
            User: {
              id: User.id,
            },
          };
          const authToken = jwt.sign(data, JWT_SECRET);
          res.json({ data, authToken });
          //res.json(User);
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.send({ errors: result.array() });
    }
  }
);

//Authenticte a user using: POST "/api/auth/login" , does not require athentication
router.post(
  "/login",
  //validations
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Can not be blank")
      .exists()
      .isLength({ min: 5 })
      .notEmpty(),
  ],
  async (req, res) => {
    //validation result
    const result = validationResult(req);
    //if no error , then find a user with entered mail
    if (result.isEmpty()) {
      const { email, password } = req.body;
      try {
        let User = await user.findOne({ email });
        //if user not found , set bad request
        if (!User) {
          return res
            .status(400)
            .json({ error: "Please Login with correct credentials" });
        }
        //if user found then compare entered pasword with actual password 
        else {
          const passwordCompare = await bcrypt.compare(password, User.password);
          //if password does not match then set bad request
          if (!passwordCompare) {
            return res
              .status(400)
              .json({ error: "Please Login with correct credentials" });
          }
          //if password match then send authToken 
          else {
            const payload = {
              User: {
                id: User.id,
              },
            };
            const authToken = jwt.sign(payload,JWT_SECRET);
            res.send({authToken})
          }
        }
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    } 
    //if validation failed then show error
    else {
      res.send({ error: result.array() });
    }
  }
);

module.exports = router;
