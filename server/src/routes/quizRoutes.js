const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getQuizzes,
  createQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

router.get("/", protect, getQuizzes);

router.post("/", protect, createQuiz);

router.delete("/:id", protect, deleteQuiz);

module.exports = router;