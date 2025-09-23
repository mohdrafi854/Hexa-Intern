const express = require("express");
const router = express.Router();

const { addQuestion, listQuestion } = require("../controller/question.controller");

router.post("/question", addQuestion);
router.get("/question", listQuestion);

module.exports = router;
