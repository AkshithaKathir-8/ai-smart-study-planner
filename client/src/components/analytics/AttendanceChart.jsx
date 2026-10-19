import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  ClipboardCheck,
} from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

function AttendanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analytics = await getAnalytics();

        let attended = 0;
        let total = 0;

        analytics.attendanceChart.forEach((item) => {
          attended += Number(item.attended) || 0;
          total += Number(item.total) || 0;
        });

        const missed = Math.max(
          total - attended,
          0
        );

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
        console.log(
          "Attendance chart error:",
          err
        );
      }
    };

    loadAnalytics();
  }, []);

  const COLORS = ["#10b981", "#f87171"];

  const totalClasses = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const attended =
    data.find(
      (item) => item.name === "Attended"
    )?.value || 0;

  const percentage =
    totalClasses === 0
      ? 0
      : Math.round(
          (attended / totalClasses) * 100
        );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <ClipboardCheck
              size={19}
              className="text-emerald-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Attendance Overview
            </h2>

            <p className="text-sm text-slate-400 mt-0.5">
              Overall attended vs missed classes
            </p>
          </div>
        </div>

        {totalClasses > 0 && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            {percentage}%
          </span>
        )}
      </div>

      {data.length === 0 ||
      data.every(
        (item) => item.value === 0
      ) ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
            <ClipboardCheck
              size={25}
              className="text-slate-300"
            />
          </div>

          <p className="mt-4 font-semibold text-slate-600">
            No attendance data
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Add attendance records to see your overview.
          </p>
        </div>
      ) : (
        <div className="h-[300px] mt-4">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="48%"
                outerRadius={92}
                innerRadius={58}
                paddingAngle={3}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.10)",
                }}
              />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default AttendanceChart;