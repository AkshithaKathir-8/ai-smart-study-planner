import { useState } from "react";
import { Search } from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import CalendarGrid from "../../components/calendar/CalendarGrid";
import EventCard from "../../components/calendar/EventCard";
import CalendarStats from "../../components/calendar/CalendarStats";
import AddEventModal from "../../components/calendar/AddEventModal";

import { useCalendar } from "../../context/CalendarContext";

function Calendar() {

  const {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendar();

  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  
  const handleSaveEvent = (eventData) => {

    if (editingEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }

    setEditingEvent(null);
    setOpenModal(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setOpenModal(true);
  };

  const handleDelete = (id) => {

    if (window.confirm("Delete this event?")) {
      deleteEvent(id);
    }

  };

  const filteredEvents = events.filter((event) => {

    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || event.type === filter;

    return matchesSearch && matchesFilter;

  });
   if (loading) {
  return (
    <MainLayout>
      <div className="text-center text-xl py-20">
        Loading Calendar...
      </div>
    </MainLayout>
  );
}
  return (

    <MainLayout>

      <div className="space-y-8">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

          <PageHeader
            title="Calendar"
            subtitle="Manage your study schedule and important events."
          />

          <button
            onClick={() => {
              setEditingEvent(null);
              setOpenModal(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition cursor-pointer"
          >
            + Add Event
          </button>

        </div>

        <CalendarStats events={filteredEvents} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3 rounded-2xl border border-slate-200"
            />

          </div>

          <div className="flex flex-wrap gap-3 mt-5">

            {[
              "All",
              "Study",
              "Assignment",
              "Exam",
              "Meeting",
            ].map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-5 py-2 rounded-xl transition ${
                  filter === item
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

<CalendarGrid
  currentDate={currentDate}
  setCurrentDate={setCurrentDate}
  events={filteredEvents}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
/>

          <EventCard
            selectedDate={selectedDate}
            events={filteredEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      </div>

      <AddEventModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialData={editingEvent}
      />

    </MainLayout>

  );

}

export default Calendar;