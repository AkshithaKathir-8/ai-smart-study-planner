import {
  Calendar,
  Clock,
  Brain,
  Flag,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

function SessionCard({
  session,
  onDelete,
  onEdit,
  onToggleStatus,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            {session.topic}
          </h2>

          <p className="text-slate-500 mt-1">
            {session.subjectId?.name}
          </p>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            session.status === "Completed"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {session.status}
        </span>

      </div>

      {/* Details */}

      <div className="mt-5 space-y-3 text-sm">

        <div className="flex gap-2 items-center">

          <Calendar size={18} />

          {new Date(session.studyDate).toDateString()}

        </div>

        <div className="flex gap-2 items-center">

          <Clock size={18} />

          {session.startTime} - {session.endTime}

        </div>

        <div className="flex gap-2 items-center">

          <Brain size={18} />

          Difficulty : {session.difficulty}

        </div>

        <div className="flex gap-2 items-center">

          <Flag size={18} />

          Priority : {session.priority}

        </div>

      </div>

      {/* AI */}

      <div className="mt-5 bg-indigo-50 rounded-2xl p-4">

        <p className="text-sm text-indigo-700">

          🤖 {session.aiRecommendation}

        </p>

      </div>

      {/* Buttons */}

      <div className="grid grid-cols-3 gap-3 mt-6">

        <button
          onClick={() => onEdit(session)}
          className="rounded-xl py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onToggleStatus(session)}
          className={`rounded-xl py-2 flex items-center justify-center gap-2 transition ${
            session.status === "Completed"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >

          {session.status === "Completed"
            ? <RotateCcw size={18}/>
            : <CheckCircle size={18}/>}

          {session.status === "Completed"
            ? "Undo"
            : "Complete"}

        </button>

        <button
          onClick={() => onDelete(session._id)}
          className="rounded-xl py-2 bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default SessionCard;