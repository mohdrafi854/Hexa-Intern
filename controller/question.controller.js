const Quiz = require("../model/Quiz.model");
const Question = require("../model/Question.model");

const addQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, timeLimit } = req.body;

    if (!quizId || !questionText || !options || !timeLimit) {
      return res.statud(404).json({ error: "Invalid question data" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const correctAnswer = options.filter((opt) => opt.isCorrect);

    if (correctAnswer.length !== 1) {
      return res.status(404).json({ error: "One option must be correct" });
    }

    const question = new Question({
      quiz: quizId,
      questionText,
      options,
      timeLimit,
    });
    await question.save();

    return res
      .status(201)
      .json({ message: "Question added successfully", question });
  } catch (error) {
    console.error("Add question error", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const listQuestion = async (req, res) => {
  try {
    const questions = await Question.find();
    if (questions.length === 0) {
      return res.status(200).json({ message: "No found list" });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error("Question list error", error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = { addQuestion, listQuestion};
