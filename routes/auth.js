const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  obj = {
    a: "hello",
    number: 34,
  };
  res.json(obj)
});

router.get("/a", (req, res) => {
    obj = {
      a: "hi",
      number: 21,
    };
    res.json(obj)
  });

module.exports=router;