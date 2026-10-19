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

  const userKey =
    user?._id ||
    user?.id ||
    user?.email ||
    "student";

  const readStorageKey =
    `kortex-read-notifications-${userKey}`;

  const [
    readNotificationIds,
    setReadNotificationIds,
  ] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(readStorageKey) || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      setReadNotificationIds(
        JSON.parse(
          localStorage.getItem(readStorageKey) || "[]"
        )
      );
    } catch {
      setReadNotificationIds([]);
    }
  }, [readStorageKey]);

  const getDateKey = (value) => {
    if (!value) return "";

    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {
      return value.slice(0, 10);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayKey = getDateKey(new Date());

  const todayNumber = Date.parse(
    `${todayKey}T00:00:00`
  );

  const notifications = (sessions || [])
    .filter(
      (session) =>
        session.status !== "Completed"
    )
    .map((session) => {
      const dateKey = getDateKey(
        session.studyDate
      );

      const sessionDay = Date.parse(
        `${dateKey}T00:00:00`
      );

      const daysFromToday = Math.round(
        (sessionDay - todayNumber) /
          (24 * 60 * 60 * 1000)
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
        message =
          `Overdue study session • ${dateKey}`;
      } else if (type === "today") {
        message =
          `Scheduled for today • ${
            session.startTime || ""
          }`;
      } else {
        message =
          `Coming up on ${dateKey} • ${
            session.startTime || ""
          }`;
      }

      return {
        id: `${session._id}-${type}-${dateKey}`,
        sessionId: session._id,
        topic:
          session.topic || "Study session",
        subjectName,
        message,
        type,
        dateKey,
      };
    })
    .filter(Boolean)
    .sort((a, b) =>
      a.dateKey.localeCompare(b.dateKey)
    );

  const unreadCount =
    notifications.filter(
      (notification) =>
        !readNotificationIds.includes(
          notification.id
        )
    ).length;

  const markAllNotificationsRead = () => {
    const allIds = notifications.map(
      (notification) => notification.id
    );

    setReadNotificationIds(allIds);

    localStorage.setItem(
      readStorageKey,
      JSON.stringify(allIds)
    );
  };

  const openNotification = (
    notification
  ) => {
    const updatedReadIds = [
      ...new Set([
        ...readNotificationIds,
        notification.id,
      ]),
    ];

    setReadNotificationIds(
      updatedReadIds
    );

    localStorage.setItem(
      readStorageKey,
      JSON.stringify(updatedReadIds)
    );

    setShowNotifications(false);

    navigate("/planner");
  };

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [selectedResultIndex, setSelectedResultIndex] =
    useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );

  const pages = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Subjects",
      path: "/subjects",
      icon: BookOpen,
    },
    {
      name: "Study Planner",
      path: "/planner",
      icon: ClipboardList,
    },
    {
      name: "AI Planner",
      path: "/ai-planner",
      icon: Brain,
    },
    {
      name: "AI Coach",
      path: "/ai",
      icon: GraduationCap,
    },
    {
      name: "AI Quiz",
      path: "/ai-quiz",
      icon: CheckCircle,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      name: "Notes",
      path: "/notes",
      icon: FileText,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: ClipboardList,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const filteredPages = pages.filter(
    (page) =>
      page.name
        .toLowerCase()
        .includes(
          searchTerm.trim().toLowerCase()
        )
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

    if (
      !showSearchResults ||
      !searchTerm.trim() ||
      filteredPages.length === 0
    ) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedResultIndex(
        (currentIndex) =>
          (currentIndex + 1) %
          filteredPages.length
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedResultIndex(
        (currentIndex) =>
          (currentIndex -
            1 +
            filteredPages.length) %
          filteredPages.length
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();

      handleSearchSelect(
        filteredPages[selectedResultIndex]
          .path
      );
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);

    navigate("/login", {
      replace: true,
    });
  };

  // Browser study reminders
  useEffect(() => {
    if (!user?.notificationsEnabled) {
      return;
    }

    if (!("Notification" in window)) {
      return;
    }

    const requestNotificationPermission =
      async () => {
        if (
          Notification.permission ===
          "default"
        ) {
          try {
            await Notification.requestPermission();
          } catch (error) {
            console.error(
              "Notification permission request failed:",
              error
            );
          }
        }
      };

    requestNotificationPermission();

    const checkStudyReminders = () => {
      if (
        Notification.permission !==
        "granted"
      ) {
        return;
      }

      const now = new Date();

      (sessions || [])
        .filter(
          (session) =>
            session.status !== "Completed" &&
            session.studyDate &&
            session.startTime
        )
        .forEach((session) => {
          const date = new Date(
            session.studyDate
          );

          if (Number.isNaN(date.getTime())) {
            return;
          }

          const year = date.getFullYear();

          const month = String(
            date.getMonth() + 1
          ).padStart(2, "0");

          const day = String(
            date.getDate()
          ).padStart(2, "0");

          const startDateTime = new Date(
            `${year}-${month}-${day}T${session.startTime}`
          );

          if (
            Number.isNaN(
              startDateTime.getTime()
            )
          ) {
            return;
          }

          const difference =
            startDateTime.getTime() -
            now.getTime();

          const sessionKey =
            session._id;

          const tenMinuteKey =
            `kortex-notification-${user._id || user.id}-` +
            `${sessionKey}-10min`;

          if (
            difference <=
              10 * 60 * 1000 &&
            difference > 0 &&
            !localStorage.getItem(
              tenMinuteKey
            )
          ) {
            new Notification(
              "Kortex AI — Study Reminder",
              {
                body:
                  `${session.topic} — ` +
                  `${
                    session.subjectId?.name ||
                    "Study session"
                  } ` +
                  `starts in 10 minutes.`,
                icon: "/favicon.ico",
              }
            );

            localStorage.setItem(
              tenMinuteKey,
              "true"
            );
          }

          const startKey =
            `kortex-notification-${user._id || user.id}-` +
            `${sessionKey}-start`;

          if (
            difference <= 0 &&
            difference >
              -60 * 1000 &&
            !localStorage.getItem(
              startKey
            )
          ) {
            new Notification(
              "Kortex AI — Study Reminder",
              {
                body:
                  `${session.topic} — ` +
                  `${
                    session.subjectId?.name ||
                    "Study session"
                  } ` +
                  `starts now.`,
                icon: "/favicon.ico",
              }
            );

            localStorage.setItem(
              startKey,
              "true"
            );
          }
        });
    };

    checkStudyReminders();

    const interval = setInterval(
      checkStudyReminders,
      30 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [user, sessions]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target
        )
      ) {
        setShowSearchResults(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header
      className="
        relative
        z-50
        bg-white/95
        backdrop-blur-md
        border-b
        border-indigo-100
        px-8
        py-4
        flex
        justify-between
        items-center
        gap-6
        shadow-[0_2px_12px_rgba(79,70,229,0.04)]
      "
    >
      {/* LEFT SIDE */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {greeting},{" "}
          <span className="text-indigo-700">
            {user?.name || "Student"}
          </span>{" "}
          👋
        </h1>

        <div className="flex items-center gap-2 mt-1.5 text-slate-500">
          <CalendarDays
            size={16}
            className="text-indigo-500"
          />

          <span className="text-sm">
            {today}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* SEARCH */}
        <div
          className="relative"
          ref={searchRef}
        >
          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-indigo-400
            "
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
              setSelectedResultIndex(0);
            }}
            onFocus={() => {
              if (searchTerm.trim()) {
                setShowSearchResults(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
            className="
              w-72
              pl-11
              pr-10
              py-2.5
              rounded-2xl
              bg-indigo-50/70
              border
              border-indigo-100
              text-slate-700
              placeholder:text-slate-400
              focus:bg-white
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
              focus:outline-none
              transition-all
            "
          />

          {searchTerm && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearchTerm("");
                setShowSearchResults(false);
                setSelectedResultIndex(0);
              }}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-slate-400
                hover:text-indigo-600
              "
            >
              <X size={17} />
            </button>
          )}

          {showSearchResults &&
            searchTerm.trim() && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  mt-2
                  w-80
                  bg-white
                  border
                  border-indigo-100
                  rounded-2xl
                  shadow-xl
                  z-[100]
                  overflow-hidden
                "
              >
                <div className="px-4 py-3 border-b border-indigo-50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                    Search results
                  </p>
                </div>

                {filteredPages.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto py-2">
                    {filteredPages.map(
                      (page, index) => {
                        const Icon = page.icon;

                        return (
                          <button
                            type="button"
                            key={page.path}
                            onClick={() =>
                              handleSearchSelect(
                                page.path
                              )
                            }
                            onMouseEnter={() =>
                              setSelectedResultIndex(
                                index
                              )
                            }
                            className={`
                              w-full
                              flex
                              items-center
                              gap-3
                              px-4
                              py-3
                              text-left
                              transition
                              ${
                                selectedResultIndex ===
                                index
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                              }
                            `}
                          >
                            <Icon size={18} />

                            <span>
                              {page.name}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="px-4 py-5 text-sm text-slate-500">
                    No matching pages found.
                  </p>
                )}
              </div>
            )}
        </div>

        {/* NOTIFICATIONS */}
        <div
          className="relative"
          ref={notificationRef}
        >
          <button
            type="button"
            aria-label={`Notifications${
              unreadCount
                ? `, ${unreadCount} unread`
                : ""
            }`}
            aria-expanded={
              showNotifications
            }
            onClick={() => {
              setShowNotifications(
                (previous) => !previous
              );

              setShowProfileMenu(false);
            }}
            className="
              relative
              p-3
              rounded-2xl
              text-indigo-600
              bg-indigo-50/70
              border
              border-indigo-100
              hover:bg-indigo-100
              hover:border-indigo-200
              transition-all
            "
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-5
                  h-5
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-center
                  ring-2
                  ring-white
                "
              >
                {unreadCount > 9
                  ? "9+"
                  : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3
                w-80
                sm:w-96
                max-w-[90vw]
                bg-white
                border
                border-indigo-100
                rounded-2xl
                shadow-2xl
                z-[100]
                overflow-hidden
              "
            >
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-indigo-50">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>

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
                      onClick={
                        markAllNotificationsRead
                      }
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}

                  <button
                    type="button"
                    aria-label="Close notifications"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="
                      p-1
                      rounded-lg
                      text-slate-400
                      hover:bg-indigo-50
                      hover:text-indigo-700
                    "
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Bell
                      size={22}
                      className="text-indigo-600"
                    />
                  </div>

                  <p className="font-medium text-slate-700">
                    No study reminders right now
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Pending sessions due today or
                    within the next 7 days, and
                    overdue sessions, will appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map(
                    (notification) => {
                      const isRead =
                        readNotificationIds.includes(
                          notification.id
                        );

                      return (
                        <button
                          type="button"
                          key={
                            notification.id
                          }
                          onClick={() =>
                            openNotification(
                              notification
                            )
                          }
                          className={`
                            w-full
                            text-left
                            px-5
                            py-4
                            flex
                            gap-3
                            hover:bg-indigo-50
                            transition
                            ${
                              isRead
                                ? "bg-white"
                                : "bg-indigo-50/60"
                            }
                          `}
                        >
                          <div className="mt-1">
                            <span
                              className={`
                                block
                                w-2.5
                                h-2.5
                                rounded-full
                                ${
                                  notification.type ===
                                  "overdue"
                                    ? "bg-red-500"
                                    : notification.type ===
                                      "today"
                                    ? "bg-amber-500"
                                    : "bg-indigo-500"
                                }
                              `}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-sm text-slate-800">
                                {
                                  notification.topic
                                }
                              </p>

                              {!isRead && (
                                <span className="text-xs font-medium text-indigo-600">
                                  New
                                </span>
                              )}
                            </div>

                            {notification.subjectName && (
                              <p className="text-xs text-slate-500 mt-1">
                                {
                                  notification.subjectName
                                }
                              </p>
                            )}

                            <p className="text-sm text-slate-600 mt-1">
                              {
                                notification.message
                              }
                            </p>

                            <p className="text-xs text-indigo-600 mt-2">
                              Open study planner →
                            </p>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div
          className="relative"
          ref={profileRef}
        >
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={
              showProfileMenu
            }
            onClick={() => {
              setShowProfileMenu(
                (previous) => !previous
              );

              setShowNotifications(false);
            }}
            className="
              flex
              items-center
              gap-3
              hover:bg-indigo-50
              rounded-2xl
              px-3
              py-2
              transition-all
            "
          >
            <div
              className="
                w-11
                h-11
                rounded-full
                overflow-hidden
                bg-gradient-to-br
                from-indigo-600
                to-violet-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                flex-shrink-0
                ring-2
                ring-indigo-100
                ring-offset-2
              "
            >
              {user?.profileImage ? (
                <img
                  src={`http://localhost:5000${user.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"
              )}
            </div>

            <div className="text-left">
              <p className="font-semibold text-slate-800">
                {user?.name || "Student"}
              </p>

              <p className="text-xs text-indigo-500">
                Student
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`
                text-indigo-400
                transition-transform
                ${
                  showProfileMenu
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {showProfileMenu && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3
                w-60
                bg-white
                border
                border-indigo-100
                rounded-2xl
                shadow-xl
                z-[100]
                overflow-hidden
              "
            >
              <div className="px-4 py-4 border-b border-indigo-50">
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
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-slate-700
                    hover:bg-indigo-50
                    hover:text-indigo-700
                    transition
                  "
                >
                  <Settings size={18} />

                  <span>
                    Settings
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                    text-red-600
                    hover:bg-red-50
                    transition
                  "
                >
                  <LogOut size={18} />

                  <span>
                    Logout
                  </span>
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