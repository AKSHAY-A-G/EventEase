import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 pt-28 pb-12">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
        
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          About Our Event Management System
        </h1>

        <p className="text-gray-700 text-lg mb-4 text-center">
          Welcome to our Event Management Platform – a simple and smart way to
          explore, manage, and participate in events happening around your
          campus and community.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          
          <div className="p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Our Goal</h2>
            <p className="text-gray-700">
              To make event discovery, registration, and management easier and
              more efficient for both organizers and participants.
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Browse upcoming events</li>
              <li>View detailed event information</li>
              <li>Easy registration process</li>
              <li>Organized dashboard</li>
            </ul>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Technologies Used</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>React.js</li>
              <li>React Router</li>
              <li>Tailwind CSS</li>
              <li>Vite</li>
            </ul>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Why This Project?</h2>
            <p className="text-gray-700">
              This project was created as a part of a learning initiative to
              understand real-world application development, routing, and UI
              design in React.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Created by Akshay | Event Management System
        </p>

      </div>
    </div>
  );
};

export default About;
