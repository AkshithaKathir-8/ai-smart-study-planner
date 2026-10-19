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

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user]);


  // ADD NORMAL TEXT NOTE OR UPLOADED STUDY MATERIAL
  const addNote = async (note, file = null) => {
    try {
      let res;

      if (file) {
        const formData = new FormData();

        formData.append("title", note.title);
        formData.append("subject", note.subject);
        formData.append(
          "description",
          note.description || ""
        );
        formData.append(
          "pinned",
          note.pinned ? "true" : "false"
        );
        formData.append("file", file);

        res = await api.post(
          "/notes/upload",
          formData
        );
      } else {
        res = await api.post("/notes", note);
      }

      setNotes((prev) => [
        res.data,
        ...prev,
      ]);

      return res.data;
    } catch (err) {
      console.error(
        "Add note failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };


 const updateNote = async (
  note,
  file = null
) => {
  try {
    let res;

    if (file) {
      const formData = new FormData();

      formData.append(
        "title",
        note.title
      );

      formData.append(
        "subject",
        note.subject
      );

      formData.append(
        "description",
        note.description || ""
      );

      formData.append(
        "pinned",
        note.pinned ? "true" : "false"
      );

      formData.append(
        "file",
        file
      );

      res = await api.put(
        `/notes/${note._id}`,
        formData
      );
    } else {
      res = await api.put(
        `/notes/${note._id}`,
        note
      );
    }

    setNotes((prev) =>
      prev.map((n) =>
        n._id === note._id
          ? res.data
          : n
      )
    );

    return res.data;
  } catch (err) {
    console.error(
      "Update note failed:",
      err.response?.data ||
        err.message
    );

    throw err;
  }
};


  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);

      setNotes((prev) =>
        prev.filter(
          (n) => n._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete note failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };


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

  const generateNoteSummary = async (id) => {
  try {
    const res = await api.post(
      `/notes/${id}/ai-summary`
    );

    setNotes((prev) =>
      prev.map((note) =>
        note._id === id
          ? res.data.note
          : note
      )
    );

    return res.data;
  } catch (err) {
    console.error(
      "Generate note summary failed:",
      err.response?.data || err.message
    );

    throw err;
  }
};

const generateTwoMarkQuestions = async (id) => {
  try {
    const res = await api.post(
      `/notes/${id}/two-mark-questions`
    );

    setNotes((prev) =>
      prev.map((note) =>
        note._id === id
          ? res.data.note
          : note
      )
    );

    return res.data;
  } catch (err) {
    console.error(
      "Generate 2-mark questions failed:",
      err.response?.data || err.message
    );

    throw err;
  }
};

const generateNoteQuiz = async (id) => {
  try {
    const res = await api.post(
      `/notes/${id}/generate-quiz`,
      {
        count: 5,
        difficulty: "Medium",
      }
    );

    return res.data;
  } catch (err) {
    console.error(
      "Generate note quiz failed:",
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
        generateNoteSummary,
        generateTwoMarkQuestions,
        generateNoteQuiz,

      }}
    >
      {children}
    </NotesContext.Provider>
  );
}


export function useNotes() {
  return useContext(NotesContext);
}