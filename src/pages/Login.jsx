import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Please fill in all fields",
        });
        return;
      }
      const response = await login(email, password);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Logged in successfully!",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.message || "Invalid credentials, please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.response?.data?.message || "Email or Password is incorrect",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-none">
        <h2 className="text-gray-700 text-3xl font-bold mb-8 text-center">Log In</h2>
        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter  your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-800 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition-colors text-lg cursor-pointer"
        >
          Log In
        </button>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-sm text-blue-700 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
