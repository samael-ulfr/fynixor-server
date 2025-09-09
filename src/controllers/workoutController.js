const Workout = require("../models/Workout");

// ✅ Create or update workout
exports.createWorkout = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { dateKey, dateUTC, notes, exercises } = req.body;

    // ✅ Clean exercises
    const sanitizedExercises = exercises?.map((exercise) => ({
      name: exercise.name,
      type: exercise.type,
      sets: exercise.sets?.map((set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight,
        unit: set.unit || "kg",
        note: set.note || "", // ✅ support note field
      })),
    }));

    // ✅ Check if workout already exists for user & date
    const existingWorkout = await Workout.findOne({ user: userId, dateKey });

    if (existingWorkout) {
      // 🔹 Instead of throwing raw error, send custom message
      return res.status(409).json({
        error: `Workout already exists for date ${dateKey}`,
        message: "Use updateWorkout to modify an existing workout",
      });
    }

    // ✅ Create new workout if not exists
    const workout = new Workout({
      user: userId,
      dateKey,
      dateUTC,
      notes,
      exercises: sanitizedExercises,
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
    const { exercises, ...rest } = req.body;

    let sanitizedExercises;
    if (exercises) {
      sanitizedExercises = exercises.map((exercise) => ({
        name: exercise.name,
        type: exercise.type,
        sets: exercise.sets?.map((set) => ({
          setNumber: set.setNumber,
          reps: set.reps,
          weight: set.weight,
          unit: set.unit || "kg",
          note: set.note || "",
        })),
      }));
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...rest, ...(sanitizedExercises && { exercises: sanitizedExercises }) },
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
