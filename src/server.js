require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");


const demoRoutes = require("./routes/demoRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/demo", demoRoutes);

app.get("/", (req, res) => {
  res.json({ message: process.env.GREETING });
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
