import { useEffect, useState } from "react";
import {
  X,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";

import { useSubjects } from "../../context/SubjectContext";

function AddAttendanceModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const { subjects } = useSubjects();

  const [formData, setFormData] = useState({
    subjectId: "",
    attended: 0,
    total: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectId:
          initialData.subjectId?._id ||
          initialData.subjectId ||
          "",
        attended: initialData.attended,
        total: initialData.total,
      });
    } else {
      setFormData({
        subjectId: "",
        attended: 0,
        total: 0,
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.subjectId) {
      alert("Please select a subject");
      return;
    }

    if (formData.attended < 0 || formData.total < 0) {
      alert("Attendance values cannot be negative");
      return;
    }

    if (formData.attended > formData.total) {
      alert(
        "Attended classes cannot exceed Total classes"
      );
      return;
    }

    onSave(formData);
  };

  const previewPercentage =
    formData.total === 0
      ? 0
      : Math.round(
          (formData.attended / formData.total) * 100
        );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <ClipboardCheck
                size={21}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {initialData
                  ? "Edit Attendance"
                  : "Add Attendance"}
              </h2>

              <p className="text-sm text-slate-400 mt-0.5">
                Update your subject attendance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 space-y-5">

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subject
            </label>

            <div className="relative">
              <BookOpen
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className="w-full appearance-none border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="">
                  Select Subject
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendance inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Classes Attended
              </label>

              <input
                type="number"
                min="0"
                name="attended"
                value={formData.attended}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Total Classes
              </label>

              <input
                type="number"
                min="0"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Attendance Preview
                </p>

                <p className="text-3xl font-bold text-indigo-700 mt-1">
                  {previewPercentage}%
                </p>
              </div>

              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <ClipboardCheck
                  size={25}
                  className="text-indigo-600"
                />
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    previewPercentage,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl py-3.5 font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            {initialData
              ? "Update Attendance"
              : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAttendanceModal;