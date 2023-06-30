const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

const router = express.Router();

//Route 1: Get all the notes using: GET "/api/notes/fetchallnotes" , Login Require
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const Notes = await notes.find({ user: req.user.id });
    res.json(Notes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//Route 2: Add a new note using: POST "/api/notes/addnote" , Login Require
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title (min 5 characters)")
      .notEmpty()
      .isLength({ min: 5 }),
    body("description", "Enter a valid description (min 10 characters)")
      .notEmpty()
      .isLength({ min: 10 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      try {
        const { title, description, tag } = req.body;
        const note = new notes({
          title,
          description,
          tag,
          user: req.user.id,
        });
        const savedNote = await note.save();
        res.json(savedNote);
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.status(400).send({ error: result.array() });
    }
  }
);

module.exports = router;
