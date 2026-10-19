import {
  LayoutDashboard,
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
  BookOpen,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
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
    name: "Notes",
    icon: NotebookPen,
    path: "/notes",
  },
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

const studyMenu = [
  {
    name: "Study Planner",
    icon: BookOpen,
    path: "/planner",
  },
  {
    name: "Calendar",
    icon: CalendarDays,
    path: "/calendar",
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

const accountMenu = [
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [currentStreak, setCurrentStreak] = useState(0);

  const navRef = useRef(null);

  /* -------------------------------------------------------
     PRESERVE SIDEBAR SCROLL POSITION
  ------------------------------------------------------- */

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(
      "kortex-sidebar-scroll"
    );

    if (savedPosition && navRef.current) {
      requestAnimationFrame(() => {
        if (navRef.current) {
          navRef.current.scrollTop =
            Number(savedPosition);
        }
      });
    }

    const handleScroll = () => {
      if (navRef.current) {
        sessionStorage.setItem(
          "kortex-sidebar-scroll",
          String(navRef.current.scrollTop)
        );
      }
    };

    const navElement = navRef.current;

    if (navElement) {
      navElement.addEventListener(
        "scroll",
        handleScroll
      );
    }

    return () => {
      if (navElement) {
        navElement.removeEventListener(
          "scroll",
          handleScroll
        );
      }
    };
  }, []);

  /* -------------------------------------------------------
     STREAK
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const getLocalDate = () => {
      const today = new Date();

      const year = today.getFullYear();

      const month = String(
        today.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        today.getDate()
      ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const loadStreak = async () => {
      try {
        const response = await api.get(
          `/planner/streak?localDate=${getLocalDate()}`
        );

        if (mounted) {
          setCurrentStreak(
            Number(
              response.data?.currentStreak ?? 0
            )
          );
        }
      } catch (error) {
        console.error(
          "SIDEBAR STREAK LOAD ERROR:",
          error
        );
      }
    };

    loadStreak();

    window.addEventListener(
      "study-streak-updated",
      loadStreak
    );

    window.addEventListener(
      "ai-study-plan-updated",
      loadStreak
    );

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
          `group flex items-center gap-4 px-4 py-3 rounded-2xl mb-2 transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
              : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:translate-x-1"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={21}
              className={`transition-transform duration-300 ${
                isActive
                  ? "scale-105"
                  : "group-hover:scale-105"
              }`}
            />

            <span className="font-medium">
              {item.name}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className="
        sticky
        top-0
        w-72
        bg-gradient-to-b
        from-indigo-50
        via-white
        to-violet-50
        border-r
        border-indigo-100
        h-screen
        flex
        flex-col
        shrink-0
      "
    >
      {/* LOGO */}
<div
  className="
    relative
    overflow-hidden
    px-8
    py-7
    border-b
    border-indigo-100
    bg-gradient-to-br
    from-indigo-100
    via-indigo-50
    to-violet-100
  "
>
  <div className="relative z-10">
    <Logo />
  </div>

  {/* Subtle AI-style background circles */}
  <div
    className="
      absolute
      -right-10
      -top-12
      h-32
      w-32
      rounded-full
      bg-indigo-300/20
    "
  />

  <div
    className="
      absolute
      right-20
      -bottom-20
      h-40
      w-40
      rounded-full
      bg-violet-300/15
    "
  />
</div>
      {/* NAVIGATION */}
      <nav
        ref={navRef}
        className="
          flex-1
          px-5
          py-6
          overflow-y-auto
          scrollbar-thin
          scrollbar-thumb-indigo-200
          scrollbar-track-transparent
        "
      >
        {/* MAIN */}
        <div className="mb-3 px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-400">
            Main
          </p>
        </div>

        {mainMenu.map(renderMenuItem)}

        {/* STUDY */}
        <div className="mt-7 mb-3 px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-400">
            Study
          </p>
        </div>

        {studyMenu.map(renderMenuItem)}

        {/* ACCOUNT */}
        <div className="mt-7 mb-3 px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-400">
            Account
          </p>
        </div>

        {accountMenu.map(renderMenuItem)}
      </nav>

      {/* STUDY STREAK */}
      <div
        className="
          mx-5
          mb-5
          rounded-3xl
          bg-gradient-to-br
          from-orange-500
          via-orange-500
          to-amber-500
          text-white
          p-5
          shadow-lg
          shadow-orange-100
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white/20">
            <Flame size={25} />
          </div>

          <div>
            <p className="text-sm text-white/80">
              Study Streak
            </p>

            <h2 className="text-2xl font-bold">
              {currentStreak}{" "}
              {currentStreak === 1
                ? "Day"
                : "Days"}
            </h2>
          </div>
        </div>

        <p className="mt-3 text-sm text-white/85 leading-relaxed">
          {currentStreak === 0
            ? "Complete a study session to start your streak!"
            : currentStreak === 1
            ? "Great start! Keep learning every day!"
            : "You're doing amazing. Keep learning every day!"}
        </p>
      </div>

      {/* LOGOUT */}
      <div
        className="
          border-t
          border-indigo-100
          p-5
          bg-white/60
        "
      >
        <button
          onClick={handleLogout}
          className="
            group
            flex
            items-center
            gap-3
            text-slate-500
            hover:text-red-600
            hover:bg-red-50
            rounded-2xl
            px-4
            py-3
            w-full
            transition-all
            duration-200
          "
        >
          <LogOut
            size={20}
            className="
              group-hover:-translate-x-0.5
              transition-transform
            "
          />

          <span className="font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;