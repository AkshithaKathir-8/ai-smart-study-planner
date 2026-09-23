import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const PlannerContext = createContext();

export function PlannerProvider({ children }) {

  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Sessions
  const fetchSessions = async () => {

    try {

      setLoading(true);

      const response = await api.get("/planner");

      setSessions(response.data);

    } catch (error) {

      console.log("Failed to fetch planner sessions", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (user) {

      fetchSessions();

    } else {

      setSessions([]);
      setLoading(false);

    }

  }, [user]);

  // Add Session
  const addSession = async (data) => {

    try {

      await api.post("/planner", data);

      await fetchSessions();

    } catch (error) {

      console.log("Add session failed", error);

    }

  };

  // Update Session
  const updateSession = async (id, data) => {

    try {

      await api.put(`/planner/${id}`, data);

      await fetchSessions();

    } catch (error) {

      console.log("Update session failed", error);

    }

  };

  // Delete Session
  const deleteSession = async (id) => {

    try {

      await api.delete(`/planner/${id}`);

      await fetchSessions();

    } catch (error) {

      console.log("Delete session failed", error);

    }

  };

  return (

    <PlannerContext.Provider
      value={{
        sessions,
        loading,
        addSession,
        updateSession,
        deleteSession,
        fetchSessions,
      }}
    >

      {children}

    </PlannerContext.Provider>

  );

}

export function usePlanner() {

  return useContext(PlannerContext);

}