const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const attendanceController = require("../controllers/attendanceController");

router.get("/", auth, attendanceController.getAttendance);

router.post("/", auth, attendanceController.createAttendance);

router.put("/:id", auth, attendanceController.updateAttendance);

router.delete("/:id", auth, attendanceController.deleteAttendance);

module.exports = router;