import { useEffect, useState } from "react";
import { X } from "lucide-react";

function AddPlannerModal({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Pending");
  const [color, setColor] = useState("blue");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject);
      setDate(initialData.date);
      setTime(initialData.time);
      setDuration(initialData.duration);
      setNotes(initialData.notes);
      setStatus(initialData.status);
      setColor(initialData.color);
    } else {
      setSubject("");
      setDate("");
      setTime("");
      setDuration("");
      setNotes("");
      setStatus("Pending");
      setColor("blue");
    }

    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const handleSave = () => {
    const newErrors = {};

    if (!subject.trim())
      newErrors.subject = "Subject is required.";

    if (!date)
      newErrors.date = "Select a date.";

    if (!time)
      newErrors.time = "Select a time.";

    if (!duration.trim())
      newErrors.duration = "Duration is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialData?.id || Date.now(),
      subject,
      date,
      time,
      duration,
      notes,
      status,
      color,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-2xl font-bold">
            {initialData
              ? "Edit Study Session"
              : "Add Study Session"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-5">

          {/* Subject */}

          <div>

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 border ${
                errors.subject
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject}
              </p>
            )}

          </div>
                    {/* Date */}

          <div>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 border ${
                errors.date
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date}
              </p>
            )}

          </div>

          {/* Time */}

          <div>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 border ${
                errors.time
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.time && (
              <p className="text-red-500 text-sm mt-1">
                {errors.time}
              </p>
            )}

          </div>

          {/* Duration */}

          <div>

            <input
              type="text"
              placeholder="Duration (Example: 2 Hours)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`w-full rounded-2xl px-4 py-3 border ${
                errors.duration
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration}
              </p>
            )}

          </div>

          {/* Notes */}

          <div>

            <textarea
              rows={4}
              placeholder="Study Notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 border border-slate-300 resize-none"
            />

          </div>
                    {/* Status */}

          <div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 border border-slate-300"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

          </div>

          {/* Theme Color */}

          <div>

            <label className="block mb-3 font-medium text-slate-700">
              Theme Color
            </label>

            <div className="flex gap-4">

              {["orange", "blue", "emerald", "purple"].map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`w-10 h-10 rounded-full border-4 transition cursor-pointer ${
                    color === item
                      ? "border-slate-900 scale-110"
                      : "border-transparent"
                  } ${
                    item === "orange"
                      ? "bg-orange-500"
                      : item === "blue"
                      ? "bg-blue-500"
                      : item === "emerald"
                      ? "bg-emerald-500"
                      : "bg-purple-500"
                  }`}
                />

              ))}

            </div>

          </div>

          {/* Save Button */}

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white rounded-2xl py-3 font-semibold hover:bg-indigo-700 transition cursor-pointer"
          >
            {initialData
              ? "Update Session"
              : "Save Session"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddPlannerModal;