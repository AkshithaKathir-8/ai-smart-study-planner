import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  NotebookPen,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  Flame,
  Sparkles,
  FileQuestion,
  Library,
  History,
} from "lucide-react";

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { getAIPlans } from "../../services/aiService";
import Logo from "../ui/Logo";

const mainMenu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Subjects",
    icon: Library,
    path: "/subjects",
  },
  {
    name: "Planner",
    icon: BookOpen,
    path: "/planner",
  },
  {
    name: "Calendar",
    icon: CalendarDays,
    path: "/calendar",
  },
  {
    name: "Notes",
    icon: NotebookPen,
    path: "/notes",
  },
  {
    name: "Attendance",
    icon: ClipboardCheck,
    path: "/attendance",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

const aiMenu = [
  {
    name: "AI Chat",
    icon: Sparkles,
    path: "/ai",
  },
  {
    name: "AI Quiz",
    icon: FileQuestion,
    path: "/ai-quiz",
  },
  {
    name: "Quiz History",
    icon: History,
    path: "/quiz-history",
  },
];


function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadStreak = async () => {
      try {
       const response = await getAIPlans();

const plans = Array.isArray(response)
  ? response
  : Array.isArray(response?.plans)
  ? response.plans
  : [];

const latestPlan = plans[0];

if (mounted) {
  setCurrentStreak(
    Number(latestPlan?.currentStreak ?? 0)
  );
}
      } catch (error) {
        console.error(
          "SIDEBAR STREAK LOAD ERROR:",
          error.response?.data || error.message
        );
      }
    };

    loadStreak();

    window.addEventListener("study-streak-updated", loadStreak);
    window.addEventListener("ai-study-plan-updated", loadStreak);

    return () => {
      mounted = false;
      window.removeEventListener(
        "study-streak-updated",
        loadStreak
      );
      window.removeEventListener(
        "ai-study-plan-updated",
        loadStreak
      );
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 py-3 rounded-2xl mb-3 transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
              : "text-slate-600 hover:bg-slate-100 hover:translate-x-1"
          }`
        }
      >
        <Icon size={21} />
        <span className="font-medium">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-slate-100">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-6 overflow-y-auto">
        {/* Main Navigation */}
        {mainMenu.map(renderMenuItem)}

        {/* AI & Learning */}
        <div className="mt-6 mb-3 px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            AI & Learning
          </p>
        </div>

        {aiMenu.map(renderMenuItem)}

        {/* Settings */}
        <div className="mt-6">
          {renderMenuItem({
            name: "Settings",
            icon: Settings,
            path: "/settings",
          })}
        </div>
      </nav>

      {/* Dynamic Study Streak */}
      <div className="mx-5 mb-5 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <Flame size={28} />

          <div>
            <p className="text-sm opacity-90">Study Streak</p>

            <h2 className="text-2xl font-bold">
              {currentStreak}{" "}
              {currentStreak === 1 ? "Day" : "Days"}
            </h2>
          </div>
        </div>

        <p className="mt-3 text-sm opacity-90">
          {currentStreak === 0
            ? "Complete a study session to start your streak!"
            : currentStreak === 1
            ? "Great start! Keep learning every day!"
            : "You're doing amazing. Keep learning every day!"}
        </p>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-200 p-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:bg-red-50 rounded-2xl px-4 py-3 w-full transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;