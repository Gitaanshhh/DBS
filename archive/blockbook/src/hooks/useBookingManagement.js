import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBookingManagement = (initialBookings) => {
  const [bookings, setBookings] = useState(initialBookings || {
    upcoming: [],
    pending: [],
    rejected: [],
    history: []
  });
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();
  
  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };
  
  const cancelBooking = (booking, tabName) => {
    const venueName = booking.venueName;
    
    if (confirm(`Are you sure you want to cancel your booking for ${venueName}?`)) {
      alert('Booking cancelled successfully.');
      
      // Remove from current tab
      const updatedBookings = {...bookings};
      updatedBookings[tabName] = bookings[tabName].filter(b => b.id !== booking.id);
      
      // Add to rejected tab with updated status
      const cancelledBooking = {
        ...booking,
        status: 'cancelled',
        statusText: 'Cancelled by You'
      };
      
      updatedBookings.rejected = [...bookings.rejected, cancelledBooking];
      
      setBookings(updatedBookings);
      switchTab('rejected');
    }
  };
  
  const checkStatus = (booking) => {
    alert(`Checking status of booking for ${booking.venueName}... Status: Still under review.`);
  };
  
  const bookAgain = (booking) => {
    // Extract capacity from the venue name
    let capacity = "100 people";
    if (booking.venueName.includes("Lecture Hall")) {
      capacity = "120 people";
    } else if (booking.venueName.includes("Computer Lab")) {
      capacity = "60 workstations";
    } else if (booking.venueName.includes("Seminar Hall")) {
      capacity = "150 people";
    } else if (booking.venueName.includes("Auditorium")) {
      capacity = "500 people";
    } else if (booking.venueName.includes("Student Plaza")) {
      capacity = "300+ people";
    } else if (booking.venueName.includes("Conference Room")) {
      capacity = "25 people";
    }
    
    // Store venue information in localStorage
    localStorage.setItem('selectedVenue', JSON.stringify({
      title: booking.venueName,
      location: booking.venueLocation,
      capacity: capacity,
      image: booking.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }));
    
    // Navigate to booking page
    navigate('/booking');
  };
  
  const modifyBooking = (booking) => {
    alert(`Redirecting to modify booking for ${booking.venueName}...`);
    // In a real app, this would navigate to a booking modification page
  };
  
  const bookAlternative = () => {
    navigate('/explore-venues');
  };
  
  return {
    bookings,
    activeTab,
    switchTab,
    cancelBooking,
    checkStatus,
    bookAgain,
    modifyBooking,
    bookAlternative
  };
};
