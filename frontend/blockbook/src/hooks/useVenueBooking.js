import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVenueBooking = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  }, []);
  
  const handleBookVenue = (venueData) => {
    // Store venue information in localStorage to pass to the booking page
    localStorage.setItem('selectedVenue', JSON.stringify(venueData));
    
    // Navigate to the booking page
    navigate('/booking');
  };
  
  return {
    currentDate,
    handleBookVenue
  };
};
