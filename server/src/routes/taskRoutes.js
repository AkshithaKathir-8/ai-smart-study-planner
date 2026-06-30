const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Create task
router.post("/", protect, createTask);

// Get all tasks
router.get("/", protect, getTasks);

// Update task
router.put("/:id", protect, updateTask);

// Delete task
router.delete("/:id", protect, deleteTask);

module.exports = router;