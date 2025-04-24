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
  
  // Handle booking the venue
  const handleBook = () => {
    if (onBook) {
      onBook(venue);
    } else {
      // Default behavior if no onBook function is provided
      localStorage.setItem('selectedVenue', JSON.stringify(venue));
      navigate('/booking');
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
        {venue.image_url ? (
          <img src={venue.image_url} alt={venue.venue_name} />
        ) : (
          <div className={styles.placeholderImage}>No Image</div>
        )}
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