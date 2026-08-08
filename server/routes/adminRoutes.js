const express = require("express");
const router = express.Router();
const { getAdminConfig, updateAdminConfig } = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/", getAdminConfig);
router.put("/", protect, isAdmin, updateAdminConfig);

module.exports = router;