import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarDay from "./CalendarDay";

function CalendarGrid({
  currentDate,
  setCurrentDate,
  events,
  selectedDate,
  setSelectedDate,
}) {

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // JS: Sunday=0, Monday=1...
  // Convert so Monday becomes first column.
  let firstDayOffset = new Date(year, month, 1).getDay();

  firstDayOffset =
    firstDayOffset === 0
      ? 6
      : firstDayOffset - 1;

  const cells = [];

  // Empty cells
  for (let i = 0; i < firstDayOffset; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        className="min-h-24"
      />
    );
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {

    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const dayEvents = events.filter((event) => {
  const eventDate = new Date(event.date)
    .toISOString()
    .split("T")[0];

  return eventDate === date;
});

    cells.push(

      <CalendarDay
        key={day}
        day={day}
        date={date}
        events={dayEvents}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

    );

  }

  return (

    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      <div className="flex justify-between items-center mb-8">

        <button
          onClick={() =>
            setCurrentDate(
              new Date(year, month - 1, 1)
            )
          }
          className="p-2 rounded-xl hover:bg-slate-100"
        >
          <ChevronLeft />
        </button>

        <h2 className="text-2xl font-bold">
          {monthName} {year}
        </h2>

        <button
          onClick={() =>
            setCurrentDate(
              new Date(year, month + 1, 1)
            )
          }
          className="p-2 rounded-xl hover:bg-slate-100"
        >
          <ChevronRight />
        </button>

      </div>

      <div className="grid grid-cols-7 gap-3 mb-5 text-center font-semibold text-slate-500">

        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>

      </div>

      <div className="grid grid-cols-7 gap-3">

        {cells}

      </div>

    </div>

  );

}

export default CalendarGrid;