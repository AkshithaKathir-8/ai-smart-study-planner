import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getEvents,
  createEvent,
  updateEvent as updateEventAPI,
  deleteEvent as deleteEventAPI,
} from "../services/calendarService";

import { useAuth } from "./AuthContext";

const CalendarContext = createContext();

export function CalendarProvider({ children }) {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load Events
  // =========================
  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await getEvents();

      setEvents(data);
    } catch (error) {
      console.log(
        "Load Events Error:",
        error.response?.data || error.message
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load when user is logged in
  // =========================
  useEffect(() => {
    if (user) {
      loadEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [user]);

  // =========================
  // Add Event
  // =========================
  const addEvent = async (event) => {
    try {
      const newEvent = await createEvent(event);

      setEvents((prev) => [
        ...prev,
        newEvent,
      ]);
    } catch (error) {
      console.log(
        "Add Event Error:",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // =========================
  // Update Event
  // =========================
  const updateEvent = async (event) => {
    try {
      const updated = await updateEventAPI(
        event._id,
        event
      );

      setEvents((prev) =>
        prev.map((item) =>
          item._id === updated._id
            ? updated
            : item
        )
      );
    } catch (error) {
      console.log(
        "Update Event Error:",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  // =========================
  // Delete Event
  // =========================
  const deleteEvent = async (id) => {
    try {
      await deleteEventAPI(id);

      setEvents((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.log(
        "Delete Event Error:",
        error.response?.data || error.message
      );

      throw error;
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        loadEvents,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  return useContext(CalendarContext);
}