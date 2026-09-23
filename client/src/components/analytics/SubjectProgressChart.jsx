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

import { getAnalytics } from "../../services/analyticsService";

function SubjectProgressChart() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const analytics = await getAnalytics();

        console.log("Analytics:", analytics);

        setSubjects(
          Array.isArray(analytics.subjectProgress)
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">
        Subject Progress
      </h2>

      {loading ? (
        <div className="h-[350px] flex items-center justify-center text-slate-500">
          Loading subject progress...
        </div>
      ) : subjects.length === 0 ? (
        <div className="h-[350px] flex items-center justify-center text-slate-500">
          No subject progress data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={subjects}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="subject"
              tick={{ fontSize: 13 }}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 13 }}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              formatter={(value) => [
                `${value}%`,
                "Progress",
              ]}
            />

            <Bar
              dataKey="progress"
              fill="#6366f1"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SubjectProgressChart;