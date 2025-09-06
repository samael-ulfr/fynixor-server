// demoController.js
exports.getDemo = (req, res) => {
  res.json({ message: "This is a demo route from the controller!" });
};

exports.createDemo = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(201).json({ message: `Demo created for ${name}` });
};
