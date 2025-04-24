import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { useExploreVenues } from "../../hooks/useExploreVenues";
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

  const {
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    bookVenue,
    requestExchange,
  } = useExploreVenues();

  const mapModalRef = useRef(null);
  const galleryModalRef = useRef(null);

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Explore Venues</h1>

      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label htmlFor="date-filter">Date</label>
            <input
              type="date"
              id="date-filter"
              className={styles.filterInput}
              value={filters.date}
              onChange={handleFilterChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="time-filter">Time</label>
            <select id="time-filter" className={styles.filterInput}>
              <option value="">Any Time</option>
              <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
              <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
              <option value="evening">Evening (4:00 PM - 8:00 PM)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="capacity-filter">Capacity</label>
            <select id="capacity-filter" className={styles.filterInput}>
              <option value="">Any Capacity</option>
              <option value="small">Small (Up to 30)</option>
              <option value="medium">Medium (30-100)</option>
              <option value="large">Large (100-200)</option>
              <option value="xlarge">Extra Large (200+)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="location-filter">Location</label>
            <select id="location-filter" className={styles.filterInput}>
              <option value="">Any Location</option>
              <option value="academic-block-1">Academic Block 1</option>
              <option value="academic-block-2">Academic Block 2</option>
              <option value="academic-block-3">Academic Block 3</option>
              <option value="central-building">Central Building</option>
              <option value="admin-block">Administrative Block</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="equipment-filter">Equipment</label>
            <select id="equipment-filter" className={styles.filterInput}>
              <option value="">Any Equipment</option>
              <option value="projector">Projector</option>
              <option value="audio">Audio System</option>
              <option value="computers">Computers</option>
              <option value="whiteboard">Whiteboard</option>
              <option value="video-conf">Video Conferencing</option>
            </select>
          </div>
        </div>

        <button className={styles.filterBtn} onClick={applyFilters}>
          Apply Filters
        </button>
        <button
          className={`${styles.btn} ${styles.btnSecondary} ${styles.clearBtn}`}
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      <div className={styles.venuesGrid}>
        {/* Venue card for Lecture Hall A101 */}
        <div className={styles.venueCard}>
          <div className={styles.venueImage}>
            <img
              src="/assets/venues/lecture-hall-a101.jpg"
              alt="Lecture Hall A101"
            />
            <div
              className={styles.venueGalleryBtn}
              onClick={() => openGalleryModal("Lecture Hall A101")}
            >
              <i className="fas fa-images"></i> View Gallery
            </div>
          </div>
          <div className={styles.venueContent}>
            <h3 className={styles.venueTitle}>Lecture Hall A101</h3>
            <p className={styles.venueLocation}>
              <i className="fas fa-map-marker-alt"></i> Academic Block 1, Ground
              Floor
            </p>
            <p className={styles.venueCapacity}>
              <i className="fas fa-users"></i> Capacity: 120 people
            </p>

            <div className={styles.venueFeatures}>
              <span className={styles.feature}>Projector</span>
              <span className={styles.feature}>Air Conditioned</span>
              <span className={styles.feature}>Audio System</span>
            </div>

            <div className={styles.venueAvailability}>
              <h4>Availability on April 22, 2025</h4>
              <div className={styles.timeSlots}>
                <div className={`${styles.timeSlot} ${styles.available}`}>
                  <span className={styles.time}>8:00 AM - 12:00 PM</span>
                  <span className={styles.status}>Available</span>
                </div>
                <div className={`${styles.timeSlot} ${styles.booked}`}>
                  <span className={styles.time}>12:00 PM - 4:00 PM</span>
                  <span className={styles.status}>Booked</span>
                </div>
                <div className={`${styles.timeSlot} ${styles.available}`}>
                  <span className={styles.time}>4:00 PM - 8:00 PM</span>
                  <span className={styles.status}>Available</span>
                </div>
              </div>
            </div>

            <div className={styles.venueActions}>
              <Link to="/booking" className={styles.bookBtn}>
                Book Venue
              </Link>
              <button
                className={`${styles.btn} ${styles.btnSecondary} ${styles.exchangeBtn}`}
              >
                Ask for Exchange
              </button>
            </div>

            <div className={styles.venueMapLink}>
              <a
                href="#"
                className={styles.mapLink}
                onClick={(e) => {
                  e.preventDefault();
                  openMapModal("Lecture Hall A101");
                }}
              >
                <i className="fas fa-map"></i> How to get here
              </a>
            </div>
          </div>
        </div>

        {/* More venue cards would go here */}
      </div>

      {/* Map Modal */}
      {mapModalOpen && (
        <div className={styles.mapModal} id="mapModal">
          <div className={styles.mapModalContent} ref={mapModalRef}>
            <span className={styles.closeModal} onClick={closeMapModal}>
              &times;
            </span>
            <h2>
              How to get to <span>{selectedVenue}</span>
            </h2>
            <div className={styles.mapContainer}>
              <img src="/assets/map.jpg" alt="Map" />
            </div>
            <div className={styles.directions}>
              <h3>Directions:</h3>
              <ol>
                <li>Enter through the main campus gate</li>
                <li>Turn right at the information center</li>
                <li>Walk straight for 200 meters</li>
                <li>The building will be on your left</li>
                <li>Take the elevator/stairs to the specified floor</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModalOpen && (
        <div className={styles.galleryModal} id="galleryModal">
          <div className={styles.galleryModalContent} ref={galleryModalRef}>
            <span className={styles.closeModal} onClick={closeGalleryModal}>
              &times;
            </span>
            <h2>
              <span>{selectedVenue}</span> Gallery
            </h2>
            <div className={styles.galleryContainer}>
              <div className={styles.galleryImage}>
                <img
                  src="/assets/venues/lecture-hall-a101-1.jpg"
                  alt="Venue Image 1"
                />
              </div>
              <div className={styles.galleryImage}>
                <img
                  src="/assets/venues/lecture-hall-a101-2.jpg"
                  alt="Venue Image 2"
                />
              </div>
              <div className={styles.galleryImage}>
                <img
                  src="/assets/venues/lecture-hall-a101-3.jpg"
                  alt="Venue Image 3"
                />
              </div>
              <div className={styles.galleryImage}>
                <img
                  src="/assets/venues/lecture-hall-a101-4.jpg"
                  alt="Venue Image 4"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ExploreVenues;
