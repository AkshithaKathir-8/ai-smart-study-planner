import { Pin, Pencil, Trash2 } from "lucide-react";

function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
}) {

  return (

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold">
            {note.title}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {note.subject}
          </p>

        </div>

        <button
          onClick={() => onTogglePin(note._id)}
          className={`p-2 rounded-xl transition ${
            note.pinned
              ? "bg-yellow-100 text-yellow-600"
              : "hover:bg-slate-100"
          }`}
        >
          <Pin
            size={18}
            fill={note.pinned ? "currentColor" : "none"}
          />
        </button>

      </div>

      <p className="text-slate-600 mt-5 leading-7">
        {note.description}
      </p>

      <div className="flex justify-between items-center mt-8">

        <span className="text-sm text-slate-400">
          Updated {note.updatedAt}
        </span>

        <div className="flex gap-2">

          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(note._id)}
            className="p-2 rounded-xl hover:bg-red-100 text-red-500"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>

  );

}

export default NoteCard;