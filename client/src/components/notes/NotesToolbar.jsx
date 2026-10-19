import {
  Search,
  SlidersHorizontal,
  Pin,
  BookOpen,
} from "lucide-react";

function NotesToolbar({
  search,
  setSearch,
  filter,
  setFilter,
  subjectFilters = [],
}) {
  const filters = [
    {
      value: "All",
      label: "All Notes",
      icon: SlidersHorizontal,
    },
    {
      value: "Pinned",
      label: "Pinned",
      icon: Pin,
    },
    ...subjectFilters.map((subject) => ({
      value: subject,
      label: subject,
      icon: BookOpen,
    })),
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* SEARCH */}
      <div className="relative">
        <Search
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by title, subject or note content..."
          className="
            w-full
            rounded-2xl
            border border-slate-200
            bg-slate-50
            py-3.5
            pl-11 pr-5
            text-sm text-slate-700
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-indigo-500
            focus:bg-white
            focus:ring-4
            focus:ring-indigo-100
          "
        />
      </div>

      {/* FILTERS */}
      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal
            size={16}
            className="text-slate-400"
          />

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Filter Notes
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {filters.map((item) => {
            const Icon = item.icon;
            const active = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setFilter(item.value)
                }
                className={`
                  flex items-center gap-2
                  rounded-xl
                  px-4 py-2.5
                  text-sm font-semibold
                  transition-all duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
                      : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }
                `}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NotesToolbar;