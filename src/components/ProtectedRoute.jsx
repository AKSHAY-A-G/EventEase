import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  
  if (!userId) {
    // If no session exists, redirect and replace history so back button fails
    return <Navigate to="/login" replace />;
  }
  
  return children;
}