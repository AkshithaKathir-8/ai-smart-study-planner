import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  GraduationCap,
} from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

function SubjectProgressChart() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const analytics = await getAnalytics();

        setSubjects(
          Array.isArray(
            analytics.subjectProgress
          )
            ? analytics.subjectProgress
            : []
        );
      } catch (err) {
        console.log(
          "Subject progress error:",
          err.response?.data || err.message
        );

        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <GraduationCap
              size={20}
              className="text-violet-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Subject Progress
            </h2>

            <p className="text-sm text-slate-400 mt-0.5">
              Planner completion across your subjects
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold">
          By Subject
        </span>
      </div>

      {loading ? (
        <div className="h-[350px] mt-6 rounded-2xl bg-slate-50 animate-pulse" />
      ) : subjects.length === 0 ? (
        <div className="h-[350px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
            <GraduationCap
              size={26}
              className="text-slate-300"
            />
          </div>

          <p className="mt-4 font-semibold text-slate-600">
            No subject progress yet
          </p>

          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            Complete planner sessions to build your subject progress.
          </p>
        </div>
      ) : (
        <div className="h-[350px] mt-6">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={subjects}
              margin={{
                top: 10,
                right: 15,
                left: -15,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />

              <XAxis
                dataKey="subject"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
              />

              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#94a3b8",
                }}
                tickFormatter={(value) =>
                  `${value}%`
                }
              />

              <Tooltip
                cursor={{
                  fill: "#eef2ff",
                }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.10)",
                }}
                formatter={(value) => [
                  `${value}%`,
                  "Progress",
                ]}
              />

              <Bar
                dataKey="progress"
                fill="#6366f1"
                radius={[10, 10, 0, 0]}
                barSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SubjectProgressChart;