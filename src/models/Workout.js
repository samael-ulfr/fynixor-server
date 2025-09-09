const mongoose = require("mongoose");

const SetSchema = new mongoose.Schema(
  {
    setNumber: { type: Number, required: true },
    reps: { type: Number, default: null, required: true },
    weight: { type: Number, default: null, required: true },
    unit: { type: String, enum: ["kg", "lb"], default: "kg" },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const ExerciseEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["strength", "cardio", "other"],
      default: "strength",
      required: true,
    },
    sets: [SetSchema],
  },
  { _id: true }
);

const WorkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateKey: { type: String, required: true },
    dateUTC: { type: Date, required: true },
    notes: { type: String, default: "" },
    exercises: [ExerciseEntrySchema],
  },
  { timestamps: true }
);

WorkoutSchema.index({ user: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("Workout", WorkoutSchema);
