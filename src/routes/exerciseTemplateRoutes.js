const express = require("express");
const router = express.Router();
const templateController = require("../controllers/exerciseTemplateController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: ExerciseTemplates
 *   description: Manage exercise templates
 */

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Create a new exercise template
 *     tags: [ExerciseTemplates]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bench Press"
 *               type:
 *                 type: string
 *                 enum: [strength, cardio, other]
 *                 example: "strength"
 *               primaryMuscles:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["Chest", "Triceps"]
 *               equipment:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["Barbell"]
 *     responses:
 *       201:
 *         description: Template created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", auth, templateController.createTemplate);

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get all exercise templates (user + public)
 *     tags: [ExerciseTemplates]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get("/", auth, templateController.getTemplates);

module.exports = router;
