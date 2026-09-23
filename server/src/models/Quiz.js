const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    questions: [
      {
        question: String,

        options: [String],

        correctAnswer: String,

        selectedAnswer: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);