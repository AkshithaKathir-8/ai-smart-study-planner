import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  FileText,
  Sparkles,
  Brain,
  BookOpen,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import NoteCard from "../../components/notes/NoteCard";
import NotesStats from "../../components/notes/NotesStats";
import NotesToolbar from "../../components/notes/NotesToolbar";
import AddNoteModal from "../../components/notes/AddNoteModal";
import NoteAIResultModal from "../../components/notes/NoteAIResultModal";

import { useNotes } from "../../context/NotesContext";

function Notes() {
  const navigate = useNavigate();

  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    generateNoteSummary,
    generateTwoMarkQuestions,
    generateNoteQuiz,
  } = useNotes();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [openModal, setOpenModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState("summary");
  const [selectedAINote, setSelectedAINote] = useState(null);
  const [aiLoading, setAILoading] = useState(false);

  const subjectFilters = useMemo(() => {
    const subjects = [
      ...new Set(
        notes
          .map((note) => note.subject)
          .filter(Boolean)
      ),
    ];

    return subjects;
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return notes.filter((note) => {
      const title =
        note.title?.toLowerCase() || "";

      const subject =
        note.subject?.toLowerCase() || "";

      const description =
        note.description?.toLowerCase() || "";

      const extractedText =
        note.extractedText?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        subject.includes(searchValue) ||
        description.includes(searchValue) ||
        extractedText.includes(searchValue);

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Pinned"
          ? Boolean(note.pinned)
          : note.subject === filter;

      return matchesSearch && matchesFilter;
    });
  }, [notes, search, filter]);

  const handleSave = async (note, file = null) => {
    try {
      if (editingNote) {
        await updateNote(
          {
            ...note,
            _id: editingNote._id,
          },
          file
        );

        toast.success(
          file
            ? "Study material replaced!"
            : "Note updated!"
        );
      } else {
        await addNote(note, file);

        toast.success(
          file
            ? "Study material uploaded!"
            : "Note added!"
        );
      }

      setEditingNote(null);
      setOpenModal(false);
    } catch (error) {
      console.error("NOTE SAVE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save note."
      );

      throw error;
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) {
      return;
    }

    try {
      await deleteNote(id);

      toast.success("Note deleted!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete note."
      );
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await togglePin(id);

      toast.success("Pin updated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update pin."
      );
    }
  };

  const handleGenerateSummary = async (note) => {
    try {
      setSelectedAINote(note);
      setAiModalType("summary");
      setAiModalOpen(true);
      setAILoading(true);

      const result =
        await generateNoteSummary(note._id);

      setSelectedAINote(result.note);

      toast.success(
        "AI summary generated!"
      );
    } catch (error) {
      console.error(
        "SUMMARY UI ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to generate summary."
      );

      setAiModalOpen(false);
    } finally {
      setAILoading(false);
    }
  };

  const handleGenerateQuestions = async (note) => {
    try {
      setSelectedAINote(note);
      setAiModalType("questions");
      setAiModalOpen(true);
      setAILoading(true);

      const result =
        await generateTwoMarkQuestions(
          note._id
        );

      setSelectedAINote(result.note);

      toast.success(
        "2-mark questions generated!"
      );
    } catch (error) {
      console.error(
        "QUESTIONS UI ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to generate questions."
      );

      setAiModalOpen(false);
    } finally {
      setAILoading(false);
    }
  };

  const handleGenerateQuiz = async (note) => {
    try {
      toast.loading(
        "Generating quiz from your study material...",
        {
          id: "note-quiz",
        }
      );

      const result =
        await generateNoteQuiz(note._id);

      toast.success(
        "Quiz generated successfully!",
        {
          id: "note-quiz",
        }
      );

      navigate("/ai-quiz", {
        state: {
          generatedQuiz: result.quiz,
          source: result.source,
        },
      });
    } catch (error) {
      console.error(
        "NOTE QUIZ UI ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to generate quiz from study material.",
        {
          id: "note-quiz",
        }
      );
    }
  };

  const openNewNote = () => {
    setEditingNote(null);
    setOpenModal(true);
  };

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <PageHeader
            title="Notes"
            subtitle="Organize your study material and turn it into active learning."
          />

          <button
            type="button"
            onClick={openNewNote}
            className="
              group
              flex items-center justify-center gap-2
              rounded-2xl
              bg-gradient-to-r from-indigo-600 to-violet-600
              px-6 py-3.5
              text-sm font-semibold text-white
              shadow-lg shadow-indigo-200
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-xl hover:shadow-indigo-300
            "
          >
            <Plus
              size={19}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
            Add Note
          </button>
        </div>

        {/* OVERVIEW BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-lg">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 left-20 h-44 w-44 rounded-full bg-white/5" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <FileText size={22} />
                </div>

                <div>
                  <p className="text-sm font-medium text-indigo-100">
                    Your Study Library
                  </p>

                  <h2 className="text-2xl font-bold">
                    Keep your learning material organized
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-indigo-100">
                Upload study materials, generate AI summaries,
                create 2-mark questions, and turn your notes
                directly into quizzes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles size={16} />
                  AI Summary
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen size={16} />
                  2-Mark Practice
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Brain size={16} />
                  AI Quiz
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <NotesStats notes={notes} />

        {/* TOOLBAR */}
        <NotesToolbar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          subjectFilters={subjectFilters}
        />

        {/* RESULT HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {filter === "All"
                ? "All Notes"
                : filter === "Pinned"
                ? "Pinned Notes"
                : filter}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1
                ? "note"
                : "notes"}{" "}
              found
            </p>
          </div>

          {(search || filter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* NOTES GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                onGenerateSummary={
                  handleGenerateSummary
                }
                onGenerateQuestions={
                  handleGenerateQuestions
                }
                onGenerateQuiz={
                  handleGenerateQuiz
                }
              />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
                <FileText
                  size={36}
                  className="text-indigo-500"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-800">
                {search || filter !== "All"
                  ? "No matching notes"
                  : "Your notes library is empty"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search || filter !== "All"
                  ? "Try another search term or clear the current filters."
                  : "Create your first note or upload study material to start building your study library."}
              </p>

              {search || filter !== "All" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                  className="mt-7 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openNewNote}
                  className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus size={18} />
                  Add Your First Note
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT NOTE MODAL */}
      <AddNoteModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingNote(null);
        }}
        onSave={handleSave}
        initialData={editingNote}
      />

      {/* AI RESULT MODAL */}
      <NoteAIResultModal
        open={aiModalOpen}
        onClose={() => {
          if (!aiLoading) {
            setAiModalOpen(false);
            setSelectedAINote(null);
          }
        }}
        type={aiModalType}
        note={selectedAINote}
        loading={aiLoading}
      />
    </MainLayout>
  );
}

export default Notes;