import {
  BookOpen,
  CheckCircle2,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { motion } from "framer-motion";

function AttendanceCard({
  record,
  onEdit,
  onDelete,
}) {
  const attended = Number(record.attended || 0);
  const total = Number(record.total || 0);

  const percentage =
    total === 0
      ? 0
      : Math.round((attended / total) * 100);

  const getStatus = () => {
    if (percentage >= 85) {
      return {
        label: "Excellent",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
        progress: "bg-emerald-500",
        ring: "text-emerald-500",
      };
    }

    if (percentage >= 75) {
      return {
        label: "On Track",
        badge: "bg-orange-50 text-orange-700 border-orange-100",
        progress: "bg-orange-500",
        ring: "text-orange-500",
      };
    }

    return {
      label: "Needs Attention",
      badge: "bg-red-50 text-red-700 border-red-100",
      progress: "bg-red-500",
      ring: "text-red-500",
    };
  };

  const status = getStatus();

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference -
    (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <BookOpen
                size={23}
                className="text-indigo-600"
              />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-slate-800 truncate">
                {record.subjectId?.name || "Subject"}
              </h2>

              <p className="text-sm text-slate-400 mt-0.5">
                Attendance record
              </p>
            </div>
          </div>

          <span
            className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold ${status.badge}`}
          >
            {status.label}
          </span>
        </div>

        {/* Main percentage */}
        <div className="flex items-center justify-center py-7">
          <div className="relative w-32 h-32">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 110 110"
            >
              <circle
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="9"
                className="text-slate-100"
              />

              <motion.circle
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="9"
                strokeLinecap="round"
                className={status.ring}
                strokeDasharray={circumference}
                initial={{
                  strokeDashoffset: circumference,
                }}
                animate={{
                  strokeDashoffset: progressOffset,
                }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">
                {percentage}%
              </span>

              <span className="text-xs text-slate-400">
                attendance
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-xs text-slate-400">
              Attended
            </p>

            <p className="text-xl font-bold text-slate-800 mt-1">
              {attended}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-xs text-slate-400">
              Total Classes
            </p>

            <p className="text-xl font-bold text-slate-800 mt-1">
              {total}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-500">
              Progress
            </span>

            <span className="text-xs font-semibold text-slate-600">
              {attended}/{total}
            </span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${percentage}%`,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${status.progress}`}
            />
          </div>
        </div>

        {/* Message */}
        <div className="mt-5">
          {percentage >= 85 ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle2 size={17} />
              Excellent attendance. Keep it up!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <AlertTriangle
                size={17}
                className={percentage < 75 ? "text-red-500" : "text-orange-500"}
              />

              {percentage < 75
                ? "Attendance needs immediate attention."
                : "Try to maintain a consistent attendance level."}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => onEdit(record)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition font-semibold text-sm"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() => onDelete(record._id)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition font-semibold text-sm"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AttendanceCard;