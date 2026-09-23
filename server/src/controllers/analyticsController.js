const Subject = require("../models/Subject");
const Planner = require("../models/Planner");
const Note = require("../models/Note");
const Event = require("../models/Event");
const Attendance = require("../models/Attendance");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const [subjects, planner, notes, events, attendance] =
      await Promise.all([
        Subject.find({ userId }),
        Planner.find({ userId }).populate("subjectId", "name"),
        Note.find({ userId }),
        Event.find({ userId }),
        Attendance.find({ userId }),
      ]);

    // Overall attendance: total attended classes / total classes.
    const validAttendance = attendance.filter(
      (item) => Number(item.total) > 0
    );

    const totalAttended = validAttendance.reduce(
      (sum, item) => sum + Number(item.attended || 0),
      0
    );

    const totalClasses = validAttendance.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );

    const averageAttendance =
      totalClasses > 0
        ? Math.round((totalAttended / totalClasses) * 100)
        : 0;

    // Overall planner progress.
    const completedSessions = planner.filter(
      (item) =>
        item.status &&
        item.status.toLowerCase() === "completed"
    ).length;

    const averageProgress =
      planner.length > 0
        ? Math.round((completedSessions / planner.length) * 100)
        : 0;

    // Per-subject progress and attendance.
    const subjectProgress = subjects.map((subject) => {
      const subjectId = subject._id.toString();

      const subjectPlanner = planner.filter(
        (item) =>
          item.subjectId &&
          item.subjectId._id.toString() === subjectId
      );

      const subjectCompleted = subjectPlanner.filter(
        (item) =>
          item.status &&
          item.status.toLowerCase() === "completed"
      ).length;

      const progress =
        subjectPlanner.length > 0
          ? Math.round(
              (subjectCompleted / subjectPlanner.length) * 100
            )
          : 0;

      const subjectAttendance = attendance.filter(
        (item) => item.subjectId.toString() === subjectId
      );

      const subjectAttended = subjectAttendance.reduce(
        (sum, item) => sum + Number(item.attended || 0),
        0
      );

      const subjectTotal = subjectAttendance.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0
      );

      const attendancePercentage =
        subjectTotal > 0
          ? Math.round((subjectAttended / subjectTotal) * 100)
          : null;

      // Higher score means the subject may need more attention.
      // If attendance is unavailable, base the score on progress only.
      const attentionScore =
        attendancePercentage === null
          ? 100 - progress
          : (100 - progress) * 0.6 +
            (100 - attendancePercentage) * 0.4;

      return {
        subject: subject.name,
        subjectId,
        progress,
        attendance: attendancePercentage,
        attentionScore: Math.round(attentionScore),
      };
    });

    // Recent activity.
    const recentActivity = [
      ...planner.map((item) => ({
        title: item.topic,
        type: "Planner",
        createdAt: item.createdAt,
      })),
      ...notes.map((item) => ({
        title: item.title,
        type: "Note",
        createdAt: item.createdAt,
      })),
      ...events.map((item) => ({
        title: item.title,
        type: "Event",
        createdAt: item.createdAt,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 5);

    res.json({
      totalSubjects: subjects.length,
      totalPlanner: planner.length,
      totalNotes: notes.length,
      totalEvents: events.length,
      averageAttendance,
      averageProgress,
      subjectProgress,
      attendanceChart: attendance,
      recentActivity,
      recentPlanner: planner,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};