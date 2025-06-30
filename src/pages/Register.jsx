import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { register } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    
      if (!name.trim() || !email.trim() || !password.trim()) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Please fill in all fields",
        });
        return;
      }
      if (name.length < 3) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Name must be at least 3 characters long",
        });
        return;
      }
      if (password.length < 6) {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Password must be at least 6 characters long",
        });
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) { // >>>> strong validation for email format
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Please enter a valid email address",
        });
        return;
      }
    
      const response = await register(name, email, password);
      console.log("Registration response:", response);
      
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Account Created",
          text: "You can now Sign In.",
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:"Registration failed, Please try again",
        });
      }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-none">
        <h2 className="text-gray-700 text-3xl font-bold mb-8 text-center">Register</h2>
        <div className="mb-4">
          <label className="block mb-2 text-base font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-blue-800 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition-colors text-lg cursor-pointer"
        >
          Register
        </button>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-sm text-blue-800 hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;