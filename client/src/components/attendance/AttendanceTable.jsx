function AttendanceTable({ records, onEdit, onDelete }) {

  const getPercentage = (r) =>
    r.total === 0
      ? 0
      : Math.round((r.attended / r.total) * 100);

  const getColor = (percent) => {
    if (percent >= 85) return "text-emerald-600";
    if (percent >= 75) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="p-4">Subject</th>
            <th className="p-4">Attended</th>
            <th className="p-4">Total</th>
            <th className="p-4">Percentage</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>

          {records.map((r) => {

            const percent = getPercentage(r);

            return (
              <tr key={r._id} className="border-t">

                <td className="p-4 font-semibold">
                  {r.subjectId?.name}
                </td>

                <td className="p-4">
                  {r.attended}
                </td>

                <td className="p-4">
                  {r.total}
                </td>

                <td className={`p-4 font-bold ${getColor(percent)}`}>
                  {percent}%
                </td>

                <td className="p-4 flex gap-3">

                  <button
                    onClick={() => onEdit(r)}
                    className="text-indigo-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(r._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}

export default AttendanceTable;