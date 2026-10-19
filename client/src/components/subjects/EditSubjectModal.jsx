import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  BookOpen,
  GraduationCap,
  Palette,
  Hash,
  Sparkles,
} from "lucide-react";

function EditSubjectModal({
  open,
  onClose,
  subject,
  onUpdate,
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState("");
  const [color, setColor] = useState("blue");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subject) {
      setName(subject.name || "");
      setCode(subject.code || "");
      setCredits(subject.credits || "");
      setColor(subject.color || "blue");
      setErrors({});
    }
  }, [subject]);

  const handleUpdate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Subject name is required";
    }

    if (!credits || Number(credits) <= 0) {
      newErrors.credits = "Credits must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onUpdate({
      ...subject,
      name: name.trim(),
      code: code.trim(),
      credits: Number(credits),
      color,
    });

    onClose();
  };

  const colorOptions = [
    {
      name: "orange",
      label: "Orange",
      className: "bg-orange-500",
      ring: "ring-orange-200",
    },
    {
      name: "blue",
      label: "Blue",
      className: "bg-blue-500",
      ring: "ring-blue-200",
    },
    {
      name: "emerald",
      label: "Emerald",
      className: "bg-emerald-500",
      ring: "ring-emerald-200",
    },
    {
      name: "purple",
      label: "Purple",
      className: "bg-purple-500",
      ring: "ring-purple-200",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-7 py-7 text-white">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <BookOpen size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Edit Subject
                    </h2>

                    <p className="mt-1 text-sm text-indigo-100">
                      Update your course information
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

              <div className="relative mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-indigo-50 backdrop-blur-sm">
                <Sparkles size={16} />
                Keep your subject details up to date
              </div>
            </div>

            {/* Body */}
            <div className="space-y-6 p-7">
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
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Data Structures"
                    className={`w-full rounded-2xl border bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100 ${
                      errors.name
                        ? "border-red-300 focus:border-red-400"
                        : "border-slate-200 focus:border-indigo-500"
                    }`}
                  />
                </div>

                {errors.name && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Subject Code + Credits */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Subject Code
                  </label>

                  <div className="relative">
                    <Hash
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. CS301"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

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
                      className={`w-full rounded-2xl border bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-100 ${
                        errors.credits
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-indigo-500"
                      }`}
                    />
                  </div>

                  {errors.credits && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.credits}
                    </p>
                  )}
                </div>
              </div>

              {/* Theme Color */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50">
                    <Palette
                      size={16}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Theme Color
                    </p>

                    <p className="text-xs text-slate-400">
                      Choose how this subject appears across Kortex
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  {colorOptions.map((item) => {
                    const selected = color === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setColor(item.name)}
                        title={item.label}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                          selected
                            ? `ring-4 ${item.ring} scale-110`
                            : "hover:scale-105"
                        }`}
                      >
                        <span
                          className={`h-7 w-7 rounded-full ${item.className} shadow-sm`}
                        />
                      </button>
                    );
                  })}
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
                  onClick={handleUpdate}
                  className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300"
                >
                  Update Subject
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default EditSubjectModal;