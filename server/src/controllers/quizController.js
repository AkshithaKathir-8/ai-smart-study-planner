const Quiz = require("../models/Quiz");
const Subject = require("../models/Subject");

// Get all quizzes for the logged-in user
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user.id,
    })
      .populate("subjectId", "name color")
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Save a completed quiz
exports.createQuiz = async (req, res) => {
  try {
    const {
      subjectId,
      score,
      totalQuestions,
      questions,
    } = req.body;

    if (
      !subjectId ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        message: "Subject and quiz questions are required",
      });
    }

    // Confirm the subject belongs to the logged-in user
    const subject = await Subject.findOne({
      _id: subjectId,
      userId: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    const validScore = Number(score);
    const validTotal = Number(totalQuestions);

    if (
      !Number.isFinite(validScore) ||
      !Number.isFinite(validTotal) ||
      validTotal <= 0 ||
      validScore < 0 ||
      validScore > validTotal
    ) {
      return res.status(400).json({
        message: "Invalid quiz score",
      });
    }

    const percentage = Math.round(
      (validScore / validTotal) * 100
    );

    const quiz = await Quiz.create({
      userId: req.user.id,
      subjectId,
      score: validScore,
      totalQuestions: validTotal,
      percentage,
      questions,
    });

    const populated = await Quiz.findById(quiz._id)
      .populate("subjectId", "name color");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete a quiz belonging to the logged-in user
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.json({
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};