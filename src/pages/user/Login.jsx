import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send login request to backend
      // ✅ FIX: Using your live Render Backend URL
      const response = await axios.post("https://eventease-backend-nzop.onrender.com/api/auth/login", {
        email,
        password,
      });

      // 2. Destructure user data from response
      const { id, fullName, role } = response.data;

      // 3. Store data in SessionStorage (Clears when tab is closed)
      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userName", fullName);
      sessionStorage.setItem("role", role);

      alert(`Welcome back, ${fullName}!`);

      // 4. Redirect to Home Page
      navigate("/"); 
      
      // Refresh to update Navbar state
      window.location.reload();
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.message || "Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <img src="/Images/logo.png" alt="EventEase" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Log in to manage your event adventure</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="EventEase@gmail.com"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transform active:scale-95 transition-all mt-4 shadow-lg shadow-blue-100"
          >
            Log In
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>
            New to EventEase?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}