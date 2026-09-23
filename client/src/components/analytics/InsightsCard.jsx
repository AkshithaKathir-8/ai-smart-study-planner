import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/analyticsService";

function InsightsCard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.log(
          "Insights error:",
          err.response?.data || err.message
        );
      }
    };

    loadAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 animate-pulse h-72" />
    );
  }

  // --------------------------------
  // Best Performing Subject
  // --------------------------------

  const bestSubject = analytics.subjectProgress?.length
    ? [...analytics.subjectProgress].sort(
        (a, b) => b.progress - a.progress
      )[0]
    : null;

  // --------------------------------
  // Lowest Attendance Subject
  // --------------------------------

  let lowestAttendance = null;

  if (analytics.attendanceChart?.length) {
    const attendanceWithPercentage =
      analytics.attendanceChart
        .filter(
          (item) =>
            item.total > 0 &&
            item.subjectId
        )
        .map((item) => ({
          ...item,
          percentage: Math.round(
            (item.attended / item.total) * 100
          ),
        }));

    if (attendanceWithPercentage.length > 0) {
      lowestAttendance =
        [...attendanceWithPercentage].sort(
          (a, b) => a.percentage - b.percentage
        )[0];
    }
  }

  // --------------------------------
  // Overall Completion
  // --------------------------------

  const overallProgress =
    analytics.averageProgress || 0;

  // --------------------------------
  // Insight message
  // --------------------------------

  let productivityMessage =
    "Start completing planner sessions to build your study progress.";

  if (overallProgress >= 80) {
    productivityMessage =
      "Excellent study progress! Keep maintaining your consistency.";
  } else if (overallProgress >= 50) {
    productivityMessage =
      "You're making steady progress. Completing more planned sessions will improve your consistency.";
  } else if (analytics.totalPlanner > 0) {
    productivityMessage =
      "You have planned study sessions available. Try completing them regularly to improve your progress.";
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          AI Insights
        </h2>

        <p className="text-slate-500 mt-1">
          Personalized insights based on your academic activity.
        </p>
      </div>

      <div className="space-y-5 mt-6">

        {/* Best Subject */}

        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">

          <h3 className="font-semibold text-slate-800">
            ⭐ Best Performing Subject
          </h3>

          <p className="mt-2 text-slate-600">

            {bestSubject ? (
              <>
                <strong>{bestSubject.subject}</strong> currently has
                <strong> {bestSubject.progress}%</strong> planner
                completion.
              </>
            ) : (
              "No subject progress data available yet."
            )}

          </p>

        </div>

        {/* Productivity */}

        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5">

          <h3 className="font-semibold text-slate-800">
            📅 Productivity
          </h3>

          <p className="mt-2 text-slate-600">
            You currently have

            <strong> {analytics.totalPlanner} </strong>
            planner tasks,

            <strong> {analytics.totalNotes} </strong>
            notes and

            <strong> {analytics.totalEvents} </strong>
            calendar events.
          </p>

          <p className="mt-2 text-slate-600">
            Overall planner completion:
            <strong> {overallProgress}%</strong>.
          </p>

          <p className="mt-2 text-indigo-700 font-medium">
            {productivityMessage}
          </p>

        </div>

        {/* Attendance */}

        <div className="rounded-2xl bg-red-50 border border-red-100 p-5">

          <h3 className="font-semibold text-slate-800">
            ⚠ Attendance Alert
          </h3>

          <p className="mt-2 text-slate-600">

            {lowestAttendance ? (
              <>
                Your lowest attendance record is
                <strong> {lowestAttendance.percentage}%</strong>.
                Try to improve your attendance for this subject.
              </>
            ) : (
              "No attendance records found."
            )}

          </p>

          <p className="mt-2 text-slate-500 text-sm">
            Overall attendance:
            <strong> {analytics.averageAttendance}%</strong>
          </p>

        </div>

      </div>

    </div>
  );
}

export default InsightsCard;