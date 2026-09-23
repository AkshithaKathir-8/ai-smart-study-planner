import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/analyticsService";

function ProgressCard() {

  const [progress, setProgress] = useState(0);

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        const data = await getAnalytics();

        setProgress(data.averageProgress || 0);

      } catch (err) {

        console.log(err);

      }

    };

    loadAnalytics();

  }, []);

  return (

    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6"
    >

      <div className="flex justify-between items-center mb-5">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Overall Progress
          </h2>

          <p className="text-slate-500 mt-1">
            Based on your enrolled subjects.
          </p>

        </div>

        <span className="text-3xl font-bold text-indigo-600">
          {progress}%
        </span>

      </div>

      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">

        <div
          className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />

      </div>

      <div className="flex justify-between mt-5 text-sm text-slate-500">

        <span>Academic Progress</span>

        <span>{progress}% Completed</span>

      </div>

    </motion.div>

  );

}

export default ProgressCard;