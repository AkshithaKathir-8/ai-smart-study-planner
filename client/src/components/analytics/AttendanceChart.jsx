import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getAnalytics } from "../../services/analyticsService";

function AttendanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analytics = await getAnalytics();

        console.log("Analytics:", analytics);

        let attended = 0;
        let total = 0;

        analytics.attendanceChart.forEach((item) => {
          attended += Number(item.attended) || 0;
          total += Number(item.total) || 0;
        });

        const missed = Math.max(total - attended, 0);

        setData([
          {
            name: "Attended",
            value: attended,
          },
          {
            name: "Missed",
            value: missed,
          },
        ]);
      } catch (err) {
        console.log("Attendance chart error:", err);
      }
    };

    loadAnalytics();
  }, []);

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">
        Attendance Overview
      </h2>

      {data.length === 0 || data.every((item) => item.value === 0) ? (
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          No attendance data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default AttendanceChart;