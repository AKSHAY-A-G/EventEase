import React, { useEffect, useState } from "react"; // Import Hooks
import { Link, NavLink } from "react-router-dom";
import axios from "axios"; // Import Axios

export default function Navbar() {
  const userId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");

  // 1. State to store the profile picture
  const [profilePic, setProfilePic] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");

  // 2. Fetch the latest profile picture when Navbar loads
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/auth/user/${userId}`)
        .then(res => {
          // If user has a pic, use it. Otherwise keep default.
          if (res.data.profilePic) {
            setProfilePic(res.data.profilePic);
          }
        })
        .catch(err => console.error("Navbar image error:", err));
    }
  }, [userId]);

  const linkClass = ({ isActive }) =>
    `hover:text-black transition duration-150 font-medium ${
      isActive ? "font-bold text-gray-900" : "text-white/90"
    }`;

  return (
    <nav className="w-full bg-gradient-to-r from-blue-300 to-blue-800 py-4 shadow fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          {/* Logo */}
          <img src="/Images/logo.png" alt="logo" className="w-12" />
        </Link>

        <div className="flex gap-8 items-center">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          
          {role === "admin" && (
            <NavLink to="/admin/dashboard" className={linkClass}>Admin</NavLink>
          )}

          {userId && role !== "admin" && (
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          )}
          
          <NavLink to="/about" className={linkClass}>About</NavLink>
          
          {/* Profile Button */}
          {userId ? (
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/40 transition overflow-hidden"
            >
              {/* 3. Use the dynamic 'profilePic' state here */}
              <img
                src={profilePic}
                className="w-full h-full object-cover" 
                alt="Profile"
              />
            </Link>
          ) : (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}