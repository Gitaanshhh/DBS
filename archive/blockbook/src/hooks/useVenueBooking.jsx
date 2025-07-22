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
    // Ensure we have a valid venue data object
    if (!venueData) {
      console.error('No venue data provided');
      return;
    }

    // Store venue information in localStorage to pass to the booking page
    localStorage.setItem('selectedVenue', JSON.stringify(venueData));
    
    // Ensure we have a valid venue ID
    const venueId = venueData.venue_id;
    if (!venueId) {
      console.error('No venue ID found in venue data:', venueData);
      return;
    }
    
    // Navigate to the booking page with venue ID
    navigate(`/booking/${venueId}`);
  };
  
  return {
    currentDate,
    handleBookVenue
  };
}; 