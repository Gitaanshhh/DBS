import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { getVenues } from '../../api/venues'; // adjust path if needed


const Home = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    getVenues().then((data) => {
      // Accept both array and object with Venues/venues key
      if (Array.isArray(data)) {
        setVenues(data);
      } else if (data && (Array.isArray(data.Venues) || Array.isArray(data.venues))) {
        setVenues(data.Venues || data.venues);
      } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
        setVenues(Object.values(data));
      } else {
        setVenues([]);
      }
    });
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to BlockBook</h1>
          <p>Find and book venues for your events effortlessly.</p>
        </div>
      </div>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search venues..." />
        <select>
          <option value="">Category</option>
          <option value="conference">Conference</option>
          <option value="wedding">Wedding</option>
          <option value="party">Party</option>
        </select>
        <button>Search</button>
      </div>
      <h2 className={styles.sectionTitle}>Venues</h2>
      <div className={styles.venues}>
        {venues.map((venue: any) => (
          <div className={styles.venue} key={venue.venue_id}>
            <img src={venue.image_url} alt={venue.venue_name} />
            <div className={styles.venueContent}>
              <h3 className={styles.venueTitle}>{venue.venue_name}</h3>
              <p className={styles.venueLocation}>
                <i className="fas fa-map-marker-alt"></i> {venue.building_name || '—'}
                {venue.floor_number ? `, Floor ${venue.floor_number}` : ''}
              </p>
              <p className={styles.venueCapacity}>
                <i className="fas fa-users"></i> Capacity: {venue.seating_capacity}
              </p>
              <div className={styles.venueFeatures}>
                {venue.features && venue.features.split(',').map((feature: string, index: number) => (
                  <span className={styles.feature} key={index}>
                    {feature.trim()}
                  </span>
                ))}
              </div>
              <button className={styles.bookBtn}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;