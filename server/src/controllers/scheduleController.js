const Task = require("../models/Task");

const priorityValue = {
  high: 3,
  medium: 2,
  low: 1,
};

const generateSchedule = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      status: { $ne: "completed" },
    });

    tasks.sort((a, b) => {
      if (priorityValue[b.priority] !== priorityValue[a.priority]) {
        return priorityValue[b.priority] - priorityValue[a.priority];
      }

      return new Date(a.deadline) - new Date(b.deadline);
    });

    res.status(200).json({
      message: "Study schedule generated successfully",
      schedule: tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { generateSchedule };