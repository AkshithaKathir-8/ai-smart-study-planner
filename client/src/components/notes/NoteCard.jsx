import {
  Pin,
  Pencil,
  Trash2,
  FileText,
  Sparkles,
  BookOpen,
  Brain,
  CalendarDays,
} from "lucide-react";

function formatUpdatedDate(dateValue) {
  if (!dateValue) {
    return "Updated recently";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Updated recently";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const noteDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const difference = Math.floor(
    (today - noteDate) /
      (1000 * 60 * 60 * 24)
  );

  if (difference === 0) {
    return "Updated today";
  }

  if (difference === 1) {
    return "Updated yesterday";
  }

  if (difference < 7) {
    return `Updated ${difference} days ago`;
  }

  return `Updated ${date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  )}`;
}

function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onGenerateSummary,
  onGenerateQuestions,
  onGenerateQuiz,
}) {
  const hasUploadedFile = Boolean(
    note.fileName
  );

  const displayText =
    note.description?.trim() ||
    note.extractedText?.trim() ||
    "No note content added yet.";

  return (
    <div
      className="
        group
        flex h-full flex-col
        overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
      "
    >
      {/* TOP ACCENT */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600" />

      <div className="flex flex-1 flex-col p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
              <BookOpen size={12} />
              {note.subject || "Study Note"}
            </div>

            <h2 className="truncate text-xl font-bold text-slate-800">
              {note.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              onTogglePin(note._id)
            }
            aria-label={
              note.pinned
                ? "Unpin note"
                : "Pin note"
            }
            className={`
              flex h-9 w-9 flex-shrink-0
              items-center justify-center
              rounded-xl
              transition
              ${
                note.pinned
                  ? "bg-amber-100 text-amber-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }
            `}
          >
            <Pin
              size={17}
              fill={
                note.pinned
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>

        {/* FILE */}
        {hasUploadedFile && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-3.5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <FileText size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-indigo-700">
                {note.fileName}
              </p>

              <p className="mt-0.5 text-xs text-indigo-500">
                {note.fileType
                  ? `${note.fileType
                      .replace(".", "")
                      .toUpperCase()} study material`
                  : "Uploaded study material"}
              </p>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="mt-5">
          <p className="line-clamp-5 whitespace-pre-line text-sm leading-7 text-slate-600">
            {displayText}
          </p>
        </div>

        {/* AI STATUS */}
        {note.extractedText && (
          <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600">
            <Sparkles size={13} />
            AI-ready study material
          </div>
        )}

        {/* AI ACTIONS */}
        {note.extractedText && (
          <div className="mt-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  onGenerateSummary(note)
                }
                className="
                  group/action
                  flex items-center justify-center gap-2
                  rounded-xl
                  border border-indigo-200
                  bg-gradient-to-r from-indigo-50 to-indigo-100
                  px-3 py-3
                  text-xs font-semibold text-indigo-700
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                <Sparkles
                  size={16}
                  className="text-indigo-600 transition-transform group-hover/action:scale-110"
                />
                AI Summary
              </button>

              <button
                type="button"
                onClick={() =>
                  onGenerateQuestions(note)
                }
                className="
                  group/action
                  flex items-center justify-center gap-2
                  rounded-xl
                  border border-violet-200
                  bg-gradient-to-r from-violet-50 to-purple-100
                  px-3 py-3
                  text-xs font-semibold text-violet-700
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                <BookOpen
                  size={16}
                  className="text-violet-600 transition-transform group-hover/action:scale-110"
                />
                2-Mark
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onGenerateQuiz(note)
              }
              className="
                group/action
                flex w-full items-center justify-center gap-2
                rounded-xl
                bg-gradient-to-r from-indigo-600 to-violet-600
                px-4 py-3
                text-sm font-semibold text-white
                shadow-md shadow-indigo-100
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-lg hover:shadow-indigo-200
              "
            >
              <Brain
                size={17}
                className="transition-transform group-hover/action:scale-110"
              />
              Generate Quiz
            </button>
          </div>
        )}

        {/* SPACER */}
        <div className="flex-1" />

        {/* FOOTER */}
        <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays size={14} />
            {formatUpdatedDate(note.updatedAt)}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                onEdit(note)
              }
              aria-label="Edit note"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
            >
              <Pencil size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(note._id)
              }
              aria-label="Delete note"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;