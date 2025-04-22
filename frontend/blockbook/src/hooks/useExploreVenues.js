import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useExploreVenues = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    capacity: '',
    location: '',
    equipment: '',
    availableOnly: false,
    exchangeOnly: false
  });
  
  useEffect(() => {
    // Initialize date filter with current date
    const today = new Date().toISOString().split('T')[0];
    setFilters(prev => ({
      ...prev,
      date: today
    }));
  }, []);
  
  const handleFilterChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [id.replace('-filter', '')]: type === 'checkbox' ? checked : value
    }));
  };
  
  const applyFilters = () => {
    alert('Filters applied! This would filter the venues in a real application.');
  };
  
  const clearFilters = () => {
    setFilters({
      date: new Date().toISOString().split('T')[0],
      time: '',
      capacity: '',
      location: '',
      equipment: '',
      availableOnly: false,
      exchangeOnly: false
    });
  };
  
  const bookVenue = (venueData) => {
    // Store venue information in localStorage
    localStorage.setItem('selectedVenue', JSON.stringify(venueData));
    
    // Navigate to booking page
    navigate('/booking');
  };
  
  const requestExchange = (venueTitle) => {
    alert(`Exchange request for ${venueTitle} will be sent to the current booker.`);
  };
  
  return {
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    bookVenue,
    requestExchange
  };
};
