import { motion } from "framer-motion";

function MessageBubble({

  sender,

  text,

}) {

  const isAI = sender==="ai";

  return (

    <motion.div

      initial={{
        opacity:0,
        y:20
      }}

      animate={{
        opacity:1,
        y:0
      }}

      transition={{
        duration:0.35
      }}

      className={`flex ${

        isAI

        ?"justify-start"

        :"justify-end"

      }`}

    >

      <div

        className={`

        max-w-xl

        rounded-3xl

        px-6

        py-4

        whitespace-pre-line

        shadow-sm

        ${

        isAI

        ?"bg-white border border-slate-200"

        :"bg-gradient-to-r from-indigo-600 to-violet-600 text-white"

        }

        `}

      >

        <p className="leading-8">

          {text}

        </p>

      </div>

    </motion.div>

  );

}

export default MessageBubble;