import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]); 
  const navigate = useNavigate();

  // --- 1. Fetch Events ---
  const fetchEvents = async () => {
    try {
      // ✅ FIX: Live Backend URL
      const res = await axios.get("https://eventease-backend-nzop.onrender.com/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error loading events");
    }
  };

  // --- 2. Fetch All Registrations ---
  const fetchRegistrations = async () => {
    try {
      // ✅ FIX: Live Backend URL
      const res = await axios.get("https://eventease-backend-nzop.onrender.com/api/bookings/all");
      setRegistrations(res.data);
    } catch (err) {
      console.error("Error loading registrations");
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRegistrations(); 
  }, []);

  // --- 3. Handle Delete Event ---
  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      try {
        // ✅ FIX: Use sessionStorage (Matches your Login logic)
        const role = sessionStorage.getItem("role");

        if (!role) {
          alert("Error: You are not logged in as Admin.");
          return;
        }

        // ✅ FIX: Live Backend URL
        await axios.delete(`https://eventease-backend-nzop.onrender.com/api/events/${id}`, {
          headers: { role: role }
        });
        
        alert("Event Deleted Successfully");
        fetchEvents(); // Refresh list
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Delete failed. Check console for details.");
      }
    }
  };

  return (
    <div className="pt-28 px-10 pb-12 min-h-screen bg-gray-50">
      
      {/* --- SECTION 1: MANAGE EVENTS --- */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
        <Link to="/admin/manage-event" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
          + Add New Event
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
            <tr>
              <th className="p-5">Title</th>
              <th className="p-5">Category</th>
              <th className="p-5">Price</th>
              <th className="p-5 text-center">Date</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50 transition">
                <td className="p-5 font-semibold text-gray-800">{event.title}</td>
                <td className="p-5 text-gray-600">{event.category}</td>
                <td className="p-5 font-bold text-blue-600">₹{event.price}</td>
                {/* Format Date Nicely */}
                <td className="p-5 text-gray-600 text-center">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                
                {/* ACTIONS COLUMN */}
                <td className="p-5 flex justify-center gap-2">
                  {/* Edit Button */}
                  <Link to={`/admin/manage-event/${event._id}`} className="bg-amber-100 text-amber-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-amber-200">
                    Edit
                  </Link>

                  {/* View Users Button */}
                  <button 
                    onClick={() => navigate(`/admin/registrations/${event._id}`)}
                    className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-indigo-200"
                  >
                    View Registrations
                  </button>

                  {/* Delete Button */}
                  <button onClick={() => handleDelete(event._id)} className="bg-red-100 text-red-700 px-3 py-2 rounded-lg font-bold text-sm hover:bg-red-200">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}