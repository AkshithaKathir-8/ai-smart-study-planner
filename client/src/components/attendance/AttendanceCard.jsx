import {
  BookOpen,
  CheckCircle,
  Pencil,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";

function AttendanceCard({
  record,
  onEdit,
  onDelete,
}) {

  const percentage =
    record.total === 0
      ? 0
      : Math.round(
          (record.attended / record.total) * 100
        );

  const progressColor =
    percentage >= 85
      ? "bg-emerald-500"
      : percentage >= 75
      ? "bg-orange-500"
      : "bg-red-500";

  const badgeColor =
    percentage >= 85
      ? "bg-emerald-100 text-emerald-700"
      : percentage >= 75
      ? "bg-orange-100 text-orange-700"
      : "bg-red-100 text-red-700";

  return (

    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl p-7"
    >

      {/* Header */}

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">

            <BookOpen
              className="text-indigo-600"
              size={28}
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              {record.subjectId?.name}

            </h2>

            <p className="text-slate-500 text-sm">

              Attendance Record

            </p>

          </div>

        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${badgeColor}`}
        >

          {percentage}%

        </span>

      </div>

      {/* Progress */}

      <div className="mt-7">

        <div className="flex justify-between text-sm mb-2">

          <span className="font-medium text-slate-600">

            Attendance Progress

          </span>

          <span className="font-semibold">

            {percentage}%

          </span>

        </div>

        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">

          <motion.div

            initial={{
              width: 0,
            }}

            animate={{
              width: `${percentage}%`,
            }}

            transition={{
              duration: 0.8,
            }}

            className={`h-full rounded-full ${progressColor}`}

          />

        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4 mt-8">

        <div className="bg-slate-50 rounded-2xl p-4">

          <p className="text-sm text-slate-500">

            Classes Attended

          </p>

          <p className="text-2xl font-bold mt-1">

            {record.attended}

          </p>

        </div>

        <div className="bg-slate-50 rounded-2xl p-4">

          <p className="text-sm text-slate-500">

            Total Classes

          </p>

          <p className="text-2xl font-bold mt-1">

            {record.total}

          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-4 mt-8">

        <button
          onClick={() => onEdit(record)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white py-3 hover:bg-indigo-700 transition"
        >

          <Pencil size={18} />

          Edit

        </button>

        <button
          onClick={() => onDelete(record._id)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 text-white py-3 hover:bg-red-600 transition"
        >

          <Trash2 size={18} />

          Delete

        </button>

      </div>

      {percentage >= 85 && (

        <div className="mt-6 flex items-center gap-2 text-emerald-600 font-medium">

          <CheckCircle size={18} />

          Excellent Attendance

        </div>

      )}

    </motion.div>

  );

}

export default AttendanceCard;