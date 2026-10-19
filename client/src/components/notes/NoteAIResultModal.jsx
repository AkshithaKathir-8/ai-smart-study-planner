import { X, Sparkles, BookOpen } from "lucide-react";

function formatSummary(text) {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = null;

  lines.forEach((line) => {
    const headingMatch = line.match(/^#{1,3}\s*(.+)$/);

    if (headingMatch) {
      currentSection = {
        title: headingMatch[1].trim(),
        items: [],
      };

      sections.push(currentSection);
      return;
    }

    if (!currentSection) {
      currentSection = {
        title: "Summary",
        items: [],
      };

      sections.push(currentSection);
    }

    const cleanedLine = line
      .replace(/^[-•*]\s*/, "")
      .trim();

    if (cleanedLine) {
      currentSection.items.push(cleanedLine);
    }
  });

  return sections;
}

function SummarySection({ section, index }) {
  return (
    <section
      className={`rounded-2xl border p-5 ${
        index === 0
          ? "bg-indigo-50/60 border-indigo-100"
          : "bg-white border-slate-200"
      }`}
    >
      <h3 className="text-base font-bold text-slate-800">
        {section.title}
      </h3>

      <div className="mt-3 space-y-2.5">
        {section.items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="flex gap-3 text-slate-600 leading-7"
          >
            <span className="mt-3 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />

            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NoteAIResultModal({
  open,
  onClose,
  type,
  note,
  loading,
}) {
  if (!open) return null;

  const isSummary = type === "summary";

  const summarySections =
    isSummary
      ? formatSummary(note?.aiSummary)
      : [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-white">

          <div className="flex items-center gap-3">

            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              {isSummary ? (
                <Sparkles size={22} />
              ) : (
                <BookOpen size={22} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isSummary
                  ? "Kortex AI Summary"
                  : "2-Mark Questions"}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {note?.title}
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 disabled:opacity-40"
          >
            <X size={20} />
          </button>

        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-145px)]">

          {loading ? (
            <div className="py-20 text-center">

              <div className="w-11 h-11 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

              <p className="mt-5 text-slate-700 font-semibold">
                Kortex AI is preparing your revision material...
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Reading the uploaded study material.
              </p>

            </div>
          ) : isSummary ? (

            <div className="space-y-4">

              {/* Summary intro */}
              <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                <Sparkles size={16} />
                AI-generated revision notes
              </div>

              {summarySections.length > 0 ? (
                summarySections.map(
                  (section, index) => (
                    <SummarySection
                      key={index}
                      section={section}
                      index={index}
                    />
                  )
                )
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 text-slate-600 whitespace-pre-line">
                  {note?.aiSummary ||
                    "No summary has been generated yet."}
                </div>
              )}

            </div>

          ) : (

            /* 2-Mark Questions */
            <div className="space-y-4">

              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mb-2">
                <BookOpen size={16} />
                Exam-focused questions
              </div>

              {note?.twoMarkQuestions?.length > 0 ? (
                note.twoMarkQuestions.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition"
                    >

                      <div className="flex gap-3">

                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>

                        <div className="flex-1">

                          <p className="font-semibold text-slate-800 leading-6">
                            {item.question}
                          </p>

                          <div className="mt-4 bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">

                            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-1">
                              Answer
                            </p>

                            <p className="text-slate-700 leading-6">
                              {item.answer}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )
              ) : (
                <div className="text-center py-12 text-slate-500">
                  No questions have been generated yet.
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">

          <p className="text-xs text-slate-400">
            Generated from your uploaded study material
          </p>

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

export default NoteAIResultModal;