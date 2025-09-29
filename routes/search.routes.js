const express = require("express");
const router = express.Router();
const {search, recommend} = require("../controller/search.controller");

router.get("/search", search);
router.get("/:id/recommend", recommend);