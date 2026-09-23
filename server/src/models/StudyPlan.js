const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "",
  },
  priority: {
    type: String,
    default: "Medium",
  },
  tips: {
    type: String,
    default: "",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const dailyCompletionSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    // Student-local calendar date, formatted YYYY-MM-DD.
    completionDate: {
      type: String,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "AI Generated Study Plan",
    },
    goal: {
      type: String,
      default: "",
    },
    days: {
      type: Number,
      default: 7,
    },
    subjects: {
      type: [String],
      default: [],
    },
    sessions: {
      type: [studySessionSchema],
      default: [],
    },
    dailyCompletions: {
      type: [dailyCompletionSchema],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudyPlan", studyPlanSchema);