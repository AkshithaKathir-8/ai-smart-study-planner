import { useEffect, useState } from "react";

import {
  BookOpen,
  CalendarDays,
  FileText,
  ListChecks,
  TrendingUp,
} from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

function AnalyticsStats() {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalNotes: 0,
    totalEvents: 0,
    totalPlanner: 0,
    averageAttendance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setStats(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm animate-pulse h-40"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-100" />
            <div className="h-3 w-20 bg-slate-100 rounded mt-5" />
            <div className="h-8 w-14 bg-slate-100 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Subjects",
      value: stats.totalSubjects,
      subtitle: "Subjects tracked",
      icon: BookOpen,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Planner Tasks",
      value: stats.totalPlanner,
      subtitle: "Study sessions",
      icon: ListChecks,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Notes",
      value: stats.totalNotes,
      subtitle: "Study materials",
      icon: FileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Events",
      value: stats.totalEvents,
      subtitle: "Calendar events",
      icon: CalendarDays,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Attendance",
      value: `${stats.averageAttendance}%`,
      subtitle:
        stats.averageAttendance >= 85
          ? "Excellent"
          : stats.averageAttendance >= 75
          ? "On Track"
          : "Needs Attention",
      icon: TrendingUp,
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center`}
              >
                <Icon
                  size={21}
                  className={card.iconColor}
                />
              </div>

              <span className="text-[11px] font-medium text-slate-300">
                Kortex
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <p
              className={`text-3xl font-bold mt-1 ${
                card.valueColor || "text-slate-800"
              }`}
            >
              {card.value}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default AnalyticsStats;