const express = require("express");
const router = express.Router();
const { signup, listSignup, login} = require("../controller/auth.controller");

router.post("/users", signup);
router.get("/users", listSignup);
router.post("/login", login);


module.exports = router;


