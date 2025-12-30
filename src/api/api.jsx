import axios from "axios";

// ❌ COMMENT THIS OUT FOR NOW
// const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ HARDCODE THE LINK DIRECTLY
const backendUrl = "https://eventease-backend-nzop.onrender.com";

const api = axios.create({
  baseURL: backendUrl, 
});

export default api;