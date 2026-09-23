import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/analyticsService";

function AnalyticsStats() {

  const [stats, setStats] = useState({

    totalSubjects: 0,
    totalNotes: 0,
    totalEvents: 0,
    totalPlanner: 0,
    averageAttendance: 0,

  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const data = await getAnalytics();

        setStats(data);

      }

      catch (err) {

        console.log(err);

      }

      finally {

        setLoading(false);

      }

    };

    fetchAnalytics();

  }, []);

  if (loading) {

    return (

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

        {[1,2,3,4,5].map((item)=>(

          <div
            key={item}
            className="bg-white rounded-3xl border p-6 shadow-sm animate-pulse h-32"
          />

        ))}

      </div>

    );

  }

  return (

    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

      <div className="bg-white rounded-3xl border p-6 shadow-sm">

        <p className="text-slate-500">
          Subjects
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats.totalSubjects}
        </h2>

      </div>

      <div className="bg-white rounded-3xl border p-6 shadow-sm">

        <p className="text-slate-500">
          Planner Tasks
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats.totalPlanner}
        </h2>

      </div>

      <div className="bg-white rounded-3xl border p-6 shadow-sm">

        <p className="text-slate-500">
          Notes
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats.totalNotes}
        </h2>

      </div>

      <div className="bg-white rounded-3xl border p-6 shadow-sm">

        <p className="text-slate-500">
          Events
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats.totalEvents}
        </h2>

      </div>

      <div className="bg-white rounded-3xl border p-6 shadow-sm">

        <p className="text-slate-500">
          Attendance
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {stats.averageAttendance}%
        </h2>

      </div>

    </div>

  );

}

export default AnalyticsStats;