import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName") || "User";

  // --- FETCH BOOKINGS ---
  const fetchBookings = async () => {
    try {
      // ✅ FIX: Using Live Render Backend
      const res = await axios.get(`https://eventease-backend-nzop.onrender.com/api/bookings/${userId}`);
      
      // Filter out invalid events
      const validBookings = res.data.filter(booking => booking.event !== null);
      setBookings(validBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");
    const eventId = query.get("eventId");

    // ✅ FIX: Registering on Live Render Backend
    if (status === "success" && eventId) {
      axios.post("https://eventease-backend-nzop.onrender.com/api/bookings", {
        userId,
        eventId
      })
      .then(() => {
        alert("🎉 Event Registered Successfully! \n\n🎟️ Check your email for the ticket.");
        fetchBookings();
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
        // If it fails (e.g., already registered), just fetch current bookings
        console.error("Registration error:", err);
        fetchBookings(); 
        navigate("/dashboard", { replace: true });
      });
    } else {
      fetchBookings();
    }
  }, [location, userId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 md:px-12 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-sm mb-8 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome Back, <span className="text-blue-600">{userName}</span>!
          </h1>
          <p className="text-gray-500 mt-2">Manage your event registrations below.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Registered Events</h2>
          
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Registrations Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md">Browse our events and find one that interests you!</p>
              <button onClick={() => navigate("/events")} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Browse All Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition bg-gray-50 flex flex-col h-full">
                  {/* ✅ FIX: Image from Render */}
                  <img 
                    src={`https://eventease-backend-nzop.onrender.com${booking.event.image}`} 
                    alt={booking.event.title} 
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <h3 className="font-bold text-lg mb-2 text-gray-800 leading-tight">{booking.event.title}</h3>
                  <p className="text-sm text-gray-600">📅 {new Date(booking.event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mb-4">📍 {booking.event.venue}</p>
                  <div className="mt-auto pt-4 border-t border-gray-200">
                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">PAID</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}