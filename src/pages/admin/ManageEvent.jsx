import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ManageEvent() {
  const { id } = useParams(); // Check if we are editing an existing event
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    price: "",
    description: "",
    category: "Technical",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // 1. Fetch data if in "Edit Mode"
  useEffect(() => {
    if (isEditing) {
      axios.get(`http://localhost:5000/api/events/${id}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            title: data.title,
            date: data.date,
            venue: data.venue,
            price: data.price,
            description: data.description,
            category: data.category,
            image: data.image, // Keep existing image path
          });
          // Show existing image in preview
          setPreview(`http://localhost:5000${data.image}`);
        })
        .catch((err) => console.error("Error loading event:", err));
    }
  }, [id, isEditing]);

  // 2. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  // 4. Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- FIX 1: Get Admin Role from Session Storage ---
    // (Previously this might have been localStorage)
    const role = sessionStorage.getItem("role");

    if (role !== "admin") {
      alert("Unauthorized: You must be an admin to perform this action.");
      return;
    }

    // Prepare FormData for file upload
    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("venue", formData.venue);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    
    // Only append image if it's a new file (not a string path from DB)
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          // --- FIX 2: Send Role Header to Backend ---
          // This allows your backend 'authMiddleware' (if used) or route check to pass
          "role": role 
        },
      };

      if (isEditing) {
        // Update existing event
        await axios.put(`http://localhost:5000/api/events/${id}`, data, config);
        alert("Event Updated Successfully!");
      } else {
        // Create new event
        await axios.post("http://localhost:5000/api/events", data, config);
        alert("Event Created Successfully!");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Save Error:", err);
      // Detailed error message for debugging
      const errorMsg = err.response?.data?.message || "Error saving event. Check console.";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditing ? "Edit Event" : "Create New Event"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-6">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-xl mb-4 shadow-md" />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4 border-2 border-dashed border-gray-300">
                No Image Selected
              </div>
            )}
            <input 
              type="file" 
              onChange={handleImageChange} 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border rounded-xl"
              >
                <option>Technical</option>
                <option>Cultural</option>
                <option>Workshop</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className="w-full p-3 bg-gray-50 border rounded-xl"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full p-3 bg-gray-50 border rounded-xl"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                className="w-full p-3 bg-gray-50 border rounded-xl"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Venue</label>
            <input 
              type="text" 
              name="venue" 
              value={formData.venue} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-50 border rounded-xl"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-50 border rounded-xl h-32"
              required 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
            >
              {isEditing ? "Update Event" : "Publish Event"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}