function Logo({ size = "text-4xl", dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-lg">
        <span className="text-2xl">🎓</span>
      </div>

      <div>
        <h1
          className={`${size} font-bold ${
            dark ? "text-white" : "text-slate-900"
          }`}
        >
          Kortex AI
        </h1>

        <p
          className={`text-sm ${
            dark ? "text-indigo-100" : "text-slate-500"
          }`}
        >
          Your Intelligent Learning Companion
        </p>
      </div>
    </div>
  );
}

export default Logo;