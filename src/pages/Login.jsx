import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { login } from "./../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();
  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    return "";
  };
  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required";
    return "";
  };

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
      general: "",
    });

    if (emailError || passwordError) return;

    try {
      const response = await login(email, password);

Swal.fire({
        title: "Login Successful",
        text: "Welcome back!",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => navigate("/"));
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
          Log In
        </h2>
        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
             onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border ${
              errors.email ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border ${
              errors.password ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
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
          onClick={handleLogin}
          className="w-full bg-blue-800 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition-colors text-lg cursor-pointer"
        >
          Log In
        </button>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">Don't have an account? </span>
          <Link
            to="/register"
            className="text-sm text-blue-800 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;