const ExerciseTemplate = require("../models/ExerciseTemplate");

// ✅ Create template
exports.createTemplate = async (req, res) => {
  try {
    const template = new ExerciseTemplate({ ...req.body, user: req.user.id });
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get templates (public + user)
exports.getTemplates = async (req, res) => {
  try {
    const templates = await ExerciseTemplate.find({
      $or: [{ user: req.user.id }, { user: null }],
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
