import {
  BookOpen,
  CalendarDays,
  NotebookPen,
  GraduationCap,
} from "lucide-react";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";
import { useCalendar } from "../../context/CalendarContext";
import { useNotes } from "../../context/NotesContext";
import { useAttendance } from "../../context/AttendanceContext";

import StatCard from "./StatCard";

function TodaysBriefing() {

  const { subjects } = useSubjects();

  const { sessions } = usePlanner();

  const { events } = useCalendar();

  const { notes } = useNotes();

  const { records } = useAttendance();

const averageAttendance =
  records.length > 0
    ? Math.round(
        records.reduce(
          (sum, item) =>
            sum + (item.attended / item.total) * 100,
          0
        ) / records.length
      )
    : 0;
    
  return (

    <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 rounded-3xl text-white p-8 shadow-xl">

      <h2 className="text-3xl font-bold">

        🌅 Today's Briefing

      </h2>

      <p className="mt-2 opacity-90">

        Here's your academic snapshot.

      </p>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

        <StatCard
          title="Subjects"
          value={subjects.length}
          icon={<BookOpen size={26} />}
          color="bg-indigo-100 text-indigo-600"
        />

        <StatCard
          title="Planner"
          value={sessions.length}
          icon={<CalendarDays size={26} />}
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          title="Notes"
          value={notes.length}
          icon={<NotebookPen size={26} />}
          color="bg-purple-100 text-purple-600"
        />

        <StatCard
          title="Attendance"
          value={`${averageAttendance}%`}
          icon={<GraduationCap size={26} />}
          color="bg-emerald-100 text-emerald-600"
        />

      </div>

      <div className="mt-8 bg-white/10 rounded-2xl p-6">

        <h3 className="text-xl font-semibold">

          💡 AI Recommendation

        </h3>

        <p className="mt-3 leading-8">

          {averageAttendance < 75
            ? "Your attendance needs improvement. Prioritize attending upcoming classes."
            : sessions.filter(
                (s) => s.status === "Pending"
              ).length > 3
            ? "You have multiple pending study sessions. Completing two today will keep you on track."
            : "Great job! You're maintaining your academic progress. Continue your current routine."}

        </p>

      </div>

    </div>

  );

}

export default TodaysBriefing;