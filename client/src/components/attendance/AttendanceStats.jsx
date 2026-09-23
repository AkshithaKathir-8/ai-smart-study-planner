function AttendanceStats({ records }) {

  const totalClasses = records.reduce(
    (acc, r) => acc + r.total,
    0
  );

  const totalAttended = records.reduce(
    (acc, r) => acc + r.attended,
    0
  );

  const overall =
    totalClasses === 0
      ? 0
      : Math.round((totalAttended / totalClasses) * 100);

  const getStatusColor = () => {
    if (overall >= 85) return "text-emerald-600";
    if (overall >= 75) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <p className="text-slate-500">Total Classes</p>
        <h2 className="text-2xl font-bold mt-2">
          {totalClasses}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <p className="text-slate-500">Attended</p>
        <h2 className="text-2xl font-bold mt-2">
          {totalAttended}
        </h2>
      </div>

      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <p className="text-slate-500">Overall Attendance</p>
        <h2 className={`text-2xl font-bold mt-2 ${getStatusColor()}`}>
          {overall}%
        </h2>
      </div>

    </div>
  );
}

export default AttendanceStats;