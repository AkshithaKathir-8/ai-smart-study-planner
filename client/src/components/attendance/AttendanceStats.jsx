import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

function AttendanceStats({ records }) {
  const totalClasses = records.reduce(
    (acc, r) => acc + Number(r.total || 0),
    0
  );

  const totalAttended = records.reduce(
    (acc, r) => acc + Number(r.attended || 0),
    0
  );

  const overall =
    totalClasses === 0
      ? 0
      : Math.round(
          (totalAttended / totalClasses) * 100
        );

  const getStatus = () => {
    if (overall >= 85) {
      return {
        label: "Excellent",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    }

    if (overall >= 75) {
      return {
        label: "On Track",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    }

    return {
      label: "Needs Attention",
      color: "text-red-600",
      bg: "bg-red-50",
    };
  };

  const status = getStatus();

  const stats = [
    {
      title: "Total Classes",
      value: totalClasses,
      subtitle: "Classes recorded",
      icon: BookOpen,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Classes Attended",
      value: totalAttended,
      subtitle: "Successfully attended",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Overall Attendance",
      value: `${overall}%`,
      subtitle: status.label,
      icon: TrendingUp,
      iconBg: status.bg,
      iconColor: status.color,
      valueColor: status.color,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center`}
              >
                <Icon
                  size={23}
                  className={stat.iconColor}
                />
              </div>

              <span className="text-xs font-medium text-slate-400">
                Kortex
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {stat.title}
            </p>

            <div className="flex items-end justify-between gap-3 mt-1">
              <p
                className={`text-3xl font-bold ${
                  stat.valueColor || "text-slate-800"
                }`}
              >
                {stat.value}
              </p>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              {stat.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default AttendanceStats;