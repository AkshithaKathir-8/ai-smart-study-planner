import { useEffect, useState } from "react";

import {
  BookOpen,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

function SubjectStats() {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    averageProgress: 0,
    averageAttendance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const analytics = await getAnalytics();

        setStats({
          totalSubjects:
            analytics.totalSubjects || 0,
          averageProgress:
            analytics.averageProgress || 0,
          averageAttendance:
            analytics.averageAttendance || 0,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-5">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-pulse h-40"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-100" />
            <div className="w-16 h-8 bg-slate-100 rounded mt-5" />
            <div className="w-24 h-3 bg-slate-100 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      subtitle: "Courses you're tracking",
      icon: BookOpen,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Average Progress",
      value: `${stats.averageProgress}%`,
      subtitle: "Planner completion",
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      title: "Average Attendance",
      value: `${stats.averageAttendance}%`,
      subtitle:
        stats.averageAttendance >= 85
          ? "Excellent"
          : stats.averageAttendance >= 75
          ? "On Track"
          : "Needs Attention",
      icon: ClipboardCheck,
      iconBg:
        stats.averageAttendance >= 85
          ? "bg-emerald-50"
          : stats.averageAttendance >= 75
          ? "bg-orange-50"
          : "bg-red-50",
      iconColor:
        stats.averageAttendance >= 85
          ? "text-emerald-600"
          : stats.averageAttendance >= 75
          ? "text-orange-600"
          : "text-red-600",
      valueColor:
        stats.averageAttendance >= 85
          ? "text-emerald-600"
          : stats.averageAttendance >= 75
          ? "text-orange-600"
          : "text-red-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center`}
              >
                <Icon
                  size={22}
                  className={item.iconColor}
                />
              </div>

              <span className="text-[11px] font-medium text-slate-300">
                Kortex
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {item.title}
            </p>

            <p
              className={`text-3xl font-bold mt-1 ${
                item.valueColor || "text-slate-800"
              }`}
            >
              {item.value}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default SubjectStats;