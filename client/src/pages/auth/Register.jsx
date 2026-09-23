import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

import Logo from "../../components/ui/Logo";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Register() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    confirmPassword: "",

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,
      [e.target.name]: e.target.value,

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {

      return alert("Passwords do not match");

    }

    try {

      setLoading(true);

      await registerUser({

        name: formData.name,
        email: formData.email,
        password: formData.password,

      });

      alert("Registration Successful");

      navigate("/login");

    } catch (err) {

      alert(

        err.response?.data?.message ||
        "Registration Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

        <Logo />

        <h1 className="text-3xl font-bold mt-6">

          Create Account

        </h1>

        <p className="text-slate-500 mt-2">

          Join KortexAI today.

        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 mt-8"
        >

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />

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
            placeholder="Create password"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />

          <Button type="submit">

            {loading
              ? "Creating Account..."
              : "Register"}

          </Button>

        </form>

        <p className="mt-6 text-center">

          Already have an account?

          <Link
            to="/login"
            className="text-indigo-600 ml-2"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;