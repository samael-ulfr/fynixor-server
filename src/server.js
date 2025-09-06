require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middlewares/errorHandler");
// app.js
const cookieParser = require("cookie-parser");

// Routes
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // allow cookies
  })
);
// app.js
const noteRoutes = require("./routes/noteRoutes");

app.use(cookieParser());
app.use(express.json());

// Swagger docs
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notes", noteRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({ message: process.env.GREETING });
});

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at ${port}`));
