const Quiz = require("../models/Quiz");

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user.id,
    }).populate("subjectId", "name color");

    res.json(quizzes);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Create quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create({
      userId: req.user.id,
      subjectId: req.body.subjectId,
      score: req.body.score,
      totalQuestions: req.body.totalQuestions,
      percentage: req.body.percentage,
      questions: req.body.questions,
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

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};