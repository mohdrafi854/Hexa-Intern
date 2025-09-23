const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "medium", "hard"],
      default:"beginner",
    },
    timeLimit: {
      type: Number,
      required:true,
      default:30,
    },
  },
  { timestamps: true }
);

const Quiz = new mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
