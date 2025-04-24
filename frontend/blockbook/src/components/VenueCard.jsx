import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VenueCard.module.css';

/**
 * VenueCard component to display venue information
 * @param {Object} props - Component props
 * @param {Object} props.venue - Venue data object
 * @param {Function} props.onBook - Function to handle booking a venue
 * @param {boolean} props.showDetails - Whether to show detailed information
 */
const VenueCard = ({ venue, onBook, showDetails = false }) => {
  const navigate = useNavigate();
  
  // Get hardcoded image based on venue name
  const getVenueImage = (venueName) => {
    const imageMap = {
      'Main Hall A101': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Seminar Room B204': 'https://images.unsplash.com/photo-1588075592446-265bad1d6d8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Computer Lab C103': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Main Auditorium': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Conference Room D105': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'Student Plaza': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    return imageMap[venueName] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };
  
  // Handle booking the venue
  const handleBook = () => {
    if (onBook) {
      onBook(venue);
    } else {
      // Default behavior if no onBook function is provided
      localStorage.setItem('selectedVenue', JSON.stringify(venue));
      navigate(`/booking/${venue.venue_id}`, { replace: true });
    }
  };
  
  // Format features as a list if they exist
  const featuresList = venue.features 
    ? (typeof venue.features === 'string' 
        ? venue.features.split(',').map(f => f.trim()) 
        : venue.features)
    : [];
  
  return (
    <div className={styles.venueCard}>
      <div className={styles.venueImage}>
        <img src={getVenueImage(venue.venue_name)} alt={venue.venue_name} />
      </div>
      
      <div className={styles.venueInfo}>
        <h3 className={styles.venueName}>{venue.venue_name}</h3>
        
        <div className={styles.venueDetails}>
          <p className={styles.venueLocation}>
            {venue.building_name ? `${venue.building_name}` : ''}
            {venue.floor_number ? `, Floor ${venue.floor_number}` : ''}
          </p>
          
          <p className={styles.venueCapacity}>
            Capacity: {venue.seating_capacity} people
          </p>
          
          {showDetails && featuresList.length > 0 && (
            <div className={styles.venueFeatures}>
              <h4>Features:</h4>
              <ul>
                {featuresList.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button 
          className={styles.bookButton}
          onClick={handleBook}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default VenueCard; 