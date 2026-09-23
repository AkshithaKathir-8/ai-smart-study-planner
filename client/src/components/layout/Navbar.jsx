import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Search,
  CalendarDays,
  ChevronDown,
  Settings,
  LogOut,
  X,
  BookOpen,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  FileText,
  BarChart3,
  Brain,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePlanner } from "../../context/PlannerContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { sessions } = usePlanner();

const userKey = user?._id || user?.id || user?.email || "student";
const readStorageKey = `kortex-read-notifications-${userKey}`;

const [readNotificationIds, setReadNotificationIds] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem(readStorageKey) || "[]");
  } catch {
    return [];
  }
});

// Keep read status separate for each signed-in user.
useEffect(() => {
  try {
    setReadNotificationIds(
      JSON.parse(localStorage.getItem(readStorageKey) || "[]")
    );
  } catch {
    setReadNotificationIds([]);
  }
}, [readStorageKey]);

const getDateKey = (value) => {
  if (!value) return "";

  // Preserve a YYYY-MM-DD date if the API provides one.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const todayKey = getDateKey(new Date());
const todayNumber = Date.parse(`${todayKey}T00:00:00`);

const notifications = (sessions || [])
  .filter((session) => session.status !== "Completed")
  .map((session) => {
    const dateKey = getDateKey(session.studyDate);
    const sessionDay = Date.parse(`${dateKey}T00:00:00`);
    const daysFromToday = Math.round(
      (sessionDay - todayNumber) / (24 * 60 * 60 * 1000)
    );

    let type = "";

    if (daysFromToday < 0) {
      type = "overdue";
    } else if (daysFromToday === 0) {
      type = "today";
    } else if (daysFromToday <= 7) {
      type = "upcoming";
    }

    if (!type || !dateKey) return null;

    const subjectName =
      typeof session.subjectId === "object"
        ? session.subjectId?.name
        : "";

    let message = "";

    if (type === "overdue") {
      message = `Overdue study session • ${dateKey}`;
    } else if (type === "today") {
      message = `Scheduled for today • ${session.startTime || ""}`;
    } else {
      message = `Coming up on ${dateKey} • ${session.startTime || ""}`;
    }

    return {
      id: `${session._id}-${type}-${dateKey}`,
      sessionId: session._id,
      topic: session.topic || "Study session",
      subjectName,
      message,
      type,
      dateKey,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

const unreadCount = notifications.filter(
  (notification) => !readNotificationIds.includes(notification.id)
).length;

const markAllNotificationsRead = () => {
  const allIds = notifications.map((notification) => notification.id);

  setReadNotificationIds(allIds);
  localStorage.setItem(readStorageKey, JSON.stringify(allIds));
};

const openNotification = (notification) => {
  const updatedReadIds = [
    ...new Set([...readNotificationIds, notification.id]),
  ];

  setReadNotificationIds(updatedReadIds);
  localStorage.setItem(readStorageKey, JSON.stringify(updatedReadIds));

  setShowNotifications(false);
  navigate("/planner");
};
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  else if (hour < 21) greeting = "Good Evening";
  else greeting = "Good Night";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const pages = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Subjects", path: "/subjects", icon: BookOpen },
    { name: "Study Planner", path: "/planner", icon: ClipboardList },
    { name: "AI Planner", path: "/ai-planner", icon: Brain },
    { name: "AI Coach", path: "/ai", icon: GraduationCap },
    { name: "AI Quiz", path: "/ai-quiz", icon: CheckCircle },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Notes", path: "/notes", icon: FileText },
    { name: "Attendance", path: "/attendance", icon: ClipboardList },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const handleSearchKeyDown = (e) => {
  if (e.key === "Escape") {
    setShowSearchResults(false);
    setSelectedResultIndex(0);
    return;
  }

  if (!showSearchResults || !searchTerm.trim() || filteredPages.length === 0) {
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();

    setSelectedResultIndex((currentIndex) =>
      (currentIndex + 1) % filteredPages.length
    );
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();

    setSelectedResultIndex((currentIndex) =>
      (currentIndex - 1 + filteredPages.length) % filteredPages.length
    );
  }

  if (e.key === "Enter") {
    e.preventDefault();

    handleSearchSelect(filteredPages[selectedResultIndex].path);
  }
};

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/login", { replace: true });
  };

  // Close menus when clicking outside them.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center gap-6">
      {/* Left side */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {greeting}, {user?.name || "Student"} 👋
        </h1>

        <div className="flex items-center gap-2 mt-2 text-slate-500">
          <CalendarDays size={17} />
          <span>{today}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            placeholder="Search pages..."
            aria-label="Search pages"
            autoComplete="off"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => {
              if (searchTerm.trim()) {
                setShowSearchResults(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
            className="w-72 pl-11 pr-10 py-3 rounded-2xl bg-slate-100 border border-transparent focus:border-indigo-500 focus:outline-none"
          />

          {searchTerm && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearchTerm("");
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={17} />
            </button>
          )}

          {showSearchResults && searchTerm.trim() && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Search results
                </p>
              </div>

              {filteredPages.length > 0 ? (
                <div className="max-h-80 overflow-y-auto py-2">
                  {filteredPages.map((page) => {
                    const Icon = page.icon;

                    return (
                      <button
                        type="button"
                        key={page.path}
                        onClick={() => handleSearchSelect(page.path)}
                        onMouseEnter={() =>
  setSelectedResultIndex(filteredPages.indexOf(page))
}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
  selectedResultIndex === filteredPages.indexOf(page)
    ? "bg-indigo-50 text-indigo-700"
    : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
}`}
                      >

                        <Icon size={18} />
                        <span>{page.name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="px-4 py-5 text-sm text-slate-500">
                  No matching pages found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
<div className="relative" ref={notificationRef}>
  <button
    type="button"
    aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
    aria-expanded={showNotifications}
    onClick={() => {
      setShowNotifications((previous) => !previous);
      setShowProfileMenu(false);
    }}
    className="relative p-3 rounded-xl hover:bg-slate-100 text-slate-600 transition"
  >
    <Bell size={22} />

    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
        {unreadCount > 9 ? "9+" : unreadCount}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 max-w-[90vw] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800">Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Mark all read
            </button>
          )}

          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setShowNotifications(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <Bell size={22} className="text-indigo-600" />
          </div>

          <p className="font-medium text-slate-700">
            No study reminders right now
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Pending sessions due today or within the next 7 days, and overdue
            sessions, will appear here.
          </p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {notifications.map((notification) => {
            const isRead = readNotificationIds.includes(notification.id);

            return (
              <button
                type="button"
                key={notification.id}
                onClick={() => openNotification(notification)}
                className={`w-full text-left px-5 py-4 flex gap-3 hover:bg-indigo-50 transition ${
                  isRead ? "bg-white" : "bg-indigo-50/60"
                }`}
              >
                <div className="mt-1">
                  <span
                    className={`block w-2.5 h-2.5 rounded-full ${
                      notification.type === "overdue"
                        ? "bg-red-500"
                        : notification.type === "today"
                        ? "bg-amber-500"
                        : "bg-indigo-500"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-slate-800">
                      {notification.topic}
                    </p>

                    {!isRead && (
                      <span className="text-xs font-medium text-indigo-600">
                        New
                      </span>
                    )}
                  </div>

                  {notification.subjectName && (
                    <p className="text-xs text-slate-500 mt-1">
                      {notification.subjectName}
                    </p>
                  )}

                  <p className="text-sm text-slate-600 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-indigo-600 mt-2">
                    Open study planner →
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  )}
</div>

        {/* Profile menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={showProfileMenu}
            onClick={() => {
              setShowProfileMenu((previous) => !previous);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 hover:bg-slate-100 rounded-2xl px-3 py-2 transition"
          >
            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-left">
              <p className="font-semibold text-slate-800">
                {user?.name || "Student"}
              </p>

              <p className="text-xs text-slate-500">Student</p>
            </div>

            <ChevronDown
              size={18}
              className={`text-slate-500 transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-3 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800">
                  {user?.name || "Student"}
                </p>

                {user?.email && (
                  <p className="mt-1 text-sm text-slate-500 break-all">
                    {user.email}
                  </p>
                )}
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate("/settings");
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;