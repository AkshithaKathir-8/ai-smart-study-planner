import {
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const colors = {

  orange: {
    bg: "bg-orange-100",
    icon: "text-orange-600",
    badge: "bg-orange-50 text-orange-600",
  },

  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-600",
    badge: "bg-blue-50 text-blue-600",
  },

  emerald: {
    bg: "bg-emerald-100",
    icon: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600",
  },

  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-600",
    badge: "bg-purple-50 text-purple-600",
  },

};



function SubjectCard({

  id,
  subject,
  code,
  credits,
  color,

}) {


  const navigate = useNavigate();


  const theme =
    colors[color] || colors.blue;



  return (

    <motion.div

      whileHover={{
        y: -8,
        scale: 1.02,
      }}

      transition={{
        duration:0.25
      }}

      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl p-7"

    >



      {/* Header */}

      <div className="flex justify-between items-start">


        <div
          className={`w-14 h-14 rounded-2xl ${theme.bg} flex items-center justify-center`}
        >

          <BookOpen

            size={28}

            className={theme.icon}

          />

        </div>



        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${theme.badge}`}
        >

          {code || "No Code"}

        </span>


      </div>





      {/* Subject Name */}


      <h2 className="text-xl font-bold text-slate-800 mt-6">

        {subject}

      </h2>



      <p className="text-slate-500 mt-1">

        Subject Code: {code || "Not Added"}

      </p>






      {/* Stats */}


      <div className="mt-8">


        <div className="bg-slate-50 rounded-2xl p-4">


          <div className="flex items-center gap-2 text-slate-500">


            <GraduationCap size={18}/>


            Credits


          </div>



          <h3 className="text-lg font-bold mt-2">

            {credits || 0}

          </h3>



        </div>


      </div>





      {/* Button */}


      <button

        onClick={() =>
          navigate(`/subjects/${id}`)
        }

        className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 text-white hover:bg-indigo-600 transition cursor-pointer"

      >

        View Details

        <ArrowRight size={18}/>


      </button>



    </motion.div>

  );


}



export default SubjectCard;