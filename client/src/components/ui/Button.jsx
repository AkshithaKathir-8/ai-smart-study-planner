function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;