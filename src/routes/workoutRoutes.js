const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout management
 */

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dateKey
 *               - dateUTC
 *               - exercises
 *             properties:
 *               dateKey:
 *                 type: string
 *                 example: "2025-09-09"
 *               dateUTC:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-09T05:30:00.000Z"
 *               notes:
 *                 type: string
 *                 example: "Leg day was solid!"
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - type
 *                     - sets
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Barbell Squat"
 *                     type:
 *                       type: string
 *                       enum: [strength, cardio, other]
 *                       example: "strength"
 *                     sets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - setNumber
 *                           - reps
 *                           - weight
 *                         properties:
 *                           setNumber:
 *                             type: integer
 *                             example: 1
 *                           reps:
 *                             type: integer
 *                             example: 5
 *                           weight:
 *                             type: number
 *                             example: 100
 *                           unit:
 *                             type: string
 *                             enum: [kg, lb]
 *                             example: "kg"
 *                           note:
 *                             type: string
 *                             example: "Felt strong, went deep"
 *     responses:
 *       201:
 *         description: Workout created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", auth, workoutController.createWorkout);

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Get all workouts for the authenticated user
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workouts
 */
router.get("/", auth, workoutController.getWorkouts);

/**
 * @swagger
 * /workouts/{id}:
 *   get:
 *     summary: Get a single workout by ID
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Workout object
 *       404:
 *         description: Workout not found
 */
router.get("/:id", auth, workoutController.getWorkoutById);

/**
 * @swagger
 * /workouts/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: "Tweaked form for better depth"
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Deadlift"
 *                     type:
 *                       type: string
 *                       enum: [strength, cardio, other]
 *                     sets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           setNumber:
 *                             type: integer
 *                             example: 2
 *                           reps:
 *                             type: integer
 *                             example: 8
 *                           weight:
 *                             type: number
 *                             example: 140
 *                           unit:
 *                             type: string
 *                             enum: [kg, lb]
 *                             example: "kg"
 *                           note:
 *                             type: string
 *                             example: "Grip slipped, need chalk"
 *     responses:
 *       200:
 *         description: Workout updated
 *       404:
 *         description: Workout not found
 */
router.put("/:id", auth, workoutController.updateWorkout);

/**
 * @swagger
 * /workouts/{id}:
 *   delete:
 *     summary: Delete a workout
 *     tags: [Workouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout deleted
 *       404:
 *         description: Workout not found
 */
router.delete("/:id", auth, workoutController.deleteWorkout);

module.exports = router;
