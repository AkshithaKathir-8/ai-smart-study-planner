import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance as deleteAttendanceAPI,
} from "../services/attendanceService";

import { useAuth } from "./AuthContext";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Attendance
  // =========================
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const data = await getAttendance();

      setRecords(data);
    } catch (err) {
      console.log(
        "Failed to fetch attendance:",
        err.response?.data || err.message
      );

      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Fetch when user is logged in
  // =========================
  useEffect(() => {
    if (user) {
      fetchAttendance();
    } else {
      setRecords([]);
      setLoading(false);
    }
  }, [user]);

  // =========================
  // Add Attendance
  // =========================
  const addRecord = async (record) => {
    try {
      await createAttendance(record);
      await fetchAttendance();
    } catch (err) {
      console.log(
        "Add attendance failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };

  // =========================
  // Update Attendance
  // =========================
  const updateRecord = async (record) => {
    try {
      await updateAttendance(record._id, record);
      await fetchAttendance();
    } catch (err) {
      console.log(
        "Update attendance failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };

  // =========================
  // Delete Attendance
  // =========================
  const deleteRecord = async (id) => {
    try {
      await deleteAttendanceAPI(id);
      await fetchAttendance();
    } catch (err) {
      console.log(
        "Delete attendance failed:",
        err.response?.data || err.message
      );

      throw err;
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        loading,
        addRecord,
        updateRecord,
        deleteRecord,
        fetchAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  return useContext(AttendanceContext);
}