const mongoose = require("mongoose");

const streakEntrySchema = new mongoose.Schema(
  {
    // Stable identifier for the activity:
    // Planner: the Planner session ID
    // AI Coach: the plan ID plus the plan-day number
    recordId: {
      type: String,
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["Planner", "AI Coach"],
      required: true,
    },

    // Student-local date in YYYY-MM-DD format
    completionDate: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const studyStreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    entries: {
      type: [streakEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyStreak", studyStreakSchema);