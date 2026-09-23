import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load Notes
  // =========================
  const loadNotes = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notes");

      setNotes(res.data);
    } catch (err) {
      console.error(
        "Failed to load notes:",
        err.response?.data || err.message
      );

      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load when user is logged in
  // =========================
  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);

  // =========================
  // Add Note
  // =========================
  const addNote = async (note) => {
    try {
      const res = await api.post("/notes", note);

      setNotes((prev) => [
        res.data,
        ...prev,
      ]);
    } catch (err) {
      console.error(
        "Add note failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };

  // =========================
  // Update Note
  // =========================
  const updateNote = async (note) => {
    try {
      const res = await api.put(
        `/notes/${note._id}`,
        note
      );

      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id
            ? res.data
            : n
        )
      );
    } catch (err) {
      console.error(
        "Update note failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };

  // =========================
  // Delete Note
  // =========================
  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);

      setNotes((prev) =>
        prev.filter((n) => n._id !== id)
      );
    } catch (err) {
      console.error(
        "Delete note failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };

  // =========================
  // Toggle Pin
  // =========================
  const togglePin = async (id) => {
    try {
      const res = await api.patch(
        `/notes/${id}/pin`
      );

      setNotes((prev) =>
        prev.map((n) =>
          n._id === id
            ? res.data
            : n
        )
      );
    } catch (err) {
      console.error(
        "Toggle pin failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        loadNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}