const mongoose = require("mongoose");

const ExerciseTemplateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["strength", "cardio", "other"],
      default: "strength",
    },
    primaryMuscles: [String],
    equipment: [String],
  },
  { timestamps: true }
);

ExerciseTemplateSchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("ExerciseTemplate", ExerciseTemplateSchema);
