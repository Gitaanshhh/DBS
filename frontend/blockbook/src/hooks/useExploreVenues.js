import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useExploreVenues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    capacity: '',
    building: '',
    venueType: '',
    features: '',
    availableOnly: false
  });
  
  // Fetch venues from the backend
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8000/api/venues/');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch venues: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract venues from the response
        let venuesData = [];
        if (data.Venues && Array.isArray(data.Venues)) {
          venuesData = data.Venues;
        } else if (Array.isArray(data)) {
          venuesData = data;
        } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
          venuesData = Object.values(data);
        }
        
        setVenues(venuesData);
        setFilteredVenues(venuesData);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenues();
  }, []);
  
  // Initialize date filter with current date
  useEffect(() => {
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
    // Apply filters to venues
    let filtered = [...venues];
    
    // Filter by capacity
    if (filters.capacity) {
      filtered = filtered.filter(venue => {
        const capacity = venue.seating_capacity;
        switch (filters.capacity) {
          case 'small':
            return capacity <= 50;
          case 'medium':
            return capacity > 50 && capacity <= 150;
          case 'large':
            return capacity > 150 && capacity <= 300;
          case 'xlarge':
            return capacity > 300;
          default:
            return true;
        }
      });
    }
    
    // Filter by building
    if (filters.building) {
      filtered = filtered.filter(venue => 
        venue.building_name && venue.building_name.toLowerCase().includes(filters.building.toLowerCase())
      );
    }
    
    // Filter by venue type
    if (filters.venueType) {
      filtered = filtered.filter(venue => 
        venue.venue_type && venue.venue_type.toLowerCase().includes(filters.venueType.toLowerCase())
      );
    }
    
    // Filter by features/equipment
    if (filters.features) {
      filtered = filtered.filter(venue => {
        const features = venue.features || '';
        const venueFeatures = typeof features === 'string' 
          ? features.split(',').map(f => f.trim())
          : features;
        return venueFeatures.some(feature => 
          feature.toLowerCase().includes(filters.features.toLowerCase())
        );
      });
    }
    
    // Filter by availability (this would require a separate API call in a real app)
    if (filters.availableOnly) {
      // In a real app, we would check availability with the backend
      // For now, we'll just keep all venues
    }
    
    setFilteredVenues(filtered);
  };
  
  const clearFilters = () => {
    setFilters({
      date: new Date().toISOString().split('T')[0],
      time: '',
      capacity: '',
      building: '',
      venueType: '',
      features: '',
      availableOnly: false
    });
    setFilteredVenues(venues);
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
    venues: filteredVenues,
    loading,
    error,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    bookVenue,
    requestExchange
  };
};
