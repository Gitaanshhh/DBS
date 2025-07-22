import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useVenueBooking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);

  const handleBookVenue = async (venueId, venueData) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to book a venue');
      }

      if (!venueId) {
        throw new Error('No venue selected for booking');
      }

      // Ensure venueData is an object
      const venueInfo = typeof venueData === 'object' ? venueData : {};

      // Store venue data in localStorage
      localStorage.setItem('selectedVenue', JSON.stringify({
        venue_id: venueId,
        ...venueInfo,
        selectedDate: new Date().toISOString()
      }));

      // Navigate to booking page
      navigate(`/booking/${venueId}`);
    } catch (err) {
      setError(err.message);
      if (!user) {
        // Redirect to landing page with return URL
        navigate('/', { state: { from: `/explore` } });
      }
    }
  };

  const clearError = () => setError(null);

  return {
    handleBookVenue,
    error,
    clearError
  };
};

export default useVenueBooking;
