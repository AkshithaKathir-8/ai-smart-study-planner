export function analyzeWorkspace(workspace) {

  const stats = workspace.stats;

  const recommendations = [];

  if (stats.pendingSessions > 5) {

    recommendations.push(
      "You have several pending study sessions. Try completing at least two today."
    );

  }

  if (stats.averageAttendance < 75) {

    recommendations.push(
      "Your attendance needs attention. Focus on improving it this week."
    );

  }

  if (stats.totalNotes < 5) {

    recommendations.push(
      "Create more notes for better revision."
    );

  }

  if (recommendations.length === 0) {

    recommendations.push(
      "Everything looks great! Keep maintaining your study routine."
    );

  }

  return {
    greeting:
      "Good to see you again! 👋",

    summary: {
      subjects: stats.totalSubjects,

      planner: stats.totalPlannerSessions,

      notes: stats.totalNotes,

      attendance: stats.averageAttendance,

      events: stats.upcomingEvents,
    },

    recommendations,
  };
}