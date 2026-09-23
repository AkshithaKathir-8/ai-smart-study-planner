import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { SubjectProvider } from "./context/SubjectContext";
import { PlannerProvider } from "./context/PlannerContext";
import { CalendarProvider } from "./context/CalendarContext";
import { NotesProvider } from "./context/NotesContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { AIProvider } from "./context/AIContext";
import { DashboardProvider } from "./context/DashboardContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SubjectProvider>
        <PlannerProvider>
          <CalendarProvider>
            <NotesProvider>
              <AttendanceProvider>
                <AIProvider>
                  <DashboardProvider>
              <App />

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 2500,
                  style: {
                    borderRadius: "16px",
                    background: "#fff",
                    color: "#1e293b",
                  },
                }}
              />
              </DashboardProvider>
              </AIProvider>
              </AttendanceProvider>
            </NotesProvider>
          </CalendarProvider>
        </PlannerProvider>
      </SubjectProvider>
    </AuthProvider>
  </React.StrictMode>
);