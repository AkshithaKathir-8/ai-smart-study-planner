function generateAIResponse(message) {

  const text = message.toLowerCase();

  // -----------------------------
  // Study Plan
  // -----------------------------

  if (
    text.includes("study plan") ||
    text.includes("schedule")
  ) {

    return `📅 Study Plan

Monday
• Review Concepts
• Practice Problems

Tuesday
• Revise Notes
• Solve Previous Questions

Wednesday
• Mock Test

Thursday
• Weak Topics

Friday
• Final Revision

Good luck! 🚀`;

  }

  // -----------------------------
  // Quiz
  // -----------------------------

  if (
    text.includes("quiz")
  ) {

    return `📚 Quick Quiz

1. What is Polymorphism?

2. What is Normalization?

3. Explain Deadlock.

4. What is OS Scheduling?

5. Difference between Stack and Queue?`;

  }

  // -----------------------------
  // Notes
  // -----------------------------

  if (
    text.includes("notes") ||
    text.includes("summarize")
  ) {

    return `📝 Notes Assistant

I can help you:

• Summarize notes

• Explain difficult topics

• Generate flashcards

• Create revision points`;

  }

  // -----------------------------
  // Productivity
  // -----------------------------

  if (
    text.includes("productive") ||
    text.includes("productivity")
  ) {

    return `🎯 Productivity Tips

✔ Study in 50 minute sessions

✔ Take 10 minute breaks

✔ Remove phone distractions

✔ Revise before sleeping`;

  }

  // -----------------------------
  // Attendance
  // -----------------------------

  if (
    text.includes("attendance")
  ) {

    return `📊 Attendance Tracker

You can monitor attendance from the Analytics module.

I'll soon be able to analyze it automatically.`;

  }

  // -----------------------------
  // Default
  // -----------------------------

  return `🤖 Kortex AI

I understand your request.

Soon I'll be connected to your planner,
calendar,
subjects,
notes,
attendance,
and Google Gemini.

For now try asking:

• Create Study Plan

• Quiz Me

• Productivity Tips

• Summarize Notes`;
}

export default generateAIResponse;