const express = require("express");
const router = express.Router();
const{updateOrgSettings} = require("../controller/organization.controller")
const {verifyToken} = require("../middleware/verifyJWT");
const {tenantCheck} = require("../middleware/tenantMiddleware");
const {roleCheck} = require("../middleware/roleMiddleware");


router.put(
  "/:organizationId/settings",
  verifyToken,
  tenantCheck,
  roleCheck("admin"),
  updateOrgSettings
);

module.exports = router