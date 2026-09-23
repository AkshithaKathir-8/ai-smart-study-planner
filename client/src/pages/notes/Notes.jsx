import { useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import NoteCard from "../../components/notes/NoteCard";
import NotesStats from "../../components/notes/NotesStats";
import NotesToolbar from "../../components/notes/NotesToolbar";
import AddNoteModal from "../../components/notes/AddNoteModal";

import { useNotes } from "../../context/NotesContext";

function Notes() {

  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
  } = useNotes();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [openModal, setOpenModal] =
    useState(false);

  const [editingNote, setEditingNote] =
    useState(null);

  const filteredNotes = notes.filter((note) => {

    const matchesSearch =
      note.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      note.subject
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      note.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =

      filter === "All"

        ? true

        : filter === "Pinned"

        ? note.pinned

        : note.subject === filter;

    return matchesSearch && matchesFilter;

  });

  const handleSave = (note) => {

    if (editingNote) {

      updateNote({
        ...note,
        _id: editingNote._id,
      });

      toast.success("Note updated!");

    } else {

      addNote(note);

      toast.success("Note added!");

    }

    setEditingNote(null);

    setOpenModal(false);

  };

  const handleEdit = (note) => {

    setEditingNote(note);

    setOpenModal(true);

  };

  const handleDelete = (id) => {

    if (
      window.confirm(
        "Delete this note?"
      )
    ) {

      deleteNote(id);

      toast.success("Note deleted!");

    }

  };

  const handleTogglePin = (id) => {

    togglePin(id);

    toast.success("Pin updated!");

  };

  return (

    <MainLayout>

      <div className="space-y-8">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

          <PageHeader
            title="Notes"
            subtitle="Store your study notes in one place."
          />

          <button
            onClick={() => {

              setEditingNote(null);

              setOpenModal(true);

            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition"
          >
            + Add Note
          </button>

        </div>

        <NotesStats notes={notes} />

        <NotesToolbar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredNotes.length > 0 ? (

            filteredNotes.map((note) => (

              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />

            ))

          ) : (

            <div className="col-span-full bg-white rounded-3xl border border-slate-200 shadow-sm py-16 text-center">

              <div className="text-6xl">
                📝
              </div>

              <h2 className="text-2xl font-bold text-slate-700 mt-5">
                No Notes Found
              </h2>

              <p className="text-slate-500 mt-2">
                Try changing your search or create a new note.
              </p>

              <button
                onClick={() => {

                  setEditingNote(null);

                  setOpenModal(true);

                }}
                className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition"
              >
                + Add Note
              </button>

            </div>

          )}

        </div>

      </div>

      <AddNoteModal
        open={openModal}
        onClose={() => {

          setOpenModal(false);

          setEditingNote(null);

        }}
        onSave={handleSave}
        initialData={editingNote}
      />

    </MainLayout>

  );

}

export default Notes;