import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"; // Import Bars and Close icons

export default function Navbar() {
  const userId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

  // 1. State to store the profile picture
  const [profilePic, setProfilePic] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png");

  // 2. Fetch the latest profile picture (Live Backend)
  useEffect(() => {
    if (userId) {
      axios.get(`https://eventease-backend-nzop.onrender.com/api/auth/user/${userId}`)
        .then(res => {
          if (res.data.profilePic) {
            setProfilePic(res.data.profilePic);
          }
        })
        .catch(err => console.error("Navbar image error:", err));
    }
  }, [userId]);

  // Close menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  // Common Link Styles
  const linkClass = ({ isActive }) =>
    `hover:text-black transition duration-150 font-medium ${
      isActive ? "font-bold text-gray-900" : "text-white/90"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-2 hover:bg-blue-700 transition duration-150 font-medium ${
      isActive ? "font-bold text-white bg-blue-700" : "text-white/90"
    }`;

  return (
    <nav className="w-full bg-gradient-to-r from-blue-300 to-blue-800 py-4 shadow fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <img src="/Images/logo.png" alt="logo" className="w-12" />
        </Link>

        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
        <div className="hidden md:flex gap-8 items-center">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          
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

        {/* --- MOBILE TOGGLE BUTTON (Visible only on Mobile) --- */}
        <button 
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {/* This section only appears when isOpen is true */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-600">
          <div className="flex flex-col py-4 space-y-2">
            <NavLink to="/" className={mobileLinkClass} onClick={handleLinkClick}>Home</NavLink>
            
            {role === "admin" && (
              <NavLink to="/admin/dashboard" className={mobileLinkClass} onClick={handleLinkClick}>Admin</NavLink>
            )}

            {userId && role !== "admin" && (
              <NavLink to="/dashboard" className={mobileLinkClass} onClick={handleLinkClick}>Dashboard</NavLink>
            )}
            
            <NavLink to="/about" className={mobileLinkClass} onClick={handleLinkClick}>About</NavLink>

            {userId ? (
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-white/90 hover:bg-blue-700 flex items-center gap-3"
                onClick={handleLinkClick}
              >
                <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-white" />
                <span>My Profile</span>
              </Link>
            ) : (
              <NavLink to="/login" className={mobileLinkClass} onClick={handleLinkClick}>Login</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}