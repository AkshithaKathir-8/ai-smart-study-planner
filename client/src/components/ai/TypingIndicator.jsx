import { motion } from "framer-motion";

function TypingIndicator() {

  return (

    <div className="flex justify-start">

      <div className="bg-white border border-slate-200 rounded-3xl px-6 py-5 shadow-sm">

        <p className="font-semibold text-slate-700 mb-4">

          🤖 Kortex AI is thinking...

        </p>

        <div className="flex gap-2">

          {[0,1,2].map((dot)=>(

            <motion.div

              key={dot}

              animate={{
                y:[0,-8,0]
              }}

              transition={{
                duration:0.6,
                repeat:Infinity,
                delay:dot*0.2
              }}

              className="w-3 h-3 rounded-full bg-indigo-600"

            />

          ))}

        </div>

      </div>

    </div>

  );

}

export default TypingIndicator;