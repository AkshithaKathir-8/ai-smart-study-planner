const Attendance = require("../models/Attendance");

// =========================
// Get Attendance
// =========================
exports.getAttendance = async (req, res) => {

  try {

    const records = await Attendance.find({

      userId: req.user.id,

    }).populate("subjectId", "name code color");

    res.json(records);

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// =========================
// Create Attendance
// =========================
exports.createAttendance = async (req, res) => {

  try {

    const existing = await Attendance.findOne({

      userId: req.user.id,

      subjectId: req.body.subjectId,

    });

    if (existing) {

      return res.status(400).json({

        message: "Attendance already exists for this subject",

      });

    }

    const record = await Attendance.create({

      userId: req.user.id,

      subjectId: req.body.subjectId,

      attended: req.body.attended || 0,

      total: req.body.total || 0,

    });

    const populated = await Attendance.findById(record._id)

      .populate("subjectId", "name code color");

    res.status(201).json(populated);

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// =========================
// Update Attendance
// =========================
exports.updateAttendance = async (req, res) => {

  try {

    const record = await Attendance.findOneAndUpdate(

      {

        _id: req.params.id,

        userId: req.user.id,

      },

      req.body,

      {

        new: true,

      }

    ).populate("subjectId", "name code color");

    res.json(record);

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// =========================
// Delete Attendance
// =========================
exports.deleteAttendance = async (req, res) => {

  try {

    await Attendance.findOneAndDelete({

      _id: req.params.id,

      userId: req.user.id,

    });

    res.json({

      message: "Attendance deleted successfully",

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};