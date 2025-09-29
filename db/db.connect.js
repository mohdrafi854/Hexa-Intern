const mongoose = require("mongoose");

const initializeDatabase = async () => {
  await mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Database connection failed", error);
    });
};

module.exports = { initializeDatabase };
