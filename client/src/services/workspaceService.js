// Kortex Workspace Service

export function buildWorkspace({
  subjects = [],
  planner = [],
  calendar = [],
  notes = [],
  attendance = [],
}) {
  const pendingSessions = planner.filter(
    (item) => item.status === "Pending"
  );

  const completedSessions = planner.filter(
    (item) => item.status === "Completed"
  );

  const averageAttendance =
    attendance.length > 0
      ? Math.round(
          attendance.reduce(
            (sum, item) => sum + item.percentage,
            0
          ) / attendance.length
        )
      : 0;

  return {
    subjects,

    planner,

    calendar,

    notes,

    attendance,

    stats: {
      totalSubjects: subjects.length,

      totalPlannerSessions: planner.length,

      pendingSessions: pendingSessions.length,

      completedSessions: completedSessions.length,

      totalNotes: notes.length,

      upcomingEvents: calendar.length,

      averageAttendance,
    },
  };
}