import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const { state } = useLocation(); // Data from EventDetails
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state) return <div className="pt-32 text-center">No event data. <button onClick={() => navigate("/")}>Go Home</button></div>;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/payment/create-checkout-session", {
        eventId: id,
        title: state.title,
        price: state.price,
      });

      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe
      }
    } catch (err) {
      console.error("Payment initialization error:", err.response?.data || err.message);
      alert("Payment failed to initialize. Ensure your Stripe Secret Key in .env is correct.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-32 flex justify-center px-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-fit">
        <div className="md:w-1/2 bg-gray-50 p-10 border-r border-gray-200">
          <p className="text-gray-400 font-bold uppercase text-xs mb-2">Summary</p>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">{state.title}</h1>
          <div className="flex justify-between font-bold text-xl border-t pt-6">
            <span>Total</span>
            <span className="text-blue-600">₹{state.price}</span>
          </div>
        </div>
        <div className="md:w-1/2 p-10 flex flex-col justify-center text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Secure Checkout</h2>
          <button 
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg ${loading ? "bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {loading ? "Redirecting..." : `Pay ₹${state.price}`}
          </button>
        </div>
      </div>
    </div>
  );
}