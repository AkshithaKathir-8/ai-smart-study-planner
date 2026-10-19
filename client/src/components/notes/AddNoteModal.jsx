import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  Upload,
  FileText,
  BookOpen,
  AlignLeft,
  Pin,
  Sparkles,
  Trash2,
} from "lucide-react";

import { useSubjects } from "../../context/SubjectContext";

function AddNoteModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const { subjects } = useSubjects();

  const emptyNote = {
    title: "",
    subject: "",
    description: "",
    pinned: false,
  };

  const [note, setNote] =
    useState(emptyNote);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setError("");

    if (initialData) {
      setNote({
        title: initialData.title || "",
        subject: initialData.subject || "",
        description:
          initialData.description || "",
        pinned:
          initialData.pinned || false,
      });

      setSelectedFile(null);
    } else {
      setNote({
        ...emptyNote,
      });

      setSelectedFile(null);
    }
  }, [initialData, open]);

  const updateField = (field, value) => {
    setNote((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a PDF, DOCX, or TXT file."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "File size must be less than 10 MB."
      );

      e.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note.subject) {
      setError(
        "Please select a subject from your existing subjects."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave(
        note,
        selectedFile
      );
    } catch (submitError) {
      console.error(
        "NOTE MODAL SAVE ERROR:",
        submitError
      );
    } finally {
      setSaving(false);
    }
  };

  const hasSubjects =
    Array.isArray(subjects) &&
    subjects.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={() => {
              if (!saving) {
                onClose();
              }
            }}
          />

          {/* MODAL */}
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
            className="
              relative
              w-full max-w-2xl
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >
            {/* HEADER */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-7 py-7 text-white">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

              <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    {initialData ? (
                      <FileText size={23} />
                    ) : (
                      <BookOpen size={23} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {initialData
                        ? "Edit Note"
                        : "Create New Note"}
                    </h2>

                    <p className="mt-1 text-sm text-indigo-100">
                      {initialData
                        ? "Update your study material and note details"
                        : "Save your notes and study material in one place"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="relative mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-indigo-50 backdrop-blur-sm">
                <Sparkles size={16} />
                {initialData
                  ? "Keep your study library up to date"
                  : "Create organized notes for faster revision"}
              </div>
            </div>

            {/* BODY */}
            <form
              onSubmit={handleSubmit}
              className="max-h-[72vh] space-y-6 overflow-y-auto p-7"
            >
              {/* ERROR */}
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Note Title
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={note.title}
                    onChange={(e) =>
                      updateField(
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Database Management Systems"
                    className="
                      w-full
                      rounded-2xl
                      border border-slate-200
                      bg-slate-50
                      py-3.5
                      pl-11 pr-4
                      text-sm text-slate-700
                      outline-none
                      transition
                      focus:border-indigo-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-indigo-100
                    "
                    required
                  />
                </div>
              </div>

              {/* SUBJECT */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50">
                    <BookOpen
                      size={16}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Subject
                    </p>

                    <p className="text-xs text-slate-400">
                      Select one of your existing subjects
                    </p>
                  </div>
                </div>

                <select
                  value={note.subject}
                  onChange={(e) =>
                    updateField(
                      "subject",
                      e.target.value
                    )
                  }
                  disabled={!hasSubjects}
                  className="
                    w-full
                    rounded-2xl
                    border border-slate-200
                    bg-slate-50
                    px-4 py-3.5
                    text-sm text-slate-700
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:bg-white
                    focus:ring-4 focus:ring-indigo-100
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                  required
                >
                  <option value="">
                    Select a subject
                  </option>

                  {Array.isArray(subjects) &&
                    subjects.map((subject) => {
                      const subjectName =
                        typeof subject === "string"
                          ? subject
                          : subject?.name;

                      if (!subjectName) {
                        return null;
                      }

                      return (
                        <option
                          key={
                            subject?._id ||
                            subject?.id ||
                            subjectName
                          }
                          value={subjectName}
                        >
                          {subjectName}
                        </option>
                      );
                    })}
                </select>

                {!hasSubjects && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    No subjects available. Please add a subject first.
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50">
                    <AlignLeft
                      size={16}
                      className="text-violet-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Note Content
                    </p>

                    <p className="text-xs text-slate-400">
                      Add your own notes or explanation
                    </p>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={note.description}
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Write your notes here..."
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border border-slate-200
                    bg-slate-50
                    px-4 py-3.5
                    text-sm leading-6 text-slate-700
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-indigo-500
                    focus:bg-white
                    focus:ring-4 focus:ring-indigo-100
                  "
                />
              </div>

              {/* FILE UPLOAD */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50">
                    <Upload
                      size={16}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {initialData
                        ? "Replace Study Material"
                        : "Upload Study Material"}
                    </p>

                    <p className="text-xs text-slate-400">
                      PDF, DOCX or TXT · Max 10 MB
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40">
                  {!selectedFile ? (
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div className="flex flex-col items-center justify-center py-5 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                          <Upload size={21} />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          Choose a study file
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Upload PDF, DOCX or TXT
                        </p>

                        <span className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                          Choose File
                        </span>
                      </div>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <FileText size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {selectedFile.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {(
                              selectedFile.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={
                          removeSelectedFile
                        }
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* PIN */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={note.pinned}
                  onChange={(e) =>
                    updateField(
                      "pinned",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-indigo-600"
                />

                <div className="flex items-center gap-2">
                  <Pin
                    size={16}
                    className="text-amber-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Pin this note
                    </p>

                    <p className="text-xs text-slate-400">
                      Keep important study material easy to find
                    </p>
                  </div>
                </div>
              </label>

              {/* BUTTONS */}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    px-5 py-3.5
                    text-sm font-semibold text-slate-600
                    transition
                    hover:border-slate-300
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving || !hasSubjects
                  }
                  className="
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-600
                    to-violet-600
                    px-5 py-3.5
                    text-sm font-semibold text-white
                    shadow-lg shadow-indigo-200
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:shadow-xl hover:shadow-indigo-300
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    disabled:hover:translate-y-0
                  "
                >
                  {saving
                    ? "Saving..."
                    : initialData
                    ? selectedFile
                      ? "Replace & Save"
                      : "Save Changes"
                    : selectedFile
                    ? "Upload & Save"
                    : "Save Note"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddNoteModal;