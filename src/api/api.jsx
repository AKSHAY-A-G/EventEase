import axios from "axios";

// If VITE_API_URL is set (in Netlify), use it. Otherwise use localhost (for your laptop).
const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: backendUrl, 
});

export default api;