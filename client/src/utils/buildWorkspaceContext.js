export function buildWorkspaceContext({
  subjects,
  sessions,
  notes,
  records,
  events,
}) {

  return `
You are Kortex AI.

You are an academic assistant.

Current Workspace

Subjects:
${subjects
  .map(
    (s) =>
      `• ${s.subject}
Faculty: ${s.faculty}
Progress: ${s.progress}%
Attendance: ${s.attendance}%`
  )
  .join("\n\n")}

Study Sessions:
${sessions
  .map(
    (s) =>
      `• ${s.subject}
${s.date}
Status: ${s.status}`
  )
  .join("\n\n")}

Notes:
${notes
  .map(
    (n) =>
      `• ${n.title}
Subject: ${n.subject}`
  )
  .join("\n\n")}

Attendance:
${records
  .map(
    (r) =>
      `• ${r.subject}
${r.attended}/${r.total}`
  )
  .join("\n\n")}

Calendar Events:
${events
  .map(
    (e) =>
      `• ${e.title}
${e.date}`
  )
  .join("\n\n")}

Always answer using this workspace.
`;
}