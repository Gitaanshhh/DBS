import React, { useState, useEffect } from 'react';
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
  const [showModal, setShowModal] = useState(false);
  const [venueDetails, setVenueDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debug log when component receives venue prop
  useEffect(() => {
    console.log('Venue prop received:', venue);
  }, [venue]);
  
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
      navigate(`/booking/${venue.VENUE_ID || venue.venue_id}`, { replace: true });
    }
  };

  // Fetch venue details
  const fetchVenueDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const venueId = venue.VENUE_ID || venue.venue_id;
      console.log('Fetching details for venue ID:', venueId);
      
      const response = await fetch(`http://localhost:8000/api/venue-details/?venue_id=${venueId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch venue details');
      }
      const data = await response.json();
      console.log('Venue details received:', data);
      setVenueDetails(data.venue);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching venue details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Format features as a list if they exist
  const featuresList = venue?.FEATURES || venue?.features
    ? (typeof (venue.FEATURES || venue.features) === 'string' 
        ? (venue.FEATURES || venue.features).split(',').map(f => f.trim()) 
        : (venue.FEATURES || venue.features))
    : [];

  // Handle case sensitivity in property names
  const venueName = venue?.VENUE_NAME || venue?.venue_name;
  const buildingName = venue?.BUILDING_NAME || venue?.building_name;
  const floorNumber = venue?.FLOOR_NUMBER || venue?.floor_number;
  const seatingCapacity = venue?.SEATING_CAPACITY || venue?.seating_capacity;

  console.log('Rendering venue card with data:', {
    venueName,
    buildingName,
    floorNumber,
    seatingCapacity,
    featuresList
  });
  
  if (!venue) {
    console.error('No venue data provided to VenueCard');
    return null;
  }

  return (
    <>
      <div className={styles.venueCard}>
        <div className={styles.venueImage}>
          <img src={getVenueImage(venueName)} alt={venueName || 'Venue'} />
          {showDetails && (
            <button 
              className={styles.detailsBtn}
              onClick={fetchVenueDetails}
              disabled={loading}
            >
              View Details
            </button>
          )}
        </div>
        <div className={styles.venueContent}>
          <h3 className={styles.venueTitle}>{venueName || 'Unnamed Venue'}</h3>
          <div className={styles.venueLocation}>
            <i className="fas fa-map-marker-alt"></i>
            {buildingName && `${buildingName}${floorNumber ? `, Floor ${floorNumber}` : ''}`}
          </div>
          <div className={styles.venueCapacity}>
            <i className="fas fa-users"></i>
            Capacity: {seatingCapacity || 0} people
          </div>
          {featuresList.length > 0 && (
            <div className={styles.venueFeatures}>
              {featuresList.map((feature, index) => (
                <span key={index} className={styles.feature}>{feature}</span>
              ))}
            </div>
          )}
          <button className={styles.bookBtn} onClick={handleBook}>
            Book Now
          </button>
        </div>
      </div>

      {/* Venue Details Modal */}
      {showModal && venueDetails && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            <div className={styles.modalHeader}>
              <h2>{venueDetails.venue_name}</h2>
              <span className={styles.venueType}>{venueDetails.venue_type}</span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalImage}>
                <img src={getVenueImage(venueDetails.venue_name)} alt={venueDetails.venue_name} />
              </div>
              <div className={styles.modalInfo}>
                <div className={styles.infoSection}>
                  <h3>Location</h3>
                  <p>
                    <i className="fas fa-building"></i> {venueDetails.building_name}
                    {venueDetails.floor_number && <span>, Floor {venueDetails.floor_number}</span>}
                  </p>
                  <p><i className="fas fa-map-marker-alt"></i> {venueDetails.building_location}</p>
                </div>
                <div className={styles.infoSection}>
                  <h3>Capacity & Type</h3>
                  <p><i className="fas fa-users"></i> {venueDetails.seating_capacity} people</p>
                  <p>
                    <i className="fas fa-door-open"></i>
                    {venueDetails.is_indoor === 'Y' ? 'Indoor Venue' : 'Outdoor Venue'}
                  </p>
                </div>
                {venueDetails.description && (
                  <div className={styles.infoSection}>
                    <h3>Description</h3>
                    <p>{venueDetails.description}</p>
                  </div>
                )}
                {venueDetails.features && (
                  <div className={styles.infoSection}>
                    <h3>Features & Amenities</h3>
                    <div className={styles.featureGrid}>
                      {venueDetails.features.split(',').map((feature, index) => (
                        <span key={index} className={styles.feature}>{feature.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.infoSection}>
                  <h3>Availability Schedule</h3>
                  <div className={styles.availabilityGrid}>
                    {venueDetails.availability.map((slot) => (
                      <div 
                        key={slot.availability_id} 
                        className={`${styles.timeSlot} ${slot.is_available === 'Y' ? styles.available : styles.booked}`}
                      >
                        <span className={styles.day}>{slot.day_of_week}</span>
                        <span className={styles.time}>{slot.start_time} - {slot.end_time}</span>
                        <span className={styles.status}>
                          {slot.is_available === 'Y' ? 'Available' : 'Booked'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {venueDetails.manager_contact && (
                  <div className={styles.infoSection}>
                    <h3>Contact Information</h3>
                    <p>
                      <i className="fas fa-phone"></i>
                      Venue Manager: {venueDetails.manager_contact}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.bookBtn} onClick={handleBook}>
                Book This Venue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </>
  );
};

export default VenueCard; 