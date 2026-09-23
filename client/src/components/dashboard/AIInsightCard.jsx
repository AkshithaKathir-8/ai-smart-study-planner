import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { getAnalytics } from "../../services/analyticsService";

function AIInsightCard() {
  const [analytics, setAnalytics] = useState({
    totalSubjects: 0,
    totalPlanner: 0,
    totalNotes: 0,
    totalEvents: 0,
    averageAttendance: 0,
    averageProgress: 0,
    subjectProgress: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAnalytics();

      setAnalytics({
        totalSubjects: data.totalSubjects ?? 0,
        totalPlanner: data.totalPlanner ?? 0,
        totalNotes: data.totalNotes ?? 0,
        totalEvents: data.totalEvents ?? 0,
        averageAttendance: data.averageAttendance ?? 0,
        averageProgress: data.averageProgress ?? 0,
        subjectProgress: data.subjectProgress ?? [],
      });
    } catch (err) {
      console.error("Failed to refresh AI recommendation:", err);
      setError("Unable to refresh recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const recommendedSubject =
    analytics.subjectProgress.length > 0
      ? [...analytics.subjectProgress].sort(
          (a, b) => b.attentionScore - a.attentionScore
        )[0]
      : null;

  const recommendation = recommendedSubject
    ? `Focus on ${recommendedSubject.subject} today. Your current progress is ${recommendedSubject.progress}%. ${
        recommendedSubject.attendance !== null &&
        recommendedSubject.attendance !== undefined
          ? `Your attendance in this subject is ${recommendedSubject.attendance}%. `
          : ""
      }Spend about 45 minutes revising concepts and complete one practice session to improve consistency.`
    : "Start by adding your subjects, planner sessions, and attendance records. Kortex AI will use your academic data to recommend what to focus on.";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl p-7 shadow-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-3 rounded-2xl">
          <Sparkles size={28} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">AI Study Coach</h2>
          <p className="text-indigo-100">
            Personalized recommendation based on your data
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
        <p className="leading-8 text-lg" aria-live="polite">
          {loading ? "Refreshing your recommendation..." : recommendation}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-indigo-100 text-sm">Subjects</p>
          <h3 className="text-2xl font-bold">
            {analytics.totalSubjects}
          </h3>
        </div>

        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-indigo-100 text-sm">Attendance</p>
          <h3 className="text-2xl font-bold">
            {analytics.averageAttendance}%
          </h3>
        </div>
      </div>

      <button
        type="button"
        onClick={loadAnalytics}
        disabled={loading}
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          bg-white
          text-indigo-700
          px-6
          py-3
          rounded-xl
          font-semibold
          hover:scale-105
          transition
          disabled:cursor-not-allowed
          disabled:opacity-70
          disabled:hover:scale-100
        "
      >
        <RefreshCw
          size={18}
          className={loading ? "animate-spin" : ""}
        />

        {loading ? "Refreshing..." : "Refresh Recommendation"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-100" role="alert">
          {error}
        </p>
      )}
    </motion.div>
  );
}

export default AIInsightCard;