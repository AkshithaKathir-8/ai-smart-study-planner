import {
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const colors = {
  orange: {
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    icon: "text-orange-600",
    badge: "bg-orange-50 text-orange-700 border-orange-100",
    accent: "bg-orange-500",
  },

  blue: {
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    accent: "bg-blue-500",
  },

  emerald: {
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    icon: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    accent: "bg-emerald-500",
  },

  purple: {
    gradient: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    icon: "text-purple-600",
    badge: "bg-purple-50 text-purple-700 border-purple-100",
    accent: "bg-purple-500",
  },
};

function SubjectCard({
  id,
  subject,
  code,
  credits,
  color,
}) {
  const navigate = useNavigate();

  const theme =
    colors[color] || colors.blue;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden"
    >
      {/* Color accent */}
      <div
        className={`h-1.5 bg-gradient-to-r ${theme.gradient}`}
      />

      <div className="p-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center`}
          >
            <BookOpen
              size={27}
              className={theme.icon}
            />
          </div>

          <span
            className={`px-3 py-1.5 rounded-full border text-xs font-bold ${theme.badge}`}
          >
            {code || "No Code"}
          </span>
        </div>

        {/* Subject */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-slate-800 truncate">
            {subject}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            {code
              ? `Course code: ${code}`
              : "Course code not added"}
          </p>
        </div>

        {/* Credits */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl ${theme.bg} p-4`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap
                size={17}
                className={theme.icon}
              />

              <span className="text-xs font-medium text-slate-500">
                Credits
              </span>
            </div>

            <p className="text-xl font-bold text-slate-800 mt-2">
              {credits || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Course
            </p>

            <p className="text-sm font-bold text-slate-700 mt-2">
              Academic
            </p>
          </div>
        </div>

        {/* View details */}
        <button
          onClick={() =>
            navigate(`/subjects/${id}`)
          }
          className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 text-white hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200 font-semibold text-sm"
        >
          View Subject Details
          <ArrowRight
            size={17}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
}

export default SubjectCard;