import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProfile() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId"); 

  const [formData, setFormData] = useState({
    fullName: "", 
    email: "",
    phone: "",
    profilePic: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  const [isUploading, setIsUploading] = useState(false);

  // 1. Fetch user data
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/auth/user/${userId}`)
        .then(res => {
          setFormData({
            fullName: res.data.fullName || res.data.name || "", 
            email: res.data.email || "",
            phone: res.data.phone || "",
            profilePic: res.data.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          });
        })
        .catch(err => console.error("Error loading profile:", err));
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // NEW: Check file size (limit to 5MB to prevent crashes)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size is too large! Please choose an image under 5MB.");
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 2. Send updated data
      const updatedData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        profilePic: formData.profilePic
      };

      await axios.put(`http://localhost:5000/api/auth/user/${userId}`, updatedData);
      
      // Update Session Storage so the navbar updates immediately
      sessionStorage.setItem("userName", updatedData.fullName);

      const msg = document.createElement('div');
      msg.className = "fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] font-bold";
      msg.innerText = "Profile updated successfully! 🎉";
      document.body.appendChild(msg);

      setTimeout(() => {
        msg.remove();
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error(err);
      // Specific error message if payload is still too large
      if (err.response && err.response.status === 413) {
        alert("Image is too large. Please upload a smaller photo.");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 border-b pb-3 text-gray-800">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center gap-4 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
            <div className="relative group">
              <img
                src={formData.profilePic}
                alt="Profile"
                className={`w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-md transition ${isUploading ? 'opacity-50' : ''}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition border border-blue-200">
              <span>Choose New Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <p className="text-xs text-gray-400">Max size: 5MB</p>
          </div>

          {/* User Name Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">User Name</label>
            <input 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Email Address Field (Editable) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Email Address</label>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Phone Number Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Phone Number</label>
            <input 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md active:scale-95" disabled={isUploading}>
              Save Changes
            </button>
            <button type="button" onClick={() => navigate("/profile")} className="border border-gray-300 text-gray-600 px-8 py-2 rounded-lg font-bold hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}