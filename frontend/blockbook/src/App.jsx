import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import ExploreVenues from './pages/ExploreVenues';
import Community from './pages/Community';
import MyBookings from './pages/MyBookings';
import Notifications from './pages/Notifications';
import Booking from './pages/Booking';
import Approval from './pages/Approval';
import './styles/global.css';

// We need to create a wrapper component for AuthProvider since it uses useNavigate
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

// Main app component with routes
const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  return (
    <Routes>
      {/* Public landing/login page */}
      <Route path="/" element={
        user ? (
          // If already logged in, redirect based on role
          user.role === 'faculty' || user.role === 'swo' || user.role === 'security' ? 
            <Navigate to="/approval" replace /> : 
            <Navigate to="/app/home" replace />
        ) : (
          <Landing />
        )
      } />
      
      {/* Student and Student Council routes */}
      <Route path="/app/*" element={
        <ProtectedRoute allowedRoles={['student', 'student-council']}>
          <div className="app">
            <Header />
            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="explore-venues" element={<ExploreVenues />} />
              <Route path="community" element={<Community />} />
              <Route path="my-bookings" element={<MyBookings />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="booking" element={<Booking />} />
              <Route path="*" element={<Navigate to="/app/home" replace />} />
            </Routes>
            <Footer />
          </div>
        </ProtectedRoute>
      } />
      
      {/* Faculty, SWO, Security approval page */}
      <Route path="/approval" element={
        <ProtectedRoute allowedRoles={['faculty', 'swo', 'security', 'student-council']}>
          <Approval />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <AppWithAuth />
    </Router>
  );
}

export default App;
