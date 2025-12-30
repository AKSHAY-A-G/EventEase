import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EventCard = ({ event }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
    {/* ✅ FIX: Load images from Render Backend instead of localhost */}
    <img 
      src={event.image ? `https://eventease-backend-nzop.onrender.com${event.image}` : "/Images/logo.png"} 
      alt={event.title} 
      className="w-full h-48 object-cover" 
    />
    <div className="p-5">
      <span className="text-xs font-semibold uppercase text-blue-600">{event.category}</span>
      <h3 className="mt-2 text-lg font-bold text-gray-800">{event.title}</h3>
      <p className="mt-1 text-sm text-gray-500">{event.date} • {event.venue}</p>
      
      {/* Price Tag */}
      <div className="mt-2 font-bold text-gray-700">₹{event.price}</div>

      <Link to={`/events/${event._id}`} className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
        View Details →
      </Link>
    </div>
  </div>
);

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // ✅ FIX: Fetching events from Render Live Server
    axios.get("https://eventease-backend-nzop.onrender.com/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto px-6 py-14 bg-gray-50 min-h-screen pt-28 pb-12">
      <h2 className="mb-10 text-3xl font-bold text-gray-900 text-center">All Events</h2>
      
      {/* Check if events exist before mapping */}
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