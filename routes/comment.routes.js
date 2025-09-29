const express = require("express");
const router = express.Router();
const {createComments, lockArticle, unlockArticle, lockCheckAndNotification} = require("../controller/comment.controller");

router.post("/articles/:id/comments", createComments);
router.post("/articles/:id/lock", lockArticle);
router.post("/articles/:id/unlock", unlockArticle);
router.post("/articles/:id", lockCheckAndNotification);

module.exports = router