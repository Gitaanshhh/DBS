import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVenueBooking } from '../../hooks/useVenueBooking';
import VenueCard from '../../components/VenueCard';
import styles from './Home.module.css';

const Home = () => {
  console.log("Home component loaded"); // Debug: see if Home component is loaded
  const { currentDate, handleBookVenue } = useVenueBooking();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      console.log("Trying to fetch venues from backend...");
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8000/api/venues/');
        console.log("Fetch response:", response);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch venues: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched data:", data);
        
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
        console.log("Venues loaded in Home:", venuesData); // Debug: see what is loaded
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Get the first 3 venues for the home page
  const featuredVenues = venues.slice(0, 3);

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
    // Always navigate to the booking page for this venue
    navigate(`/booking/${venue.venue_id}`);
  };

  return (
    <main className={styles.main}>
      {/* Hero section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Book College Venues & Rooms</h1>
          <p>Easy booking system for academic spaces, seminar halls, and event venues</p>
        </div>
      </section>

      <section className={styles.browseVenues}>
        <h2 className={styles.sectionTitle}>Browse Venues</h2>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading venues...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>Error loading venues: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <div className={styles.venuesGrid}>
              {featuredVenues.length === 0 ? (
                <div className={styles.noVenues}>
                  <p>No venues found.</p>
                </div>
              ) : (
                featuredVenues.map((venue) => (
                  <VenueCard 
                    key={venue.venue_id} 
                    venue={venue} 
                    onBook={() => handleVenueClick(venue)}
                    showDetails={false}
                  />
                ))
              )}
            </div>
            
            {venues.length > 3 && (
              <div className={styles.viewMoreContainer}>
                <Link to="/explore" className={styles.viewMoreButton}>
                  View More Venues
                </Link>
              </div>
            )}
          </>
        )}
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