import { usePlanner } from "../../context/PlannerContext";
import { useCalendar } from "../../context/CalendarContext";
import { Clock, CalendarDays, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

function UpcomingTasks() {
  const { sessions = [] } = usePlanner();
  const { events = [] } =useCalendar();

  const plannerTasks = sessions.map((session) => ({
    id: session._id,
    title: session.subject || "Study Session",
    date: session.date,
    type: "Study Session",
  }));

  const calendarTasks = events.map((event) => ({
    id: event._id,
    title: event.title || "Event",
    date: event.date,
    type: "Calendar Event",
  }));

  const tasks = [...plannerTasks, ...calendarTasks]
    .filter((item) => item.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6"
    >
      <h2 className="text-xl font-bold text-slate-800">
        Upcoming Tasks
      </h2>

      <p className="text-slate-500 mt-1">
        Your next scheduled activities
      </p>

      <div className="mt-6 space-y-4">

        {tasks.length === 0 ? (

          <div className="py-10 text-center text-slate-500">
            <CalendarDays
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="font-medium">
              No upcoming tasks
            </p>

            <p className="text-sm mt-1">
              Add a planner session or calendar event.
            </p>

          </div>

        ) : (

          tasks.map((task) => (

            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">

                <div
                  className={`p-3 rounded-xl ${
                    task.type === "Study Session"
                      ? "bg-indigo-100"
                      : "bg-emerald-100"
                  }`}
                >
                  {task.type === "Study Session" ? (
                    <BookOpen
                      size={20}
                      className="text-indigo-600"
                    />
                  ) : (
                    <CalendarDays
                      size={20}
                      className="text-emerald-600"
                    />
                  )}
                </div>

                <div>

                  <h3 className="font-semibold text-slate-800">
                    {task.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {task.type}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">

                <Clock size={16} />

                {new Date(task.date).toLocaleDateString()}

              </div>

            </div>

          ))

        )}

      </div>
    </motion.div>
  );
}

export default UpcomingTasks;