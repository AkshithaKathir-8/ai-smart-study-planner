import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

const inputType =
  type === "password"
    ? showPassword
      ? "text"
      : "password"
    : type;
  return (
    <div className="relative">
  <input
    type={inputType}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-700 placeholder:text-slate-400 transition duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
  />

  {type === "password" && (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  )}
</div>
  );
}

export default Input;