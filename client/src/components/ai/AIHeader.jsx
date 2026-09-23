import { Sparkles } from "lucide-react";

function AIHeader() {

  return (

    <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold flex items-center gap-3">

            <Sparkles size={34} />

            Kortex AI

          </h1>

          <p className="mt-3 text-indigo-100 text-lg">

            Your intelligent academic assistant.

          </p>

        </div>

        <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">

          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

          <span>

            Online

          </span>

        </div>

      </div>

    </div>

  );

}

export default AIHeader;