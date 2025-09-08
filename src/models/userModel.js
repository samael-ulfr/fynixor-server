// models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },
  },
  { timestamps: true },

  (resetPasswordToken = { type: String }),
  (resetPasswordExpires = { type: String })
);

module.exports = mongoose.model("User", userSchema);
