//required libs
const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//express router for routing
const router = express.Router();

//Route 1: Get all the notes using: GET "/api/notes/fetchallnotes" , Login Require
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    //fetching notes of the logged in user through the user-id
    const Notes = await notes.find({ user: req.user.id });
    res.json(Notes);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//Route 2: Add a new note using: POST "/api/notes/addnote" , Login Require
router.post(
  "/addnote",
  //middlewre
  fetchuser,
  //validations
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
    //if validation passed then add note
    if (result.isEmpty()) {
      try {
        //fetching title , description , tag from the req body by destructuring
        const { title, description, tag } = req.body;
        //creting new note obj
        const note = new notes({
          title,
          description,
          tag,
          user: req.user.id,
        });
        //saving newly creted note
        const savedNote = await note.save();
        res.json(savedNote);
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    }
    //if validation failed then show error
    else {
      res.status(400).send({ error: result.array() });
    }
  }
);

//Route 3: Update an exsiting note using: PUT "/api/notes/updatenote/:id" , Login Require
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    //fetching title , description , tag from the req body by destructuring
    const { title, description, tag } = req.body;
    //create a new note obj
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be updated and update it
    let targetNote = await notes.findById(req.params.id);
    //if there is no note for the requested note-id
    if (!targetNote) {
      return res.status(404).send("Not Found");
    }
    //checking user-id of note and logged in user-id , same or not
    if (targetNote.user.toString() !== req.user.id) {
      return res.status(400).send("Not Allowed");
    }
    //updating the required note
    targetNote = await notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.send(targetNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 4: Delete an exsiting note using: DELETE "/api/notes/deletenote/:id" , Login Require
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted and delete it
    let deleteNote = await notes.findById(req.params.id);
    //if no note found to be deleted
    if (!deleteNote) {
      return res.status(404).send("Not Found");
    }
    //checking user-id of note and logged in user-id , same or not
    if (deleteNote.user.toString() !== req.user.id) {
      return res.status(400).send("Not Allowed");
    }
    //deleting note
    deleteNote = await notes.findByIdAndDelete(req.params.id);
    //sending response
    res.send({
      Status: "Note has been successfully deleted",
      note: deleteNote,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
