function CalendarDay({
  day,
  date,
  events,
  selectedDate,
  setSelectedDate,
}) {

  const selected = selectedDate === date;

  return (

    <button
      onClick={() => setSelectedDate(date)}
      className={`min-h-24 rounded-2xl border p-3 text-left transition cursor-pointer ${
        selected
          ? "border-indigo-600 bg-indigo-50"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >

      <div className="font-semibold text-slate-700">
        {day}
      </div>

      <div className="mt-2 space-y-1">

        {events.slice(0, 2).map((event) => (

          <div
            key={event.id}
            className={`text-xs px-2 py-1 rounded-full text-white truncate ${
              event.color === "orange"
                ? "bg-orange-500"
                : event.color === "blue"
                ? "bg-blue-500"
                : event.color === "emerald"
                ? "bg-emerald-500"
                : "bg-purple-500"
            }`}
          >
            {event.title}
          </div>

        ))}

        {events.length > 2 && (
          <div className="text-xs text-slate-500">
            +{events.length - 2} more
          </div>
        )}

      </div>

    </button>

  );

}

export default CalendarDay;