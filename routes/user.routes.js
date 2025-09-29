const express = require("express");
const router = express.Router();
const {createUser, deleteUser, updateRole} = require("../controller/user.controller");
const {verifyToken} = require("../middleware/verifyJWT");
const {tenantCheck} = require("../middleware/tenantMiddleware");
const {roleCheck} = require("../middleware/roleMiddleware");
const User = require("../model/User.model");


router.post("/users/:organizationId", verifyToken, tenantCheck, roleCheck("admin"), createUser)
router.get("/users/:organizationId", verifyToken, tenantCheck, roleCheck("admin"), async (req, res) => {
    try {
        const users = await User.find({organizationId: req.params.organizationId}).select("-password");
        res.json(users)
    } catch (error) {
        res.status(500).json({error:"Server Error"})
    }
})
router.delete("/user/:organizationId/:userId", verifyToken, tenantCheck, roleCheck("admin"), deleteUser)

router.put("/user/:organizationId/:userId", verifyToken, tenantCheck, roleCheck("admin"), updateRole)

module.exports = router