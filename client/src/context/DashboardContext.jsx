import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAnalytics } from "../services/analyticsService";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {

  const [analytics, setAnalytics] = useState({

    totalSubjects: 0,
    totalPlanner: 0,
    totalNotes: 0,
    totalEvents: 0,

    averageAttendance: 0,
    averageProgress: 0,

    attendanceChart: [],
    subjectProgress: [],

  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {

    try {

      const data = await getAnalytics();

      setAnalytics(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadDashboard();

  }, []);

  return (

    <DashboardContext.Provider

      value={{

        analytics,
        loading,
        refreshDashboard: loadDashboard,

      }}

    >

      {children}

    </DashboardContext.Provider>

  );

}

export function useDashboard(){

  return useContext(DashboardContext);

}