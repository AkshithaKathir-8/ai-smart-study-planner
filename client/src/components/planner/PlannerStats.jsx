import { CalendarDays, Clock3, CheckCircle } from "lucide-react";
import { usePlanner } from "../../context/PlannerContext";

function PlannerStats() {
  const { sessions } = usePlanner();

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Sessions scheduled for today
  const todaySessions = sessions.filter(
    (session) => session.date === today
  ).length;

  // Completed sessions
  const completedSessions = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  // Total planned hours
  const totalHours = sessions.reduce((total, session) => {
    const hours = parseFloat(session.duration) || 0;
    return total + hours;
  }, 0);

  const stats = [
    {
      title: "Today's Sessions",
      value: todaySessions,
      icon: CalendarDays,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Hours Planned",
      value: `${totalHours}h`,
      icon: Clock3,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Completed",
      value: completedSessions,
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
            >
              <Icon size={28} />
            </div>

            <h2 className="text-3xl font-bold mt-5">
              {item.value}
            </h2>

            <p className="text-slate-500 mt-1">
              {item.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default PlannerStats;