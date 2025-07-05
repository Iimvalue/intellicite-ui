import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "./../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const navigate = useNavigate();

  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (value.length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleRegister = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      general: "",
    });

    if (nameError || emailError || passwordError) return;

    try {
      const response = await register(name, email, password);

      navigate("/");
    } catch (error) {
      const message = error.response.data.message || error.message;

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8">
        <h2 className="text-gray-700 text-3xl font-bold mb-8 text-center">
          Register
        </h2>
        <div className="mb-4">
         <label className="block mb-2 text-base font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 border ${
              errors.name ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="mb-4">
            <label className="block mb-2 text-base font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border ${
              errors.email ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border ${
              errors.password ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
            placeholder="Your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.general}
          </p>
        )}
        <button
          type="button"
          onClick={handleRegister}
          className="w-full bg-blue-800 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition-colors text-lg cursor-pointer"
        >
          Register
        </button>
        <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
            Already have an account?
          </span>
          <Link to="/login" className="text-blue-700 hover:underline text-sm">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
