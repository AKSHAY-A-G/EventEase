import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      adminCode: e.target.adminCode.value, // Capture the secret code
    };

    try {
      // ✅ FIX: Using your live Render Backend URL
      const response = await axios.post("https://eventease-backend-nzop.onrender.com/api/auth/register", formData);
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Create Account</h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <input name="fullName" type="text" placeholder="Full Name" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="email" type="email" placeholder="Email Address" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="password" type="password" placeholder="Password" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
          
          {/* New Admin Code Field */}
          <div className="pt-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Admin Access (Optional)</label>
            <input name="adminCode" type="password" placeholder="Enter Secret Code" className="w-full p-4 mt-1 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all mt-4">
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}