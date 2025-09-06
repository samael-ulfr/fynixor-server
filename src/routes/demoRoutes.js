const express = require("express");
const router = express.Router();
const demoController = require("../controllers/demoController");

/**
 * @swagger
 * tags:
 *   name: Demo
 *   description: Demo API
 */

/**
 * @swagger
 * /api/demo:
 *   get:
 *     summary: Get demo message
 *     tags: [Demo]
 *     responses:
 *       200:
 *         description: Demo message
 */
router.get("/", demoController.getDemo);

/**
 * @swagger
 * /api/demo:
 *   post:
 *     summary: Create a demo
 *     tags: [Demo]
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
 *                 example: John
 *     responses:
 *       201:
 *         description: Demo created
 *       400:
 *         description: Bad request
 */
router.post("/", demoController.createDemo);

module.exports = router;
