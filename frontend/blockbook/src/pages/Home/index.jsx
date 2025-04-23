import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVenueBooking } from '../../hooks/useVenueBooking';
import styles from './Home.module.css';
import { getVenues } from '../../api/venues';

const Home = () => {
  const { currentDate, handleBookVenue } = useVenueBooking();
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch venues from backend
    getVenues().then(data => {
      // Always extract the array of venues from the backend response
      if (Array.isArray(data)) {
        setVenues(data);
      } else if (data && (Array.isArray(data.Venues) || Array.isArray(data.venues))) {
        setVenues(data.Venues || data.venues);
      } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
        // If backend returns an object with venue_id keys (edge case)
        setVenues(Object.values(data));
      } else {
        setVenues([]);
      }
    });
  }, []);

  const handleVenueClick = (venue) => {
    // Prepare venue data for booking page
    const venueData = {
      title: venue.venue_name,
      location: `${venue.building_name || ''}${venue.floor_number ? ', Floor ' + venue.floor_number : ''}`,
      capacity: `Capacity: ${venue.seating_capacity} people`,
      image: venue.image_url,
      features: venue.features ? venue.features.split(',').map(f => f.trim()) : [],
      id: venue.venue_id
    };
    handleBookVenue(venueData);
    navigate('/booking');
  };

  return (
    <main className={styles.main}>
      {/* Hero section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Book College Venues & Rooms</h1>
          <p>Easy booking system for academic spaces, seminar halls, and event venues</p>
          <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
            <select aria-label="Venue type" required>
              <option value="" disabled selected>Select Venue Type</option>
              <option value="classroom">Classroom</option>
              <option value="seminar">Seminar Hall</option>
              <option value="lab">Laboratory</option>
              <option value="library">Library Space</option>
              <option value="conference">Conference Room</option>
              <option value="outdoor">Outdoor Space</option>
            </select>
            <input 
              type="date" 
              aria-label="Date" 
              required 
              min={currentDate}
              defaultValue={currentDate}
            />
            <select aria-label="Time slot" required>
              <option value="" disabled selected>Select Time Slot</option>
              <option value="morning">8:00 AM - 12:00 PM</option>
              <option value="afternoon">12:00 PM - 4:00 PM</option>
              <option value="evening">4:00 PM - 8:00 PM</option>
            </select>
            <button type="submit">Find Available Venues</button>
          </form>
        </div>
      </section>

      <section className={styles.browseVenues}>
        <h2 className={styles.sectionTitle}>Browse Venues</h2>
        <div className={styles.venues}>
          {venues.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
              No venues found.
            </div>
          )}
          {venues.map((venue) => (
            <div
              key={venue.venue_id}
              className={styles.venue}
              onClick={() => handleVenueClick(venue)}
              style={{ cursor: 'pointer' }}
            >
              <img src={venue.image_url} alt={venue.venue_name} />
              <div className={styles.venueContent}>
                <div>
                  <h3 className={styles.venueTitle}>{venue.venue_name}</h3>
                  <p className={styles.venueLocation}>
                    <i className="fas fa-map-marker-alt"></i> {venue.building_name || '—'}{venue.floor_number ? `, Floor ${venue.floor_number}` : ''}
                  </p>
                  <p className={styles.venueCapacity}>
                    <i className="fas fa-users"></i> Capacity: {venue.seating_capacity} people
                  </p>
                  <div className={styles.venueFeatures}>
                    {venue.features && venue.features.split(',').map((feature, idx) => (
                      <span className={styles.feature} key={idx}>{feature.trim()}</span>
                    ))}
                  </div>
                </div>
                <button
                  className={styles.bookBtn}
                  onClick={e => {
                    e.stopPropagation();
                    handleVenueClick(venue);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className={styles.bookingRequests}>
        <h2 className={styles.sectionTitle}>Your Booking Requests</h2>
        <div className={styles.booking}>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingVenue}>Seminar Hall 1</p>
            <p className={styles.bookingDate}>
              <i className="far fa-calendar-alt"></i> April 20, 2025
            </p>
            <p className={styles.bookingTime}>
              <i className="far fa-clock"></i> 12:00 PM - 4:00 PM
            </p>
          </div>
          <div className={`${styles.bookingStatus} ${styles.statusPending}`}>Pending</div>
        </div>
        
        <div className={styles.booking}>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingVenue}>Computer Lab B204</p>
            <p className={styles.bookingDate}>
              <i className="far fa-calendar-alt"></i> April 25, 2025
            </p>
            <p className={styles.bookingTime}>
              <i className="far fa-clock"></i> 8:00 AM - 12:00 PM
            </p>
          </div>
          <div className={`${styles.bookingStatus} ${styles.statusApproved}`}>Approved</div>
        </div>
        
        <div className={styles.booking}>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingVenue}>Main Auditorium</p>
            <p className={styles.bookingDate}>
              <i className="far fa-calendar-alt"></i> May 5, 2025
            </p>
            <p className={styles.bookingTime}>
              <i className="far fa-clock"></i> 4:00 PM - 8:00 PM
            </p>
          </div>
          <div className={`${styles.bookingStatus} ${styles.statusRejected}`}>Rejected</div>
        </div>
      </section>
      
      <section className={styles.pastBookings}>
        <h2 className={styles.sectionTitle}>Your Past Bookings</h2>
        <div className={styles.booking}>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingVenue}>Lecture Hall A101</p>
            <p className={styles.bookingDate}>
              <i className="far fa-calendar-alt"></i> March 15, 2025
            </p>
            <p className={styles.bookingTime}>
              <i className="far fa-clock"></i> 8:00 AM - 12:00 PM
            </p>
          </div>
          <div className={`${styles.bookingStatus} ${styles.statusCompleted}`}>Completed</div>
        </div>
        
        <div className={styles.booking}>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingVenue}>Student Plaza</p>
            <p className={styles.bookingDate}>
              <i className="far fa-calendar-alt"></i> March 10, 2025
            </p>
            <p className={styles.bookingTime}>
              <i className="far fa-clock"></i> 4:00 PM - 8:00 PM
            </p>
          </div>
          <div className={`${styles.bookingStatus} ${styles.statusCompleted}`}>Completed</div>
        </div>
        
        <div className={styles.booking}>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingVenue}>Conference Room C103</p>
            <p className={styles.bookingDate}>
              <i className="far fa-calendar-alt"></i> February 28, 2025
            </p>
            <p className={styles.bookingTime}>
              <i className="far fa-clock"></i> 12:00 PM - 4:00 PM
            </p>
          </div>
          <div className={`${styles.bookingStatus} ${styles.statusCompleted}`}>Completed</div>
        </div>
      </section>
    </main>
  );
};

export default Home;
