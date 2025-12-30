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
      const res = await axios.get(`http://localhost:5000/api/bookings/${userId}`);
      
      // FILTER: Only keep bookings where the event still exists
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

    if (status === "success" && eventId) {
      axios.post("http://localhost:5000/api/bookings", {
        userId,
        eventId
      })
      .then(() => {
        alert("🎉 Event Registered Successfully! \n\n🎟️ A ticket has been sent to your registered email address.");
        fetchBookings();
        navigate("/dashboard", { replace: true });
      })
      .catch((err) => {
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
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm mb-8 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome Back, <span className="text-blue-600">{userName}</span>!
          </h1>
          <p className="text-gray-500 mt-2">Manage your event registrations below.</p>
        </div>

        {/* Registered Events Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Registered Events</h2>
          
          {bookings.length === 0 ? (
            /* --- EMPTY STATE --- */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <span className="text-4xl" role="img" aria-label="calendar">📅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Registrations Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md">
                You haven't registered for any events yet. Browse our events and find one that interests you!
              </p>
              
              <button 
                onClick={() => navigate("/events")} 
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse All Events
              </button>
            </div>
          ) : (
            /* --- LIST OF BOOKINGS --- */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition bg-gray-50 flex flex-col h-full">
                    <img 
                      src={`http://localhost:5000${booking.event.image}`} 
                      alt={booking.event.title} 
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                    
                    <h3 className="font-bold text-lg mb-2 text-gray-800 leading-tight">
                      {booking.event.title}
                    </h3>

                    <div className="text-gray-600 text-sm space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>
                          {new Date(booking.event.date).toLocaleDateString(undefined, {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="truncate">{booking.event.venue}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        PAID
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- NEW BUTTON: EXPLORE MORE EVENTS --- */}
              <div className="mt-10 text-center border-t pt-8">
                <button
                  onClick={() => navigate("/events")}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Explore More Events
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}