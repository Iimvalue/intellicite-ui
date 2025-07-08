import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "./../services/authService";
import { Toast } from "primereact/toast";

function Register() {
  const toast = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      await register(name, email, password);

      toast.current.show({
        severity: "success",
        summary: "Welcome!",
        detail: "You're now signed up! Redirecting...",
        life: 1000,
      });

      setTimeout(() => {
        navigate("/search");
      }, 1000);
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      let customMessage = "Something went wrong. Please try again";

      if (backendMsg === "User with this email already exists") {
        customMessage = "This email is already registered, Please login";
      } else if (backendMsg === "Name, email, and password are required") {
        customMessage = "Please fill out all the fields";
      }

      setErrors((prev) => ({
        ...prev,
        general: customMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Toast ref={toast} />
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-200/20 backdrop-blur-md border border-gray-300/30 shadow-lg">
        <h2 className="text-gray-700 text-3xl font-bold mb-8 text-center">
          Register
        </h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 border bg-white ${
              errors.name ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border bg-white ${
              errors.email ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 border bg-white ${
              errors.password ? "border-red-500" : "border-gray-200"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-200`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errors.general}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleRegister}
          className={`w-full bg-blue-800 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition-colors text-lg cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span className="ml-2">Registering...</span>
            </div>
          ) : (
            "Register"
          )}
        </button>

        {/* Link to Login */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Already have an account?{" "}
          </span>
          <Link to="/login" className="text-sm text-blue-800 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;