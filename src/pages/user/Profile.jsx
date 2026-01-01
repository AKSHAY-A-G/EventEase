import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import Navbar from "../../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId"); // Get ID to fetch data

  // 2. Create State to hold real user data
  const [userData, setUserData] = useState({
    fullName: sessionStorage.getItem("userName") || "User",
    role: sessionStorage.getItem("role") || "Guest",
    email: "",
    phone: "",
    profilePic: "https://cdn-icons-png.flaticon.com/512/149/149071.png" // Default
  });

  // 3. Fetch Latest Data from Backend
  useEffect(() => {
    if (userId) {
      // ✅ FIX: Use Render Backend
      axios.get(`https://eventease-backend-nzop.onrender.com/api/auth/user/${userId}`)
        .then(res => {
          setUserData({
            fullName: res.data.fullName || res.data.name || "User",
            role: res.data.role || "user",
            email: res.data.email,
            phone: res.data.phone || "N/A",
            // Use the uploaded image, or fall back to default if empty
            profilePic: res.data.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          });
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.clear(); 
    navigate("/login"); 
    window.location.reload(); 
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-3">
            My Profile
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT CARD */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center h-fit">
              {/* 4. Display the Real Image from State */}
              <img
                src={userData.profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500 p-1 object-cover"
              />

              <h2 className="text-2xl font-bold mt-4">
                {userData.fullName}
              </h2>

              <p className="text-blue-600 font-medium capitalize">{userData.role} Account</p>
              <p className="text-gray-500 text-sm mt-1">
                Member since December 2025
              </p>

              <button
                onClick={() => navigate("/editProfile")}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>

            {/* RIGHT DETAILS */}
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
                Personal Information
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase">Full Name</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {userData.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase">Email Address</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {userData.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase">Phone Number</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {userData.phone}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase">Account Role</p>
                  <p className="font-semibold text-lg text-gray-900 capitalize">
                    {userData.role}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase">Status</p>
                  <p className="font-semibold text-lg text-green-600">Active</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}