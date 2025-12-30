import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false); // State to track registration status

  // Get current user ID from Session Storage
  const userId = sessionStorage.getItem("userId");

  // 1. Fetch Event Details
  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // 2. Check if User is Already Registered
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/bookings/${userId}`)
        .then(res => {
          // Check if any booking in the list matches the current event ID
          // We use booking.event._id because your backend populates the event object
          const alreadyBooked = res.data.some(booking => booking.event && booking.event._id === id);
          setIsRegistered(alreadyBooked);
        })
        .catch(err => console.error("Error checking registration:", err));
    }
  }, [id, userId]);

  // Function to handle the redirect to payment
  const handleRegister = () => {
    // Prevent navigation if already registered
    if (isRegistered) return;

    if (!userId) {
      alert("Please login to register!");
      navigate("/login");
      return;
    }

    // Navigate to payment page
    navigate(`/payment/${id}`, { state: { price: event.price, title: event.title } });
  };

  if (!event) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="md:w-1/2">
          <img 
            src={event.image ? `http://localhost:5000${event.image}` : "/Images/placeholder.jpg"} 
            alt={event.title} 
            className="w-full h-[450px] object-cover rounded-2xl shadow-lg" 
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold w-fit uppercase mb-4">
            {event.category}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 gap-4 text-gray-600 mb-8">
            <p className="text-lg">📅 <strong>Date:</strong> {event.date}</p>
            <p className="text-lg">📍 <strong>Venue:</strong> {event.venue}</p>
            <p className="text-lg text-blue-600 font-bold">💰 <strong>Price:</strong> {event.price}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 text-gray-600">
             <h3 className="font-bold text-gray-800 mb-2">Event Description</h3>
             {event.description}
          </div>

          {/* Updated Button Logic */}
          <button 
            onClick={handleRegister}
            disabled={isRegistered} // Disable click if registered
            className={`w-full py-4 rounded-xl font-bold text-xl transition shadow-lg 
              ${isRegistered 
                ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200" // Registered Style
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95" // Normal Style
              }`}
          >
            {isRegistered ? "✅ Already Registered" : "Register for Event"}
          </button>
        </div>
      </div>
    </div>
  );
}