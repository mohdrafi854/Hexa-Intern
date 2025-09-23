const Quiz = require("../model/Quiz.model");

const addQuiz = async (req, res) => {
  try {
    const { title, category, difficulty, timeLimit } = req.body;
    if (!title || !category || !difficulty || !timeLimit) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const quiz = new Quiz({ title, category, difficulty, timeLimit });
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Add quiz error", error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const listQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.find();
    if (quiz.length === 0) {
      return res.status(200).json({ message: "No quizz found.", quiz:[] });
    }

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Quiz list Error", error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = { addQuiz, listQuiz};
