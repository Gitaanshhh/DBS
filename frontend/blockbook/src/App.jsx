import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Main App component
function App() {
  return (
    <Router>
      <Routes>
        {/* Public route - Landing page should be outside AuthProvider */}
        <Route path="/" element={<Landing />} />
        
        {/* All protected routes wrapped with AuthProvider */}
        <Route path="/*" element={
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        } />
      </Routes>
    </Router>
  );
}

// Protected routes component
const AppRoutes = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <Routes>
          {/* Student and Student Council routes */}
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['student', 'student-council']}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute allowedRoles={['student', 'student-council']}>
              <ExploreVenues />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute allowedRoles={['student', 'student-council']}>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute allowedRoles={['student', 'student-council']}>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['student', 'student-council']}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/booking/:id" element={
            <ProtectedRoute allowedRoles={['student', 'student-council']}>
              <Booking />
            </ProtectedRoute>
          } />
          
          {/* Faculty, SWO, Security approval page */}
          <Route path="/approvals" element={
            <ProtectedRoute allowedRoles={['faculty', 'swo', 'security']}>
              <Approval />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
