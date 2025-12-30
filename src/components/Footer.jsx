import { Link } from "react-router-dom";
import React from "react";

// Updated with FontAwesome Class Names
const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/akshay.ag.108', icon: 'fa-brands fa-facebook-f' },
  { name: 'Twitter', url: 'https://x.com/AkshayGeorge27', icon: 'fa-brands fa-x-twitter' },
  { name: 'Instagram', url: 'https://www.instagram.com/akshay.a.g_/', icon: 'fa-brands fa-instagram' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-blue-600 mt-16">
      
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-12">

        {/* LOGO SECTION */}
        <div className="col-span-2 md:col-span-1">
          <img 
            src="/Images/logo.png" 
            alt="EventEase Logo" 
            style={{ width: '5rem' }} 
            className="mb-3"
          />
          <p className="text-gray-400 text-sm leading-relaxed">
            Plan, manage, and discover amazing events effortlessly with our 
            all-in-one event management platform.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-lg font-bold text-white mb-5 border-b-2 border-blue-500 inline-block">
            Quick Links
          </h2>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/events" className="hover:text-white transition">Explore Events</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
          </ul>
        </div>

        {/* ACCOUNT LINKS */}
        <div>
          <h2 className="text-lg font-bold text-white mb-5 border-b-2 border-blue-500 inline-block">
            Account & Support
          </h2>
          <ul className="space-y-3 text-sm">
            <li><Link to="/profile" className="hover:text-white transition">My Profile</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Login / Register</Link></li>
            <li>
              <Link to="mailto:akshayag2772@gmail.com" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* SOCIAL LINKS */}
        <div>
          <h2 className="text-lg font-bold text-white mb-5 border-b-2 border-blue-500 inline-block">
            Connect
          </h2>

          <div className="flex space-x-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                className="w-10 h-10 flex items-center justify-center 
                           bg-gray-700 text-blue-400 rounded-lg shadow-lg
                           hover:bg-blue-600 hover:text-white transition duration-300 transform hover:scale-110"
              >
                <i className={`${link.icon} text-xl`}></i>
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 bg-gray-900 text-center text-sm py-4 text-gray-500">
        &copy; {currentYear} EventEase. All rights reserved.
      </div>
    </footer>
  );
}
