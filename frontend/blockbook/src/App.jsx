import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ExploreVenues from './pages/ExploreVenues';
import Community from './pages/Community';
import MyBookings from './pages/MyBookings';
import Inbox from './pages/Inbox';
import Notifications from './pages/Notifications';
import Booking from './pages/Booking';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore-venues" element={<ExploreVenues />} />
          <Route path="/community" element={<Community />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
