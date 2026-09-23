const StudyStreak = require("../models/StudyStreak");

const isValidLocalDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

const calculateStreak = (entries, referenceDate) => {
  if (!isValidLocalDate(referenceDate)) return 0;

  const completedDates = new Set(
    entries
      .map((entry) => entry.completionDate)
      .filter(isValidLocalDate)
  );

  const yesterdayDate = new Date(`${referenceDate}T00:00:00.000Z`);
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  // A streak remains active if the user studied today or yesterday.
  if (
    !completedDates.has(referenceDate) &&
    !completedDates.has(yesterday)
  ) {
    return 0;
  }

  let currentDate = completedDates.has(referenceDate)
    ? referenceDate
    : yesterday;

  let streak = 0;

  while (completedDates.has(currentDate)) {
    streak++;

    const previousDate = new Date(`${currentDate}T00:00:00.000Z`);
    previousDate.setUTCDate(previousDate.getUTCDate() - 1);
    currentDate = previousDate.toISOString().slice(0, 10);
  }

  return streak;
};

const addStreakEntry = async ({
  userId,
  recordId,
  sourceType,
  completionDate,
}) => {
  let streak = await StudyStreak.findOne({ userId });

  if (!streak) {
    streak = new StudyStreak({ userId, entries: [] });
  }

  const existing = streak.entries.find(
    (entry) => entry.recordId === recordId
  );

  if (existing) {
    existing.sourceType = sourceType;
    existing.completionDate = completionDate;
  } else {
    streak.entries.push({
      recordId,
      sourceType,
      completionDate,
    });
  }

  await streak.save();
  return streak;
};

const removeStreakEntry = async ({ userId, recordId }) => {
  const streak = await StudyStreak.findOne({ userId });

  if (!streak) return null;

  streak.entries = streak.entries.filter(
    (entry) => entry.recordId !== recordId
  );

  await streak.save();
  return streak;
};

const getStreakData = async (userId, referenceDate) => {
  const streak = await StudyStreak.findOne({ userId });

  const entries = streak?.entries || [];

  return {
    currentStreak: calculateStreak(entries, referenceDate),
    entries,
  };
};

module.exports = {
  isValidLocalDate,
  calculateStreak,
  addStreakEntry,
  removeStreakEntry,
  getStreakData,
};