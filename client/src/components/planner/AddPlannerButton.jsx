import { Plus } from "lucide-react";

function AddPlannerButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl hover:bg-indigo-700 transition cursor-pointer"
    >
      <Plus size={20} />
      Add Study Session
    </button>
  );
}

export default AddPlannerButton;