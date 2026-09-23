import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Subjects from "../pages/subjects/Subjects";
import SubjectDetails from "../pages/subjects/SubjectDetails";
import Planner from "../pages/planner/Planner";
import Calendar from "../pages/calendar/Calendar";
import Notes from "../pages/notes/Notes";
import ProtectedRoute from "../components/ProtectedRoute";
import Attendance from "../pages/attendance/Attendance";
import Analytics from "../pages/analytics/Analytics";
import AICoach from "../pages/ai/AICoach";
import AIPlanner from "../pages/ai/AIPlanner";
import AIQuiz from "../pages/ai/AIQuiz";
import MainLayout from "../components/layout/MainLayout";
import Register from "../pages/auth/Register";
import Settings from "../pages/settings/Settings";
import { useAuth } from "../context/AuthContext";

function AppRoutes() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />

        {/* Public Routes */}

        <Route
          path="/login"
          element={<Login />}
        />

<Route
  path="/register"
  element={<Register />}
/>
        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route

path="/ai-planner"

element={
<ProtectedRoute>
<AIPlanner/>
</ProtectedRoute>
}

/>

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/:id"
          element={
            <ProtectedRoute>
              <SubjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <Planner />
            </ProtectedRoute>
          }
        />
         <Route
  path="/notes"
  element={
    <ProtectedRoute>
      <Notes />
    </ProtectedRoute>
  }
/>
<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
  path="/attendance"
  element={
    <ProtectedRoute>
      <Attendance />
    </ProtectedRoute>
  }
/>
<Route
  path="/ai"
  element={
    <ProtectedRoute>
      <AICoach />
    </ProtectedRoute>
  }
/>
<Route
  path="/ai-quiz"
  element={
    <ProtectedRoute>
      <MainLayout>
        <AIQuiz />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;