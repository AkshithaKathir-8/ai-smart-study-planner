import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Clock3 } from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

function WeeklyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeeklyData = async () => {
      try {
        const analytics = await getAnalytics();

        const sessions = analytics.recentPlanner || [];

        const today = new Date();
        const weekData = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);

          date.setHours(0, 0, 0, 0);
          date.setDate(today.getDate() - i);

          const dateKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(
            date.getDate()
          ).padStart(2, "0")}`;

          const dayName = date.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          );

          let totalHours = 0;

          sessions.forEach((session) => {
            if (
              session.status !== "Completed" ||
              !session.studyDate ||
              !session.startTime ||
              !session.endTime
            ) {
              return;
            }

            const sessionDate = new Date(
              session.studyDate
            );

            const sessionDateKey = `${sessionDate.getFullYear()}-${String(
              sessionDate.getMonth() + 1
            ).padStart(2, "0")}-${String(
              sessionDate.getDate()
            ).padStart(2, "0")}`;

            if (sessionDateKey !== dateKey) {
              return;
            }

            const [startHour, startMinute] =
              session.startTime
                .split(":")
                .map(Number);

            const [endHour, endMinute] =
              session.endTime
                .split(":")
                .map(Number);

            let startMinutes =
              startHour * 60 + startMinute;

            let endMinutes =
              endHour * 60 + endMinute;

            if (endMinutes < startMinutes) {
              endMinutes += 24 * 60;
            }

            const duration =
              (endMinutes - startMinutes) / 60;

            totalHours += duration;
          });

          weekData.push({
            day: dayName,
            hours: Number(totalHours.toFixed(2)),
          });
        }

        setData(weekData);
      } catch (error) {
        console.log(
          "Weekly analytics error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadWeeklyData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Clock3
              size={19}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              Weekly Study Trend
            </h2>

            <p className="text-xs text-slate-400">
              Loading study activity...
            </p>
          </div>
        </div>

        <div className="h-[300px] animate-pulse bg-slate-50 rounded-2xl mt-6" />
      </div>
    );
  }

  const hasStudyData = data.some(
    (item) => item.hours > 0
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Clock3
              size={19}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Weekly Study Trend
            </h2>

            <p className="text-sm text-slate-400 mt-0.5">
              Completed study hours over the last 7 days
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
          7 Days
        </span>
      </div>

      {!hasStudyData ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
            <Clock3
              size={25}
              className="text-slate-300"
            />
          </div>

          <p className="mt-4 font-semibold text-slate-600">
            No completed study sessions
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Your weekly study trend will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#94a3b8",
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#94a3b8",
                }}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.10)",
                }}
                formatter={(value) => [
                  `${value} hours`,
                  "Study Time",
                ]}
              />

              <Line
                type="monotone"
                dataKey="hours"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#6366f1",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default WeeklyChart;