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

          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

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

            const sessionDate = new Date(session.studyDate);

            const sessionDateKey = `${sessionDate.getFullYear()}-${String(
              sessionDate.getMonth() + 1
            ).padStart(2, "0")}-${String(
              sessionDate.getDate()
            ).padStart(2, "0")}`;

            if (sessionDateKey !== dateKey) {
              return;
            }

            const [startHour, startMinute] =
              session.startTime.split(":").map(Number);

            const [endHour, endMinute] =
              session.endTime.split(":").map(Number);

            let startMinutes =
              startHour * 60 + startMinute;

            let endMinutes =
              endHour * 60 + endMinute;

            // Handles sessions crossing midnight
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
      <div className="bg-white rounded-3xl border p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">
          Weekly Study Trend
        </h2>

        <div className="h-[300px] flex items-center justify-center text-slate-500">
          Loading weekly study data...
        </div>
      </div>
    );
  }

  const hasStudyData = data.some(
    (item) => item.hours > 0
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Weekly Study Trend
      </h2>

      {!hasStudyData ? (
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          No completed study sessions this week
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [
                `${value} hours`,
                "Study Time",
              ]}
            />

            <Line
              type="monotone"
              dataKey="hours"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default WeeklyChart;