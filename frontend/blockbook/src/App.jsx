import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/common/Header/index.jsx';
import Footer from './components/common/Footer/index.jsx';
import Landing from './pages/Landing/index.jsx';
import Home from './pages/Home/index.jsx';
import ExploreVenues from './pages/ExploreVenues/index.jsx';
import Community from './pages/Community';
import MyBookings from './pages/MyBookings';
import Notifications from './pages/Notifications';
import Booking from './pages/Booking';
import Approval from './pages/Approval';
import './styles/global.css';
import { useAuth } from './context/AuthContext';

/**
 * Main App component that sets up routing and authentication
 * Routes are protected based on user roles:
 * - Admin: Access to all pages
 * - Student and Student Council: Home, Explore, Community, My Bookings, Notifications
 * - Faculty, SWO, Security: Approval page and other authorized pages
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public route - Landing/Login page */}
        <Route path="/" element={<Landing />} />
        
        {/* Protected routes wrapped with authentication */}
        <Route element={
          <AuthProvider>
            <ProtectedLayout />
          </AuthProvider>
        }>
          {/* Home page - accessible to all authenticated users */}
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['admin', 'student', 'student-council', 'faculty', 'swo', 'security']}>
              <Home />
            </ProtectedRoute>
          } />

          {/* Student and Student Council specific routes */}
          <Route path="/explore" element={
            <ProtectedRoute allowedRoles={['admin', 'student', 'student-council']}>
              <ExploreVenues />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute allowedRoles={['admin', 'student', 'student-council']}>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute allowedRoles={['admin', 'student', 'student-council']}>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['admin', 'student', 'student-council']}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/booking/:venueId" element={
            <ProtectedRoute allowedRoles={['admin', 'student', 'student-council']}>
              <Booking />
            </ProtectedRoute>
          } />
          
          {/* Approval routes for authorized roles */}
          <Route path="/approvals" element={
            <ProtectedRoute allowedRoles={['admin', 'student-council', 'faculty', 'swo', 'security']}>
              <Approval />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route redirects to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

/**
 * Protected layout component that wraps all authenticated routes
 * Shows loading spinner while checking auth status
 * Redirects to login if user is not authenticated
 */
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
