import {
  FileText,
  Pin,
  BookOpen,
  Clock3,
} from "lucide-react";

function NotesStats({ notes }) {
  const totalNotes = notes.length;

  const pinnedNotes = notes.filter(
    (note) => note.pinned
  ).length;

  const subjects = new Set(
    notes
      .map((note) => note.subject)
      .filter(Boolean)
  ).size;

  const isToday = (dateValue) => {
    if (!dateValue) {
      return false;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const recent = notes.filter(
    (note) => isToday(note.updatedAt)
  ).length;

  const stats = [
    {
      title: "Total Notes",
      value: totalNotes,
      description: "Study materials saved",
      icon: FileText,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Pinned",
      value: pinnedNotes,
      description: "Important notes",
      icon: Pin,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Subjects",
      value: subjects,
      description: "Subjects covered",
      icon: BookOpen,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Updated Today",
      value: recent,
      description: "Recently updated",
      icon: Clock3,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="
              group
              rounded-3xl
              border border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {item.description}
                </p>
              </div>

              <div
                className={`
                  flex h-11 w-11 items-center justify-center
                  rounded-2xl
                  ${item.iconBg}
                  ${item.iconColor}
                  transition-transform duration-200
                  group-hover:scale-105
                `}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NotesStats;