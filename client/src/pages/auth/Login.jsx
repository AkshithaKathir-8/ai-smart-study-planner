import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Lock } from "lucide-react";
import Logo from "../../components/ui/Logo";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function Login() {
   const [formData, setFormData] = useState({
   email: "",
   password: "",
 });
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const { login } = useAuth();

    const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const data = await loginUser(formData);

    localStorage.setItem("token", data.token);

    login(data.user);

    alert(data.message);

    navigate("/dashboard");
  } catch (error) {
    alert(
      error.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">

      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 text-white p-16">

        <Logo dark={true} />

        <h2 className="text-5xl font-bold mt-16 leading-tight">
          Study Smarter.
          <br />
          Achieve More.
        </h2>

        <p className="mt-6 text-lg text-indigo-100 leading-8">
          Organize your subjects, manage deadlines,
          generate AI-powered study schedules,
          and stay productive every day.
        </p>

        <div className="mt-16 space-y-5">

          <div className="flex items-center gap-4">
            <GraduationCap size={28} />
            <span>Your Intelligent Academic Companion</span>
          </div>

          <div className="flex items-center gap-4">
            <Mail size={28} />
            <span>Smart Task Management</span>
          </div>

          <div className="flex items-center gap-4">
            <Lock size={28} />
            <span>Secure Cloud Storage</span>
          </div>

        </div>

      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8">

        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-10">

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-slate-500">
            Sign in to continue your learning journey with KortexAI.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            <Input
  label="Email"
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
/>

 <Input
  label="Password"
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Enter your password"
/>

            <div className="flex justify-between text-sm">

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            <Button type="submit">
  {loading ? "Signing in..." : "Login"}
</Button>

          </form>

          <p className="mt-8 text-center text-slate-500">

            Don't have an account?

            <Link
              to="/register"
              className="ml-2 font-semibold text-indigo-600 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;