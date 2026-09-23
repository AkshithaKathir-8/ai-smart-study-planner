import { useEffect, useState } from "react";
import { X } from "lucide-react";

function AddEventModal({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Study");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setTime(initialData.time || "");
      setType(initialData.type);
      setDescription(initialData.description || "");
      setColor(initialData.color);
    } else {
      setTitle("");
      setDate("");
      setTime("");
      setType("Study");
      setDescription("");
      setColor("blue");
    }

    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const handleSave = () => {
    const newErrors = {};

    if (!title.trim())
      newErrors.title = "Title is required";

    if (!date)
      newErrors.date = "Date is required";

    if (!time)
      newErrors.time = "Time is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({

  _id: initialData?._id,

  title,

  description,

  date,

  time,

  type: type.toLowerCase(),

  color,

});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-2xl font-bold">
            {initialData ? "Edit Event" : "Add Event"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-5">

          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Title"
              className={`w-full rounded-2xl border px-4 py-3 ${
                errors.title
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full rounded-2xl border px-4 py-3 ${
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

            <div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full rounded-2xl border px-4 py-3 ${
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

          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          >
            <option value="study">Study</option>
<option value="assignment">Assignment</option>
<option value="exam">Exam</option>
<option value="personal">Personal</option>
          </select>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          />

          <div>

            <label className="block font-medium mb-3">
              Theme Color
            </label>

            <div className="flex gap-4">

              {["orange","blue","emerald","purple"].map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`w-10 h-10 rounded-full border-4 ${
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

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white rounded-2xl py-3 font-semibold hover:bg-indigo-700 transition"
          >
            {initialData ? "Update Event" : "Save Event"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddEventModal;