import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Carousel remains same for design
const ImageCarousel = ({ images, interval = 2000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full overflow-hidden shadow-2xl mx-auto h-[420px] md:h-[520px] lg:h-[620px]">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.path}
          alt={image.alt}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
          Discover Your Next Adventure
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-white max-w-3xl">
          Find and register for the best college and community events — all in one place.
        </p>
        <Link to="/events" className="mt-10 bg-blue-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-xl hover:scale-105">
          Explore All Events
        </Link>
      </div>
    </div>
  );
};

const CAROUSEL_IMAGES = [
  { path: "/Images/party.jpg", alt: "Workshop" },
  { path: "/Images/annual.png", alt: "Cultural Fest" },
  { path: "/Images/sports-day.jpg", alt: "Sports Event" },
];

const EventCard = ({ event }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden flex flex-col">
    <Link to={`/events/${event._id}`}>
      {/* Load images from Render */}
      <img 
        src={event.image ? `https://eventease-backend-nzop.onrender.com${event.image}` : "/Images/logo.png"} 
        alt={event.title} 
        className="w-full h-48 object-cover" 
      />
    </Link>
    <div className="p-5 flex flex-col grow">
      <span className="text-xs font-bold uppercase text-blue-600 bg-blue-100 px-3 py-1 rounded-full w-fit">
        {event.category || "General"}
      </span>
      <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-1">{event.title}</h3>
      <div className="mt-2 space-y-1">
        {/* ✅ FIXED: Date Format to dd/mm/yyyy */}
        <p className="text-sm text-gray-600">📅 {new Date(event.date).toLocaleDateString('en-GB')}</p>
        <p className="text-sm text-gray-600">📍 {event.venue}</p>
      </div>
      <p className="mt-3 text-blue-600 font-extrabold text-lg">{event.price ? `₹${event.price}` : "Free"}</p>
      
      <Link to={`/events/${event._id}`} className="block text-center mt-auto pt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        View Details
      </Link>
    </div>
  </div>
);

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch data from Render Backend
    axios.get("https://eventease-backend-nzop.onrender.com/api/events")
      .then(res => {
        const allEvents = res.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to ensure we include today's events

        // 1. Filter: Only show events that are Today or in the Future
        const upcomingEvents = allEvents.filter(event => new Date(event.date) >= today);

        // 2. Sort: Show the soonest events first
        const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 3. Slice: Take only the first 4
        setEvents(sortedEvents.slice(0, 4));
      })
      .catch(err => console.error("Error fetching events for home:", err));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-16">
        <ImageCarousel images={CAROUSEL_IMAGES} />
      </div>
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400">No upcoming events right now. Check back soon!</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/events" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            View All Events →
          </Link>
        </div>
      </section>
    </div>
  );
}