import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVenueBooking } from '../../hooks/useVenueBooking';
import styles from './Home.module.css';

const Home = () => {
  const { currentDate, handleBookVenue } = useVenueBooking();
  const [categoryItems, setCategoryItems] = useState([]);
  
  useEffect(() => {
    // Simulate loading category items
    setCategoryItems(document.querySelectorAll('.category-item'));
  }, []);
  
  const handleCategoryClick = (e) => {
    // Remove active class from all items
    categoryItems.forEach(item => item.classList.remove('active'));
    // Add active class to clicked item
    e.currentTarget.classList.add('active');
  };
  
  const handleBookNow = (e, venue) => {
    e.preventDefault();
    
    // Extract venue information
    const venueCard = e.target.closest('.venue');
    const venueData = {
      title: venueCard.querySelector('.venue-title').textContent,
      location: venueCard.querySelector('.venue-location').textContent,
      capacity: venueCard.querySelector('.venue-capacity').textContent,
      image: venueCard.querySelector('img').src
    };
    
    handleBookVenue(venueData);
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
        <div className={styles.venueCategories}>
          <div className={styles.venueCategory}>
            <img src="/assets/venues/academic-block-1.jpg" alt="Academic Block 1" />
            <span>Academic Block 1</span>
          </div>
          <div className={styles.venueCategory}>
            <img src="/assets/venues/academic-block-2.jpg" alt="Academic Block 2" />
            <span>Academic Block 2</span>
          </div>
          <div className={styles.venueCategory}>
            <img src="/assets/venues/academic-block-3.jpg" alt="Academic Block 3" />
            <span>Academic Block 3</span>
          </div>
          <div className={styles.venueCategory}>
            <img src="/assets/venues/seminar-halls.jpg" alt="Seminar Halls" />
            <span>Seminar Halls</span>
          </div>
          <div className={styles.venueCategory}>
            <img src="/assets/venues/auditoriums.jpg" alt="Auditoriums" />
            <span>Auditoriums</span>
          </div>
          <div className={styles.venueCategory}>
            <img src="/assets/venues/outdoor-venues.jpg" alt="Outdoor Venues" />
            <span>Outdoor Venues</span>
          </div>
        </div>
        
        <h3>Popular Venues</h3>
        <div className={styles.venues}>
          {/* Venue cards */}
          <article className={styles.venue}>
            <img src="/assets/venues/lecture-hall-a101.jpg" alt="Lecture Hall A101" />
            <div className={styles.venueContent}>
              <div>
                <h3 className={styles.venueTitle}>Lecture Hall A101</h3>
                <p className={styles.venueLocation}>
                  <i className="fas fa-map-marker-alt"></i> Academic Block 1, Ground Floor
                </p>
                <p className={styles.venueCapacity}>
                  <i className="fas fa-users"></i> Capacity: 120 people
                </p>
                <div className={styles.venueFeatures}>
                  <span className={styles.feature}>Projector</span>
                  <span className={styles.feature}>Air Conditioned</span>
                  <span className={styles.feature}>Audio System</span>
                </div>
              </div>
              <Link to="/booking" className={styles.bookBtn}>Book Now</Link>
            </div>
          </article>
          
          {/* More venue cards would go here */}
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
