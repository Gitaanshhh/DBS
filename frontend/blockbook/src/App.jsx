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

// Import useAuth at the top of the file
import { useAuth } from './context/AuthContext';

// Main App component
function App() {
  return (
    <Router>
      <Routes>
        {/* Public route - Landing page should be outside AuthProvider */}
        <Route path="/" element={<Landing />} />
        
        {/* All protected routes wrapped with AuthProvider */}
        <Route element={
          <AuthProvider>
            <ProtectedLayout />
          </AuthProvider>
        }>
          {/* Student and Student Council routes */}
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={['admin','student', 'student-council']}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute allowedRoles={['admin','student', 'student-council']}>
              <ExploreVenues />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute allowedRoles={['admin','student', 'student-council']}>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute allowedRoles={['admin','student', 'student-council']}>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['admin','student', 'student-council']}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/booking/:id" element={
            <ProtectedRoute allowedRoles={['admin','student', 'student-council']}>
              <Booking />
            </ProtectedRoute>
          } />
          
          {/*SC, Faculty, SWO, Security approval page */}
          <Route path="/approvals" element={
            <ProtectedRoute allowedRoles={['admin','student-council','faculty', 'swo', 'security']}>
              <Approval />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

// Protected layout component with Header and Footer
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
