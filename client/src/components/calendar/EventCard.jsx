import { Pencil, Trash2 } from "lucide-react";

function EventCard({
  selectedDate,
  events,
  onEdit,
  onDelete,
}) {

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

        <h2 className="text-xl font-bold">
          Events
        </h2>

        <div className="flex flex-col justify-center items-center h-72">

          <div className="text-6xl">📅</div>

          <h3 className="text-xl font-bold mt-4">
            Select a Date
          </h3>

          <p className="text-slate-500 mt-2 text-center">
            Click a date to view all events.
          </p>

        </div>

      </div>
    );
  }

const dayEvents = events.filter((event) => {
  const eventDate = new Date(event.date)
    .toISOString()
    .split("T")[0];

  return eventDate === selectedDate;
});

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      <h2 className="text-xl font-bold">
        Events
      </h2>

      <p className="text-slate-500 mt-2">
        {selectedDate}
      </p>

      <div className="space-y-5 mt-6">

        {dayEvents.length === 0 ? (

          <div className="text-center py-12">

            <div className="text-5xl">
              🎉
            </div>

            <h3 className="font-bold text-lg mt-4">
              No Events
            </h3>

          </div>

        ) : (

          dayEvents.map((event) => (

            <div
              key={event._id || event.id}
              className="border rounded-2xl p-5"
            >

              <div className="flex justify-between">

                <div>

                  <h3 className="font-bold text-lg">
                    {event.title}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    {event.time}
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => onEdit(event)}
                    className="p-2 rounded-xl hover:bg-slate-100"
                  >
                    <Pencil size={18}/>
                  </button>

                  <button
                    onClick={() => onDelete(event._id || event.id)}
                    className="p-2 rounded-xl hover:bg-red-100 text-red-500"
                  >
                    <Trash2 size={18}/>
                  </button>

                </div>

              </div>

              <span
                className={`inline-block mt-4 px-3 py-1 rounded-full text-white text-sm ${
                  event.color === "orange"
                    ? "bg-orange-500"
                    : event.color === "blue"
                    ? "bg-blue-500"
                    : event.color === "emerald"
                    ? "bg-emerald-500"
                    : "bg-purple-500"
                }`}
              >
                {event.type}
              </span>

              {event.description && (
                <p className="mt-4 text-slate-600">
                  {event.description}
                </p>
              )}

            </div>

          ))

        )}

      </div>

    </div>
  );

}

export default EventCard;