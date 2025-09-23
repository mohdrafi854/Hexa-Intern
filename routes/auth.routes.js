const express = require("express");
const router = express.Router();
const { signUp, getMe } = require("../controller/auth.controller");
const { verifyJWT } = require("../middleware/verifyJWT")



router.post("/register", signUp);
router.get("/me", verifyJWT, getMe);

module.exports = router;
