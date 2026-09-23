import { useEffect, useState } from "react";
import { Activity, BookOpen, CalendarDays, NotebookPen } from "lucide-react";

import api from "../../services/api";

function RecentActivity() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {

    loadActivity();

  }, []);

  const loadActivity = async () => {

    try {

      const [
        subjectsRes,
        plannerRes,
        eventsRes,
        notesRes,
      ] = await Promise.all([
        api.get("/subjects"),
        api.get("/planner"),
        api.get("/calendar"),
        api.get("/notes"),
      ]);

      const activities = [];

      subjectsRes.data.forEach(subject => {

        activities.push({
          id: subject._id,
          icon: BookOpen,
          title: `Added subject "${subject.name}"`,
          date: subject.createdAt,
          color: "text-indigo-600",
        });

      });

      plannerRes.data.forEach(session => {

        activities.push({
          id: session._id,
          icon: Activity,
          title: `Created planner for "${session.topic}"`,
          date: session.createdAt,
          color: "text-emerald-600",
        });

      });

      eventsRes.data.forEach(event => {

        activities.push({
          id: event._id,
          icon: CalendarDays,
          title: `Added event "${event.title}"`,
          date: event.createdAt,
          color: "text-orange-600",
        });

      });

      notesRes.data.forEach(note => {

        activities.push({
          id: note._id,
          icon: NotebookPen,
          title: `Created note "${note.title}"`,
          date: note.createdAt,
          color: "text-purple-600",
        });

      });

      activities.sort(

        (a, b) =>

          new Date(b.date) -
          new Date(a.date)

      );

      setActivities(
        activities.slice(0,8)
      );

    }

    catch(err){

      console.log(err);

    }

  };

  return (

    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">

      <h2 className="text-xl font-bold">
        Recent Activity
      </h2>

      <p className="text-slate-500 mb-6">
        Latest actions across your workspace
      </p>

      {

        activities.length===0 ?

        (

          <div className="text-center py-12 text-slate-500">

            No activity yet

          </div>

        )

        :

        (

          <div className="space-y-5">

            {

              activities.map(item=>{

                const Icon=item.icon;

                return(

                  <div
                    key={item.id}
                    className="flex items-center gap-4"
                  >

                    <div className={`p-3 rounded-2xl bg-slate-100 ${item.color}`}>

                      <Icon size={22}/>

                    </div>

                    <div className="flex-1">

                      <h3 className="font-semibold">

                        {item.title}

                      </h3>

                      <p className="text-sm text-slate-500">

                        {new Date(item.date).toLocaleString()}

                      </p>

                    </div>

                  </div>

                );

              })

            }

          </div>

        )

      }

    </div>

  );

}

export default RecentActivity;