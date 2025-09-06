require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const greeting = process.env.GREETING || "Hello World!";

// Route
app.get("/", (req, res) => {
  res.send(greeting);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
