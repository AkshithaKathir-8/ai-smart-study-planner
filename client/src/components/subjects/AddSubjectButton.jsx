import { Plus } from "lucide-react";
import { motion } from "framer-motion";

function AddSubjectButton({ onClick }) {
  return (
    <motion.button
      whileHover={{
        scale: 1.04,
      }}
      whileTap={{
        scale: 0.96,
      }}
      onClick={onClick}
className="flex items-center gap-3 px-6 py-3 rounded-2xl
bg-gradient-to-r from-indigo-600 to-violet-600
text-white font-semibold shadow-lg
hover:shadow-indigo-300 transition-all cursor-pointer"
    >
      <Plus size={22} />

      Add Subject
    </motion.button>
  );
}

export default AddSubjectButton;