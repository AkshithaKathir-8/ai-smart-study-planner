export function generateInsights({
  subjects,
  sessions,
  records,
  notes,
}) {
  const insights = [];

  // Low attendance
  records.forEach((record) => {
    const percentage = Math.round(
      (record.attended / record.total) * 100
    );

    if (percentage < 75) {
      insights.push({
        type: "warning",
        text: `${record.subject} attendance is only ${percentage}%.`,
      });
    }
  });

  // Pending study sessions
  const pending = sessions.filter(
    (session) => session.status === "Pending"
  );

  if (pending.length > 0) {
    insights.push({
      type: "info",
      text: `You have ${pending.length} pending study session${pending.length > 1 ? "s" : ""}.`,
    });
  }

  // Missing notes
  subjects.forEach((subject) => {
    const hasNote = notes.some(
      (note) =>
        note.subject.toLowerCase() ===
        subject.subject.toLowerCase()
    );

    if (!hasNote) {
      insights.push({
        type: "tip",
        text: `No notes found for ${subject.subject}.`,
      });
    }
  });

  // Best-performing subject
  if (subjects.length > 0) {
    const best = [...subjects].sort(
      (a, b) => b.progress - a.progress
    )[0];

    insights.push({
      type: "success",
      text: `${best.subject} is your strongest subject (${best.progress}% progress).`,
    });
  }

  return insights;
}