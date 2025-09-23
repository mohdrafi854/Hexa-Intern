const mongoose = require("mongoose");

const InitializeDatabase = async () => {
  await mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.error(err.message);
      
      
      console.log("Failed to connect Database");
    });
};

module.exports = {InitializeDatabase}