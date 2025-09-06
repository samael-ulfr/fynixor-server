// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  createUser,
  signIn,
  logout,
  verifyUser,
  getProfile,
  forgotPassword,
  resetPassword,
  getAllUsers, // admin only
  deleteUser, // admin only
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication & management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignup:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           example: Pass@123
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *           example: user
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           example: Pass@123
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64efab56d0f2b1f8a5b1e111
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           example: user
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ForgotPassword:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *     ResetPassword:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           example: abc123resetToken
 *         newPassword:
 *           type: string
 *           example: NewPass@123
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
router.post("/signup", createUser);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Sign in user and return JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: jwt.token.here
 *       401:
 *         description: Invalid credentials
 */
router.post("/signin", signIn);

/**
 * @swagger
 * /users/verify:
 *   get:
 *     summary: Verify if user exists by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email to check
 *     responses:
 *       200:
 *         description: Returns whether user exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 */
router.get("/verify", verifyUser);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user (client should discard JWT/cookie)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post("/logout", logout);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request password reset (generates token)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         description: Token generated (mocked)
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /users/admin/all:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       403:
 *         description: Forbidden
 */
router.get("/admin/all", authMiddleware, authorize("admin"), getAllUsers);

/**
 * @swagger
 * /users/admin/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Forbidden
 */
router.delete("/admin/:id", authMiddleware, authorize("admin"), deleteUser);

module.exports = router;
