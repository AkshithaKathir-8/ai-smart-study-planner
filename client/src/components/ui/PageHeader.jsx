import { motion } from "framer-motion";

function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-slate-500 text-lg">
          {subtitle}
        </p>
      </div>

      {action && (
        <div>
          {action}
        </div>
      )}
    </motion.div>
  );
}

export default PageHeader;