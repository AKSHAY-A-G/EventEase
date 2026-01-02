import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const userId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");

  const [profilePic, setProfilePic] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/auth/user/${userId}`)
        .then((res) => {
          if (res.data.profilePic) {
            setProfilePic(res.data.profilePic);
          }
        })
        .catch((err) => console.error("Navbar image error:", err));
    }
  }, [userId]);

  const linkClass = ({ isActive }) =>
    `block py-2 md:py-0 hover:text-black transition font-medium ${
      isActive ? "text-black font-bold" : "text-white/90"
    }`;

  return (
    <nav className="w-full bg-gradient-to-r from-blue-300 to-blue-800 py-4 shadow fixed top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/Images/logo.png" alt="logo" className="w-12" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass}>Home</NavLink>

          {role === "admin" && (
            <NavLink to="/admin/dashboard" className={linkClass}>Admin</NavLink>
          )}

          {userId && role !== "admin" && (
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          )}

          <NavLink to="/about" className={linkClass}>About</NavLink>

          {userId ? (
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full overflow-hidden border border-white/40"
            >
              <img src={profilePic} className="w-full h-full object-cover" />
            </Link>
          ) : (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4 space-y-3 text-white">
          <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>
            <i className="fas fa-home mr-2"></i> Home
          </NavLink>

          {role === "admin" && (
            <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
              <i className="fas fa-user-shield mr-2"></i> Admin
            </NavLink>
          )}

          {userId && role !== "admin" && (
            <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>
              <i className="fas fa-chart-line mr-2"></i> Dashboard
            </NavLink>
          )}

          <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>
            <i className="fas fa-circle-info mr-2"></i> About
          </NavLink>

          {userId ? (
            <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>
              <i className="fas fa-user mr-2"></i> Profile
            </NavLink>
          ) : (
            <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
              <i className="fas fa-right-to-bracket mr-2"></i> Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
