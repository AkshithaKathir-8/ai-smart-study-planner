function NotesStats({ notes }) {

  const totalNotes = notes.length;

  const pinnedNotes = notes.filter(
    (note) => note.pinned
  ).length;

  const subjects = new Set(
    notes.map((note) => note.subject)
  ).size;

  const recent = notes.filter(
    (note) => note.updatedAt === "Today"
  ).length;

  const stats = [

    {
      title: "Total Notes",
      value: totalNotes,
    },

    {
      title: "Pinned",
      value: pinnedNotes,
    },

    {
      title: "Subjects",
      value: subjects,
    },

    {
      title: "Updated Today",
      value: recent,
    },

  ];

  return (

    <div className="grid md:grid-cols-4 gap-6">

      {stats.map((item) => (

        <div
          key={item.title}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
        >

          <p className="text-slate-500">
            {item.title}
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {item.value}
          </h2>

        </div>

      ))}

    </div>

  );

}

export default NotesStats;