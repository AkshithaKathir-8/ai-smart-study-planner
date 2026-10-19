import { useEffect, useState } from "react";

import {
  Sparkles,
  Trophy,
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

function InsightsCard() {
  const [analytics, setAnalytics] =
    useState(null);

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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="h-72 rounded-2xl bg-slate-50 animate-pulse" />
      </div>
    );
  }

  const bestSubject =
    analytics.subjectProgress?.length
      ? [...analytics.subjectProgress].sort(
          (a, b) =>
            b.progress - a.progress
        )[0]
      : null;

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

    if (
      attendanceWithPercentage.length > 0
    ) {
      lowestAttendance =
        [...attendanceWithPercentage].sort(
          (a, b) =>
            a.percentage - b.percentage
        )[0];
    }
  }

  const overallProgress =
    analytics.averageProgress || 0;

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
    <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center">
              <Sparkles
                size={23}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                AI Insights
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Personalized observations from your academic activity.
              </p>
            </div>
          </div>

          <span className="inline-flex self-start md:self-auto items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            <Sparkles size={13} />
            Kortex AI
          </span>
        </div>

        {/* Insights */}
        <div className="grid lg:grid-cols-3 gap-4 mt-7">

          {/* Best Subject */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Trophy
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <span className="text-xs font-semibold text-emerald-600">
                Performance
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-5">
              Best Subject
            </p>

            {bestSubject ? (
              <>
                <h3 className="text-lg font-bold text-slate-800 mt-1">
                  {bestSubject.subject}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Planner completion
                </p>

                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {bestSubject.progress}%
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500 mt-3">
                No subject progress data available yet.
              </p>
            )}
          </div>

          {/* Productivity */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <CalendarCheck
                  size={19}
                  className="text-indigo-600"
                />
              </div>

              <span className="text-xs font-semibold text-indigo-600">
                Productivity
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-5">
              Planner Completion
            </p>

            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {overallProgress}%
            </p>

            <p className="text-sm text-slate-500 mt-2">
              {analytics.totalPlanner} tasks ·{" "}
              {analytics.totalNotes} notes ·{" "}
              {analytics.totalEvents} events
            </p>

            <p className="text-xs text-indigo-700 font-medium mt-3 leading-relaxed">
              {productivityMessage}
            </p>
          </div>

          {/* Attendance */}
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <AlertTriangle
                  size={19}
                  className={
                    lowestAttendance &&
                    lowestAttendance.percentage < 75
                      ? "text-red-500"
                      : "text-orange-500"
                  }
                />
              </div>

              <span className="text-xs font-semibold text-orange-600">
                Attendance
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-5">
              Area to Watch
            </p>

            {lowestAttendance ? (
              <>
                <h3 className="text-lg font-bold text-slate-800 mt-1">
                  Needs Attention
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Lowest attendance
                </p>

                <p
                  className={`text-2xl font-bold mt-1 ${
                    lowestAttendance.percentage < 75
                      ? "text-red-600"
                      : "text-orange-600"
                  }`}
                >
                  {lowestAttendance.percentage}%
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-800 mt-1">
                  No Alert
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  No attendance records found.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom summary */}
        <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
              <TrendingUp
                size={18}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Overall academic snapshot
              </p>

              <p className="text-xs text-slate-400 mt-0.5">
                Keep your study sessions and attendance consistent.
              </p>
            </div>
          </div>

          <div className="text-sm font-bold text-slate-700">
            {analytics.averageAttendance}% attendance
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightsCard;