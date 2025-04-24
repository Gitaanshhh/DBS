import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from "../../hooks/useModal";
import VenueCard from "../../components/VenueCard";
import styles from "./ExploreVenues.module.css";

const ExploreVenues = () => {
  const {
    mapModalOpen,
    galleryModalOpen,
    selectedVenue,
    openMapModal,
    closeMapModal,
    openGalleryModal,
    closeGalleryModal,
  } = useModal();

  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapModalRef = React.useRef(null);
  const galleryModalRef = React.useRef(null);

  // Fetch venues
  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/venues/');
      if (!response.ok) throw new Error('Failed to fetch venues');
      const data = await response.json();
      setVenues(data.Venues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const bookVenue = (venueData) => {
    localStorage.setItem('selectedVenue', JSON.stringify(venueData));
    navigate(`/booking/${venueData.venue_id}`);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Explore Venues</h1>

      {loading && <div>Loading venues...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.venuesGrid}>
        {venues.map((venue) => (
          <VenueCard
            key={venue.venue_id}
            venue={venue}
            onBook={() => bookVenue(venue)}
            onMapClick={() => openMapModal(venue)}
            onGalleryClick={() => openGalleryModal(venue)}
          />
        ))}
      </div>

      {/* Map Modal */}
      {mapModalOpen && selectedVenue && (
        <div className={styles.mapModal} ref={mapModalRef}>
          <div className={styles.mapModalContent}>
            <button className={styles.closeModal} onClick={closeMapModal}>×</button>
            <div className={styles.mapContainer}>
              {/* Map implementation */}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModalOpen && selectedVenue && (
        <div className={styles.galleryModal} ref={galleryModalRef}>
          <div className={styles.galleryModalContent}>
            <button className={styles.closeModal} onClick={closeGalleryModal}>×</button>
            <div className={styles.galleryContainer}>
              {/* Gallery implementation */}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ExploreVenues;
