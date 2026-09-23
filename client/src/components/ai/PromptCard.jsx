import { motion } from "framer-motion";

function PromptCard({

  emoji,

  title,

  description,

  onClick,

}) {

  return (

    <motion.button

      whileHover={{
        y: -6,
        scale: 1.02,
      }}

      whileTap={{
        scale: 0.98,
      }}

      onClick={onClick}

      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-left hover:shadow-xl transition-all duration-300 cursor-pointer"

    >

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-3xl">

        {emoji}

      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-800">

        {title}

      </h3>

      <p className="mt-3 text-slate-500 leading-7">

        {description}

      </p>

    </motion.button>

  );

}

export default PromptCard;