const express = require("express");
const router = express.Router();
const {addQuiz, listQuiz} = require("../controller/quiz.controller");

router.post("/quiz", addQuiz);
router.get("/quiz", listQuiz);

module.exports = router