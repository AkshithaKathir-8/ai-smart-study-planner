const Planner = require("../models/Planner");

// ----------------------------
// Create Session
// ----------------------------

const {
  isValidLocalDate,
  addStreakEntry,
  removeStreakEntry,
  getStreakData,
} = require("../utils/streakHelper"); 

const createSession = async (req, res) => {

  try {

    const session = await Planner.create({

      userId: req.user.id,

      subjectId: req.body.subjectId,

      topic: req.body.topic,

      examDate: req.body.examDate,

      studyDate: req.body.studyDate,

      startTime: req.body.startTime,

      endTime: req.body.endTime,

      difficulty: req.body.difficulty,

      priority: req.body.priority,

      status: req.body.status || "Pending",

      aiRecommendation: req.body.aiRecommendation,

    });

    const populatedSession = await Planner.findById(session._id)
      .populate("subjectId", "name code");

    res.status(201).json(populatedSession);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ----------------------------
// Get Sessions
// ----------------------------

const getSessions = async (req, res) => {

  try {

    const sessions = await Planner.find({

      userId: req.user.id,

    })

      .populate("subjectId", "name code")

      .sort({

        studyDate: 1,

      });

    res.json(sessions);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ----------------------------
// Update Session
// ----------------------------

const updateSession = async (req, res) => {
  try {
    const { localDate, ...updateData } = req.body;

    const session = await Planner.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const wasCompleted = session.status === "Completed";
    const willBeCompleted =
    (updateData.status ?? session.status) === "Completed";

    if (willBeCompleted && !wasCompleted && !isValidLocalDate(localDate)) {
      return res.status(400).json({
        message: "A valid localDate in YYYY-MM-DD format is required.",
      });
    }

    Object.assign(session, updateData);
    await session.save();

    if (willBeCompleted && !wasCompleted) {
  await addStreakEntry({
    userId: req.user.id,
    recordId: String(session._id),
    sourceType: "Planner",
    completionDate: localDate,
  });
} else if (!willBeCompleted && wasCompleted) {
  await removeStreakEntry({
    userId: req.user.id,
    recordId: String(session._id),
  });
}

    const populatedSession = await Planner.findById(session._id)
      .populate("subjectId", "name code");

    res.json(populatedSession);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSharedStreak = async (req, res) => {
  try {
    const { localDate } = req.query;

    if (!isValidLocalDate(localDate)) {
      return res.status(400).json({
        message: "A valid localDate in YYYY-MM-DD format is required.",
      });
    }

    const streakData = await getStreakData(req.user.id, localDate);

    res.json({
      currentStreak: streakData.currentStreak,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// ----------------------------
// Delete Session
// ----------------------------

const deleteSession = async (req, res) => {

  try {

    const session = await Planner.findOne({

      _id: req.params.id,

      userId: req.user.id,

    });

    if (!session) {

      return res.status(404).json({

        message: "Session not found",

      });

    }

    await session.deleteOne();

    res.json({

      message: "Study session deleted successfully",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {

  createSession,

  getSessions,

  updateSession,

  deleteSession,

  getSharedStreak,

};