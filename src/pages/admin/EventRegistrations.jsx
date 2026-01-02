import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventRegistrations() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [eventName, setEventName] = useState("Event");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventBookings();
  }, [id]);

  const fetchEventBookings = async () => {
    try {
      const res = await axios.get(`https://eventease-backend-nzop.onrender.com/api/bookings/event/${id}`);
      setBookings(res.data);
      
      if (res.data.length > 0 && res.data[0].event) {
        setEventName(res.data[0].event.title);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching event registrations:", err);
      setLoading(false);
    }
  };

  const getUserName = (user) => {
    if (!user) return <span className="text-red-400">User Deleted</span>;
    return user.fullName || user.name || user.username || user.email;
  };

  // ✅ FIX: Check BOTH 'createdAt' (New) and 'bookedAt' (Old)
  const formatDateTime = (booking) => {
    // 1. Try to find a valid date field
    const dateString = booking.createdAt || booking.bookedAt;

    if (!dateString) return { date: "N/A", time: "" };

    const dateObj = new Date(dateString);
    
    // Format Date: 28/12/2025
    const date = dateObj.toLocaleDateString("en-GB", {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    // Format Time: 06:14 PM
    const time = dateObj.toLocaleTimeString("en-IN", {
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    return { date, time };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Registrations For</p>
            <h1 className="text-3xl font-extrabold text-gray-800">{eventName}</h1>
          </div>
          <button 
            onClick={() => navigate("/admin/dashboard")} 
            className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-100 shadow-sm transition"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="p-6">User Name</th>
                <th className="p-6">Email Address</th>
                <th className="p-6">Payment Status</th>
                <th className="p-6">Date & Time</th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500 font-medium">
                    Loading registrations...
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking) => {
                  // ✅ Pass the whole booking object to the helper
                  const { date, time } = formatDateTime(booking);

                  return (
                    <tr key={booking._id} className="hover:bg-blue-50 transition duration-150">
                      
                      <td className="p-6 font-bold text-gray-800">
                        {getUserName(booking.user)}
                      </td>

                      <td className="p-6 text-gray-600">
                        {booking.user ? booking.user.email : "N/A"}
                      </td>

                      <td className="p-6">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
                          {booking.paymentStatus || "PAID"}
                        </span>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">
                            {date}
                          </span>
                          <span className="text-xs text-gray-500 font-medium mt-1">
                            {time}
                          </span>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center opacity-50">
                      <p className="text-gray-500 text-lg font-medium">No registrations found.</p>
                      <p className="text-gray-400 text-sm">Wait for users to book this event.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && bookings.length > 0 && (
          <div className="mt-4 text-right text-gray-500 text-sm font-medium">
            Total Registrations: <span className="text-gray-800 font-bold">{bookings.length}</span>
          </div>
        )}

      </div>
    </div>
  );
}