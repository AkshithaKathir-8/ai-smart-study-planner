import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}

export default StatCard;