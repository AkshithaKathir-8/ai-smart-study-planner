const Task = require("../models/Task");

const getDashboard = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const pendingTasks = tasks.filter(
      (task) => task.status !== "completed"
    ).length;

    const overdueTasks = tasks.filter(
      (task) =>
        task.deadline < new Date() &&
        task.status !== "completed"
    ).length;

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionPercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getDashboard };