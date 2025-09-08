const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const UserDTO = require("../dto/usersDTO");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Schemas
const signupSchema = Joi.object({
  firstName: Joi.string().trim().min(1).required(),
  lastName: Joi.string().trim().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(/(?=.*[a-z])/)
    .pattern(/(?=.*[A-Z])/)
    .pattern(/(?=.*\d)/)
    .pattern(/(?=.*[@$!%*?&])/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// --- Sign Up ---
exports.createUser = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { firstName, lastName, email, password, role } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const userDto = new UserDTO(user);
    return res.status(201).json({ user: userDto });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// --- Sign In ---
// controllers/userController.js
exports.signIn = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    // Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// --- Verify User Exists ---
exports.verifyUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email)
      return res.status(400).json({ error: "Email query param required" });

    const user = await User.findOne({ email });
    return res.status(200).json({ exists: !!user });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// --- Logout (stateless) ---
// controllers/userController.js
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  return res.status(200).json({ message: "Logout successful" });
};

// --- Protected Route ---
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const userDto = new UserDTO(user);
    return res.status(200).json({ user: userDto });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// --- Forgot Password ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In real app, send email. Here we just return token.
    return res
      .status(200)
      .json({ message: "Password reset token generated", token });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// --- Reset Password ---
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const usersDTO = users.map((user) => new UserDTO(user));
    res.json({ users: usersDTO });
  } catch (err) {
    next(err);
  }
};
// controllers/userController.js

/**
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users but exclude the password
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a user by ID (Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
