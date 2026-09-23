import { useEffect, useState } from "react";
import { BookOpen, TrendingUp, Users } from "lucide-react";
import { getAnalytics } from "../../services/analyticsService";

function SubjectStats() {

  const [stats, setStats] = useState({
    totalSubjects: 0,
    averageProgress: 0,
    averageAttendance: 0,
  });

  useEffect(() => {

    const loadStats = async () => {

      try {

        const analytics = await getAnalytics();

        setStats({
          totalSubjects: analytics.totalSubjects || 0,
          averageProgress: analytics.averageProgress || 0,
          averageAttendance: analytics.averageAttendance || 0,
        });

      } catch (err) {

        console.log(err);

      }

    };

    loadStats();

  }, []);

  const cards = [

    {
      title: "Subjects",
      value: stats.totalSubjects,
      icon: BookOpen,
      color: "bg-indigo-100 text-indigo-600",
    },

    {
      title: "Average Progress",
      value: `${stats.averageProgress}%`,
      icon: TrendingUp,
      color: "bg-emerald-100 text-emerald-600",
    },

    {
      title: "Attendance",
      value: `${stats.averageAttendance}%`,
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },

  ];

  return (

    <div className="grid md:grid-cols-3 gap-6">

      {cards.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
          >

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>

              <Icon size={28} />

            </div>

            <h2 className="text-3xl font-bold mt-6">

              {item.value}

            </h2>

            <p className="text-slate-500 mt-2">

              {item.title}

            </p>

          </div>

        );

      })}

    </div>

  );

}

export default SubjectStats;