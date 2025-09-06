const Note = require("../models/noteModel");
const NoteDTO = require("../dto/noteDto");

/**
 * Create a note (user only)
 */
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });
    const noteDto = new NoteDTO(note);
    res.status(201).json(noteDto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get all notes of logged-in user
 */
exports.getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    const notesDto = notes.map((note) => new NoteDTO(note));
    res.json(notesDto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update a note (user or admin)
 */
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // Users can only update their own notes
    if (req.user.role === "user" && note.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();

    res.json(new NoteDTO(note));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete a note (user or admin)
 */
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    // Users can only delete their own notes
    if (req.user.role === "user" && note.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
