import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const SubjectContext = createContext();

export function SubjectProvider({ children }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Fetch Subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const response = await api.get("/subjects");

      console.log("Subjects from backend:", response.data);

      setSubjects(response.data);

    } catch (error) {

      console.log("Failed to fetch subjects", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    if (user) {
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [user]);

  // Add Subject
  const addSubject = async (newSubject) => {
    try {

      await api.post("/subjects", newSubject);

      await fetchSubjects();

    } catch (error) {

      console.log("Add subject failed", error);

    }
  };

  // Update Subject
  const updateSubject = async (updatedSubject) => {
    try {

      await api.put(
        `/subjects/${updatedSubject._id}`,
        updatedSubject
      );

      await fetchSubjects();

    } catch (error) {

      console.log("Update failed", error);

    }
  };

  // Delete Subject
  const deleteSubject = async (id) => {
    try {

      await api.delete(`/subjects/${id}`);

      await fetchSubjects();

    } catch (error) {

      console.log("Delete failed", error);

    }
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        loading,
        addSubject,
        updateSubject,
        deleteSubject,
        fetchSubjects,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubjects() {
  return useContext(SubjectContext);
}