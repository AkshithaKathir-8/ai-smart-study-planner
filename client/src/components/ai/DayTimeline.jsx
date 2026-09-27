import { useState } from "react";
import {
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { markPlanSessionCompleted } from "../../services/aiService";

function DayTimeline({
  day,
  sessions,
  planId,
  onSessionCompleted,
}) {
  const [completingSession, setCompletingSession] =
    useState(null);

  const daySessions = sessions.filter(
    (session) => session.day === day
  );

  const handleComplete = async (sessionId) => {
    try {
      setCompletingSession(sessionId);

      const response =
        await markPlanSessionCompleted(
          planId,
          sessionId
        );

      if (onSessionCompleted) {
        onSessionCompleted(response.plan);
      }
    } catch (error) {
      console.log(
        "SESSION COMPLETION ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to complete study session."
      );
    } finally {
      setCompletingSession(null);
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-lg
        border
        border-slate-200
        p-6
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          mb-6
        "
      >
        <div
          className="
            bg-indigo-100
            p-3
            rounded-xl
          "
        >
          <Sparkles
            className="text-indigo-600"
          />
        </div>

        <h2
          className="
            text-2xl
            font-bold
            text-slate-800
          "
        >
          Day {day}
        </h2>
      </div>

      <div className="space-y-4">
        {daySessions.map((session) => {
          const isCompleted =
            session.completed === true;

          const isCompleting =
            completingSession === session._id;

          return (
            <div
              key={session._id}
              className={`
                rounded-2xl
                p-5
                border
                transition
                ${
                  isCompleted
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100"
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">

                <div className="flex-1">

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-slate-800
                    "
                  >
                    {session.subject}
                  </h3>

                  <p
                    className="
                      text-slate-600
                      mt-2
                    "
                  >
                    {session.topic}
                  </p>

                </div>

                <div>
                  {isCompleted ? (
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        bg-emerald-100
                        text-emerald-700
                        px-3
                        py-2
                        rounded-xl
                        font-semibold
                        text-sm
                      "
                    >
                      <CheckCircle2 size={18} />
                      Completed
                    </div>
                  ) : (
                    <Circle
                      size={22}
                      className="text-indigo-300"
                    />
                  )}
                </div>

              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                  mt-4
                  text-sm
                "
              >
                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-indigo-600
                  "
                >
                  <Clock size={16} />

                  {session.duration}
                </span>

                <span
                  className="
                    bg-purple-100
                    px-3
                    py-1
                    rounded-full
                    text-purple-700
                    font-medium
                  "
                >
                  {session.priority}
                </span>
              </div>

              <p
                className="
                  mt-4
                  text-slate-500
                  italic
                "
              >
                💡 {session.tips}
              </p>

              {!isCompleted && (
                <button
                  type="button"
                  onClick={() =>
                    handleComplete(session._id)
                  }
                  disabled={isCompleting}
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    bg-indigo-600
                    text-white
                    px-5
                    py-2.5
                    rounded-xl
                    font-semibold
                    hover:bg-indigo-700
                    transition
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  <CheckCircle2 size={18} />

                  {isCompleting
                    ? "Completing..."
                    : "Complete Session"}
                </button>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DayTimeline;