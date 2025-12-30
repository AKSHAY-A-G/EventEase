import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// User Pages
import Home from "./pages/user/Home";
import Events from "./pages/user/Events";
import Login from "./pages/user/Login";
import About from "./pages/user/About";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import EventDetails from "./pages/user/EventDetails";
import Dashboard from "./pages/user/Dashboard";
import EditProfile from "./pages/user/EditProfile";
import PaymentPage from "./pages/user/PaymentPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvent from "./pages/admin/ManageEvent";
import EventRegistrations from "./pages/admin/EventRegistrations"; 

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/**
 * Higher-Order Component to protect routes.
 * NOW USES SESSION STORAGE
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  // CHANGED: localStorage -> sessionStorage
  const isAuthenticated = !!sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  
  const hideLayout = 
    location.pathname === "/login" || 
    location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {!hideLayout && <Navbar />}

      <main className="grow"> 
        <Routes>
          {/* Landing */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          
          {/* Public Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/editProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manage-event" element={<ProtectedRoute adminOnly={true}><ManageEvent /></ProtectedRoute>} />
          <Route path="/admin/manage-event/:id" element={<ProtectedRoute adminOnly={true}><ManageEvent /></ProtectedRoute>} />
          
          {/* Admin: View Registrations */}
          <Route 
            path="/admin/registrations/:id" 
            element={
              <ProtectedRoute adminOnly={true}>
                <EventRegistrations />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;