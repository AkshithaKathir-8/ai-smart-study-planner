import { useState } from "react";

import {
  X,
  BookOpen,
  GraduationCap,
  Palette,
  Sparkles,
} from "lucide-react";

function AddSubjectModal({
  open,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("");
  const [color, setColor] = useState("blue");

  const [errors, setErrors] =
    useState({});

  if (!open) return null;

  const handleSave = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name =
        "Subject name is required";
    }

    if (
      !credits ||
      Number(credits) <= 0
    ) {
      newErrors.credits =
        "Credits must be greater than 0";
    }

    if (
      Object.keys(newErrors).length > 0
    ) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onSave({
      name: name.trim(),
      code: code.trim(),
      credits: Number(credits),
      color,
    });

    setName("");
    setCode("");
    setCredits("");
    setColor("blue");
  };

  const colorOptions = [
    {
      name: "orange",
      className: "bg-orange-500",
    },
    {
      name: "blue",
      className: "bg-blue-500",
    },
    {
      name: "emerald",
      className: "bg-emerald-500",
    },
    {
      name: "purple",
      className: "bg-purple-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-7 py-6 text-white">

          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <BookOpen size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Add New Subject
                </h2>

                <p className="mt-1 text-sm text-indigo-100">
                  Add a course to your academic workspace
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={19} />
            </button>

          </div>

          <div className="relative mt-4 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-indigo-50 backdrop-blur-sm">
            <Sparkles size={15} />
            Organize your academic subjects in one place
          </div>

        </div>

        {/* Form */}
        <div className="space-y-5 p-7">

          {/* Subject Name */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject Name
            </label>

            <div className="relative">

              <BookOpen
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. Data Structures"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

            </div>

            {errors.name && (
              <p className="mt-2 text-xs text-red-500">
                {errors.name}
              </p>
            )}

          </div>

          {/* Code + Credits */}
          <div className="grid gap-5 sm:grid-cols-2">

            {/* Subject Code */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Subject Code
                <span className="font-normal text-slate-400">
                  {" "} (optional)
                </span>
              </label>

              <input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder="e.g. CS3401"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

            </div>

            {/* Credits */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Credits
              </label>

              <div className="relative">

                <GraduationCap
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  min="1"
                  value={credits}
                  onChange={(e) =>
                    setCredits(e.target.value)
                  }
                  placeholder="e.g. 4"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

              </div>

              {errors.credits && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.credits}
                </p>
              )}

            </div>

          </div>

          {/* Theme Color */}
          <div>

            <div className="mb-3 flex items-center gap-2">

              <Palette
                size={17}
                className="text-slate-500"
              />

              <label className="text-sm font-semibold text-slate-700">
                Theme Color
              </label>

            </div>

            <div className="flex gap-4">

              {colorOptions.map((item) => (

                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setColor(item.name)
                  }
                  className={`
                    h-10
                    w-10
                    rounded-full
                    ${item.className}
                    transition-all
                    ${
                      color === item.name
                        ? "scale-110 ring-4 ring-slate-200"
                        : "hover:scale-105"
                    }
                  `}
                  aria-label={`Select ${item.name} theme`}
                />

              ))}

            </div>

          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300"
            >
              Save Subject
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AddSubjectModal;