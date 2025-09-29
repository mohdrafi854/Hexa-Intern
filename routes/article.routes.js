const express = require("express");
const router = express.Router();
const { article, listArticle, updateArticle, deleteArticle } = require("../controller/article.controller");
const {verifyToken} = require("../middleware/verifyJWT");
const {tenantCheck} = require("../middleware/tenantMiddleware")
const {roleCheck} = require("../middleware/roleMiddleware");
const { verify } = require("jsonwebtoken");

router.post("/article",  verifyToken, tenantCheck, roleCheck("editro", "admin"), article);
router.put("/article/:articleId", verifyToken, tenantCheck, roleCheck("editor", "admin"), updateArticle);
router.delete("/article/:articleId", verifyToken, tenantCheck, roleCheck("editor", "admin"), deleteArticle)
router.get("/article", verifyToken, roleCheck("Editor", "Admin"), listArticle);

module.exports = router;
