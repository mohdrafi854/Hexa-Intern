const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const Log = require("./models/Logs.model");
const loggingMiddleware = require("./middleware/logging.middleware");

app.use(loggingMiddleware);

const logRoutes = require("./routes/logs.routes");
app.use("/api/v1/", logRoutes);

const cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

app.get("/", (req, res) => {
  res.send("Backend Start");
});

app.listen(9000, () => {
  console.log("Server running on port 9000");
});
