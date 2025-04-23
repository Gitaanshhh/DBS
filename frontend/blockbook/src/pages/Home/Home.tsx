import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { getVenues } from '../../api/venues'; // adjust path if needed

const Home = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    getVenues().then((data) => {
      setVenues(data);
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
        {venues.map((venue) => (
          <div className={styles.venue} key={venue.id}>
            <img src={venue.image} alt={venue.name} />
            <div className={styles.venueContent}>
              <h3 className={styles.venueTitle}>{venue.name}</h3>
              <p className={styles.venueLocation}>
                <i className="fas fa-map-marker-alt"></i> {venue.location}
              </p>
              <p className={styles.venueCapacity}>
                <i className="fas fa-users"></i> Capacity: {venue.capacity}
              </p>
              <div className={styles.venueFeatures}>
                {venue.features.map((feature, index) => (
                  <span className={styles.feature} key={index}>
                    {feature}
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