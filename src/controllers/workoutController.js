const Workout = require("../models/Workout");

// ✅ Create workout
exports.createWorkout = async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware sets req.user
    const { dateKey, dateUTC, notes, exercises } = req.body;

    const workout = new Workout({
      user: userId,
      dateKey,
      dateUTC,
      notes,
      exercises,
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all workouts for user
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({
      dateUTC: -1,
    });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single workout
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update workout
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
