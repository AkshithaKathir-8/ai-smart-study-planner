import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

function WelcomeCard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
      relative
      overflow-hidden
      rounded-[2rem]
      p-10
      text-white
      bg-gradient-to-r
      from-indigo-600
      via-purple-600
      to-fuchsia-600
      shadow-2xl
      "
    >
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">

        <div className="flex items-center gap-2 text-indigo-100">

          <Sparkles size={18} />

          <span className="font-medium">
            Kortex AI Smart Study Planner
          </span>

        </div>

        <h1 className="text-4xl font-bold mt-5">

          {greeting},{" "}
          {user?.name || "Student"} 👋

        </h1>

        <p className="mt-4 max-w-2xl text-lg text-indigo-100 leading-8">

          Stay focused, organize your academic journey, monitor your
          performance, and let AI help you study smarter every day.

        </p>

        <div className="flex items-center gap-2 mt-6 text-indigo-100">

          <CalendarDays size={18} />

          <span>{today}</span>

        </div>

      <button
  onClick={() => navigate("/ai")}
  className="
    mt-8
    bg-white
    text-indigo-700
    px-7
    py-3
    rounded-2xl
    font-semibold
    hover:scale-105
    transition
    shadow-lg
  "
>
  Open AI Planner ✨
</button>

      </div>
    </motion.div>
  );
}

export default WelcomeCard;