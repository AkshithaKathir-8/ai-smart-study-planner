function CalendarStats({ events }) {

  const today = new Date().toISOString().split("T")[0];

  const totalEvents = events.length;

  const todayEvents = events.filter(
    (event) => event.date === today
  ).length;

  const upcomingEvents = events.filter(
    (event) => event.date >= today
  ).length;

  const studyEvents = events.filter(
    (event) => event.type === "Study"
  ).length;

  return (

    <div className="grid md:grid-cols-4 gap-6">

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

        <p className="text-slate-500">
          Total Events
        </p>

        <h2 className="text-3xl font-bold mt-3">
          {totalEvents}
        </h2>

      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

        <p className="text-slate-500">
          Today's Events
        </p>

        <h2 className="text-3xl font-bold mt-3">
          {todayEvents}
        </h2>

      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

        <p className="text-slate-500">
          Upcoming
        </p>

        <h2 className="text-3xl font-bold mt-3">
          {upcomingEvents}
        </h2>

      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

        <p className="text-slate-500">
          Study Events
        </p>

        <h2 className="text-3xl font-bold mt-3">
          {studyEvents}
        </h2>

      </div>

    </div>

  );

}

export default CalendarStats;