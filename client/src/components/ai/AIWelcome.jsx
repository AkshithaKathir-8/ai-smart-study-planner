import {
  Sparkles,
  BookOpen,
  CalendarDays,
  NotebookPen,
  GraduationCap,
  BarChart3,
} from "lucide-react";

function AIWelcome() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      <div className="flex items-center gap-4">

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white">

          <Sparkles size={30} />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Hello Akshitha 👋
          </h2>

          <p className="text-slate-500 mt-1">
            I'm <span className="font-semibold text-indigo-600">Kortex AI</span>,
            your intelligent academic assistant.
          </p>

        </div>

      </div>

      <div className="mt-8">

        <p className="font-semibold text-slate-700 mb-5">
          I already understand your workspace
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
            <BookOpen className="text-indigo-600" size={22} />
            <span>Subjects</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
            <CalendarDays className="text-blue-600" size={22} />
            <span>Calendar</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
            <NotebookPen className="text-purple-600" size={22} />
            <span>Notes</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
            <GraduationCap className="text-emerald-600" size={22} />
            <span>Attendance</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
            <BarChart3 className="text-orange-600" size={22} />
            <span>Analytics</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
            <Sparkles className="text-pink-600" size={22} />
            <span>AI Assistance</span>
          </div>

        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-indigo-50 border border-indigo-100 p-5">

        <p className="text-slate-700 leading-8">

          Ask me to create study plans, summarize notes,
          generate quizzes, improve productivity,
          analyze your progress, or prepare for exams.

        </p>

      </div>

    </div>
  );
}

export default AIWelcome;