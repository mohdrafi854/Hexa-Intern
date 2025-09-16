const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI

const initializeDatabase = async() => {
    try {
        await mongoose.connect(mongoUri)
        .then(() => {
            console.log("Database Connected");
        }).catch((error) => {
            console.error("Database Error", error);
        })
    } catch (error) {
        console.error("Database Error", error);
    }
}

module.exports = {initializeDatabase}