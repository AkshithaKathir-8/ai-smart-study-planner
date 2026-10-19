const Subject = require("../models/Subject");
const Planner = require("../models/Planner");

const {
  removeStreakEntry,
} = require("../utils/streakHelper");

// GET SUBJECTS
const getSubjects = async (req, res) => {
  try {
    console.log("Logged in user:", req.user.id);

    const subjects = await Subject.find({
      userId: req.user.id,
    });

    console.log("Subjects found:", subjects);

    res.json(subjects);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// CREATE SUBJECT
const createSubject = async (req, res) => {
  try {
    const {
      name,
      code,
      credits,
      color,
    } = req.body;

    const subject = await Subject.create({
      userId: req.user.id,
      name,
      code,
      credits,
      color,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE SUBJECT
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    subject.name =
      req.body.name || subject.name;

    subject.code =
      req.body.code || subject.code;

    subject.credits =
      req.body.credits || subject.credits;

    subject.color =
      req.body.color || subject.color;

    await subject.save();

    res.json(subject);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE SUBJECT
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // Find all planner sessions belonging
    // to this subject and this user
    const plannerSessions =
      await Planner.find({
        subjectId: subject._id,
        userId: req.user.id,
      }).select("_id");

    // Remove streak entries belonging
    // to completed planner sessions
    for (const session of plannerSessions) {
      await removeStreakEntry({
        userId: req.user.id,
        recordId: String(session._id),
      });
    }

    // Delete all planner sessions
    // associated with this subject
    await Planner.deleteMany({
      subjectId: subject._id,
      userId: req.user.id,
    });

    // Finally delete the subject
    await subject.deleteOne();

    res.json({
      message:
        "Subject and related planner sessions deleted successfully",
    });
  } catch (error) {
    console.log(
      "Delete subject failed:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};