const express = require("express");
const router = express.Router();
const {organization, listOrganization} = require("../controller/org.controller");

router.post("/orgs", organization);
router.get("/orgs", listOrganization);

module.exports = router