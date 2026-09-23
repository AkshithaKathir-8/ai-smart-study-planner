import { useEffect, useState } from "react";

function AddNoteModal({
  open,
  onClose,
  onSave,
  initialData,
}) {

  const emptyNote = {
    title: "",
    subject: "Database Management Systems",
    description: "",
    pinned: false,
  };

  const [note, setNote] = useState(emptyNote);

  useEffect(() => {

    if (initialData) {
      setNote(initialData);
    } else {
      setNote(emptyNote);
    }

  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(note);
  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-3xl w-full max-w-xl p-8">

        <h2 className="text-2xl font-bold mb-6">

          {initialData ? "Edit Note" : "New Note"}

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Title"
            value={note.title}
            onChange={(e) =>
              setNote({
                ...note,
                title: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3"
            required
          />

          <input
  list="subjects"
  value={note.subject}
  onChange={(e) =>
    setNote({
      ...note,
      subject: e.target.value,
    })
  }
  placeholder="Subject"
  className="w-full border rounded-2xl p-3"
/>

<datalist id="subjects">
  <option value="Database Management Systems" />
  <option value="Operating Systems" />
  <option value="Computer Networks" />
  <option value="Artificial Intelligence" />
  <option value="Java" />
  <option value="Python" />
  <option value="Data Structures" />
</datalist>

          <textarea
            rows="6"
            placeholder="Write your notes..."
            value={note.description}
            onChange={(e) =>
              setNote({
                ...note,
                description: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3 resize-none"
          />

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={note.pinned}
              onChange={(e) =>
                setNote({
                  ...note,
                  pinned: e.target.checked,
                })
              }
            />

            Pin this note

          </label>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddNoteModal;