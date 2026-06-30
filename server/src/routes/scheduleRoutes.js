const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { generateSchedule } = require("../controllers/scheduleController");

router.get("/", protect, generateSchedule);

module.exports = router;