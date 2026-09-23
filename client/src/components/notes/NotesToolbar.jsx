import { Search } from "lucide-react";

function NotesToolbar({
  search,
  setSearch,
  filter,
  setFilter,
}) {

  const filters = [
    "All",
    "Pinned",
    "Database Management Systems",
    "Operating Systems",
  ];

  return (

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">

      <div className="relative">

        <Search
          size={20}
          className="absolute left-4 top-4 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-5 py-3 rounded-2xl border border-slate-200 outline-none"
        />

      </div>

      <div className="flex flex-wrap gap-3 mt-5">

        {filters.map((item) => (

          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-5 py-2 rounded-xl transition ${
              filter === item
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            {item}
          </button>

        ))}

      </div>

    </div>

  );

}

export default NotesToolbar;