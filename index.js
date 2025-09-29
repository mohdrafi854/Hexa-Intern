const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const orgRoutes = require("./routes/org.routes");
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const userRoutes = require("./routes/user.routes");
const commentRoutes = require("./routes/comment.routes");

app.get("/", (req, res) => {
  res.send("Server Start");
});


app.use("/api/v1", orgRoutes)
app.use("/api/v1", authRoutes);
app.use("/api/v1", articleRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", commentRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Srever running star ${PORT}`);
});
