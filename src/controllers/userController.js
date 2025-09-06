const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const UserDTO = require("../dto/usersDTO");

// Create a new user
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password: hashedPassword });
    const userDTO = new UserDTO(user);
    res.status(201).json({ message: "User created", user: userDTO });
  } catch (err) {
    next(err); // pass error to error handler
  }
};

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
     const usersDTO = users.map(user => new UserDTO(user));
     res.json({ users: usersDTO });
  } catch (err) {
    next(err);
  }
};
