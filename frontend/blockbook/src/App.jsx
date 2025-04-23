import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ExploreVenues from "./pages/ExploreVenues";
import Community from "./pages/Community";
import MyBookings from "./pages/MyBookings";
import Inbox from "./pages/Inbox";
import Notifications from "./pages/Notifications";
import Booking from "./pages/Booking";
import Approval from "./pages/Approval";
import "./styles/global.css";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public route - Landing page with login */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "faculty" ||
              user.role === "swo" ||
              user.role === "security" ? (
                <Navigate to="/approval" replace />
              ) : (
                <Navigate to="/app/home" replace />
              )
            ) : (
              <Landing />
            )
          }
        />

        {/* Protected student/student-council routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute allowedRoles={["student", "student-council"]}>
              <div className="app">
                <Header />
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="explore-venues" element={<ExploreVenues />} />
                  <Route path="community" element={<Community />} />
                  <Route path="my-bookings" element={<MyBookings />} />
                  <Route path="inbox" element={<Inbox />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="booking" element={<Booking />} />
                </Routes>
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Faculty approval page - protected for faculty roles */}
        <Route
          path="/approval"
          element={
            <ProtectedRoute
              allowedRoles={["faculty", "swo", "security", "student-council"]}
            >
              <Approval />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
