import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EventCard = ({ event }) => {
  // --- 1. Date Logic ---
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

  // Check if event is in the past
  const isExpired = eventDate < today;

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full ${isExpired ? "grayscale opacity-80" : ""}`}>
      {/* Load images from Render Backend */}
      <img 
        src={event.image ? `https://eventease-backend-nzop.onrender.com${event.image}` : "/Images/logo.png"} 
        alt={event.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${isExpired ? "bg-gray-200 text-gray-600" : "bg-blue-100 text-blue-600"}`}>
                {event.category}
            </span>
            {/* Show Completed Badge if Expired */}
            {isExpired && (
                <span className="text-xs font-bold border border-gray-400 text-gray-500 px-2 py-1 rounded">
                    COMPLETED
                </span>
            )}
        </div>

        <h3 className="mt-2 text-lg font-bold text-gray-800">{event.title}</h3>
        
        {/* --- 2. Date Format Fix (dd/mm/yyyy) --- */}
        <p className="mt-1 text-sm text-gray-500">
            📅 {eventDate.toLocaleDateString('en-GB')} • 📍 {event.venue}
        </p>
        
        <div className="mt-2 font-bold text-gray-700">₹{event.price}</div>

        <Link to={`/events/${event._id}`} className={`mt-auto pt-4 inline-block font-semibold hover:underline ${isExpired ? "text-gray-600" : "text-blue-600"}`}>
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("https://eventease-backend-nzop.onrender.com/api/events")
      .then(res => {
        // --- 3. Sorting Logic: Latest dates first (Descending) ---
        // This puts 2026 at the top, and 2024 at the bottom
        const sortedEvents = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sortedEvents);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto px-6 py-14 bg-gray-50 min-h-screen pt-28 pb-12">
      <h2 className="mb-10 text-3xl font-bold text-gray-900 text-center">All Events</h2>
      
      {events.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl mx-auto max-w-2xl">
           <p className="text-gray-400">No events found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}