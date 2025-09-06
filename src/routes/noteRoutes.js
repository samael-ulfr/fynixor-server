const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const {
  createNote,
  getMyNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management (user and admin)
 *
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           example: 64f0a5b6c0f2b1f8a5b1f123
 *         title:
 *           type: string
 *           example: My first note
 *         content:
 *           type: string
 *           example: This is the note content
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: 64efab56d0f2b1f8a5b1e111
 *             email:
 *               type: string
 *               example: john.doe@example.com
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /notes/createNote:
 *   post:
 *     summary: Create a note (user only)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first note
 *               content:
 *                 type: string
 *                 example: This is the content of my note
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 */
router.post("/createNote", authMiddleware, authorize("user"), createNote);

/**
 * @swagger
 * /notes/getNotes:
 *   get:
 *     summary: Get all notes for the logged-in user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 */
router.get("/getNotes", authMiddleware, authorize("user"), getMyNotes);

/**
 * @swagger
 * /notes/admin/all:
 *   get:
 *     summary: Get all notes (admin only)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all notes with user info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       403:
 *         description: Forbidden
 */
router.get(
  "/admin/all",
  authMiddleware,
  authorize("admin"),
  async (req, res) => {
    const Note = require("../models/noteModel");
    const notes = await Note.find().populate(
      "user",
      "email firstName lastName"
    );
    const NoteDTO = require("../dto/noteDto");
    const notesDto = notes.map((note) => new NoteDTO(note));
    res.json(notesDto);
  }
);

/**
 * @swagger
 * /notes/updateNotes/{id}:
 *   put:
 *     summary: Update a note (user or admin)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated note title
 *               content:
 *                 type: string
 *                 example: Updated note content
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(
  "/updateNotes/:id",
  authMiddleware,
  authorize(["user", "admin"]),
  updateNote
);

/**
 * @swagger
 * /notes/delete/{id}:
 *   delete:
 *     summary: Delete a note (user or admin)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  authorize(["user", "admin"]),
  deleteNote
);

module.exports = router;
