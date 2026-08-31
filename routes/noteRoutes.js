const express = require("express");
const Note = require("../models/note");

const router = express.Router();

// ==================== CREATE NOTE ====================

router.post("/", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
      return res.status(400).json({
        message: "Title, content and userId are required",
      });
    }

    const note = new Note({
      title,
      content,
      userId,
    });

    const savedNote = await note.save();

    res.status(201).json({
      message: "Note created successfully",
      note: savedNote,
    });

  } catch (error) {
    console.error("Create Note Error:", error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
});


// ==================== GET USER NOTES ====================

router.get("/:userId", async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);

  } catch (error) {
    console.error("Get Notes Error:", error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});


// ==================== UPDATE NOTE ====================

router.put("/:id", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });

  } catch (error) {
    console.error("Update Note Error:", error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
});


// ==================== DELETE NOTE ====================

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });

  } catch (error) {
    console.error("Delete Note Error:", error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
});


module.exports = router;