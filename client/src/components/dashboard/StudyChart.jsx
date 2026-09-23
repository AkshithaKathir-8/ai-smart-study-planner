import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getAnalytics } from "../../services/analyticsService";

function StudyChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        const analytics = await getAnalytics();

        setData(analytics.subjectProgress || []);

      }

      catch (err) {

        console.log(err);

      }

    };

    loadAnalytics();

  }, []);

  return (

    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 h-[340px]">

      <h2 className="text-xl font-bold text-slate-800">

        Subject Progress

      </h2>

      <p className="text-slate-500 mb-6">

        Progress based on your attendance and study activity

      </p>

      {

        data.length === 0 ?

        (

          <div className="flex items-center justify-center h-[220px] text-slate-400 text-lg">

            No progress available

          </div>

        )

        :

        (

          <ResponsiveContainer width="100%" height="80%">

            <AreaChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="subject" />

              <Tooltip />

              <Area

                type="monotone"

                dataKey="progress"

                stroke="#4f46e5"

                fill="#818cf8"

                fillOpacity={0.5}

              />

            </AreaChart>

          </ResponsiveContainer>

        )

      }

    </div>

  );

}

export default StudyChart;