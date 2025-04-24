import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { useExploreVenues } from "../../hooks/useExploreVenues";
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

  const {
    venues,
    loading,
    error,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    bookVenue,
    requestExchange,
  } = useExploreVenues();

  const mapModalRef = useRef(null);
  const galleryModalRef = useRef(null);

  // Get unique building names for location filter
  const buildingNames = [...new Set(venues.map(venue => venue.building_name).filter(Boolean))];
  
  // Get unique features for equipment filter
  const allFeatures = venues.reduce((features, venue) => {
    if (venue.features) {
      const venueFeatures = typeof venue.features === 'string' 
        ? venue.features.split(',').map(f => f.trim())
        : venue.features;
      return [...features, ...venueFeatures];
    }
    return features;
  }, []);
  const uniqueFeatures = [...new Set(allFeatures)];

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
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="time-filter">Time Slot</label>
            <select
              id="time-filter"
              className={styles.filterInput}
              value={filters.time}
              onChange={handleFilterChange}
            >
              <option value="">Any Time</option>
              <option value="morning">8:00 AM - 12:00 PM</option>
              <option value="afternoon">12:00 PM - 4:00 PM</option>
              <option value="evening">4:00 PM - 8:00 PM</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="capacity-filter">Capacity</label>
            <select
              id="capacity-filter"
              className={styles.filterInput}
              value={filters.capacity}
              onChange={handleFilterChange}
            >
              <option value="">Any Capacity</option>
              <option value="small">Small (&lt;= 30)</option>
              <option value="medium">Medium (31-100)</option>
              <option value="large">Large (101-200)</option>
              <option value="xlarge">Extra Large (&gt;200)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="location-filter">Location</label>
            <select
              id="location-filter"
              className={styles.filterInput}
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">Any Location</option>
              {buildingNames.map((building, index) => (
                <option key={index} value={building}>
                  {building}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="equipment-filter">Equipment</label>
            <select
              id="equipment-filter"
              className={styles.filterInput}
              value={filters.equipment}
              onChange={handleFilterChange}
            >
              <option value="">Any Equipment</option>
              {uniqueFeatures.map((feature, index) => (
                <option key={index} value={feature}>
                  {feature}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterCheckbox}>
              <input
                type="checkbox"
                id="availableOnly-filter"
                checked={filters.availableOnly}
                onChange={handleFilterChange}
              />
              Show Available Only
            </label>
          </div>
        </div>

        <div className={styles.filterActions}>
          <button className={styles.filterBtn} onClick={applyFilters}>
            Apply Filters
          </button>
          <button className={styles.clearBtn} onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

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
        <div className={styles.venuesGrid}>
          {venues.length === 0 ? (
            <div className={styles.noVenues}>
              <p>No venues found matching your criteria.</p>
            </div>
          ) : (
            venues.map((venue) => (
              <VenueCard
                key={venue.venue_id}
                venue={venue}
                onBook={() => {
                  // Prepare venue data for booking page
                  const venueData = {
                    title: venue.venue_name,
                    location: `${venue.building_name || ''}${venue.floor_number ? ', Floor ' + venue.floor_number : ''}`,
                    capacity: `Capacity: ${venue.seating_capacity} people`,
                    image: venue.image_url,
                    features: venue.features ? venue.features.split(',').map(f => f.trim()) : [],
                    id: venue.venue_id
                  };
                  // Store venue info and navigate to booking page for this venue
                  localStorage.setItem('selectedVenue', JSON.stringify(venueData));
                  window.location.href = `/booking/${venue.venue_id}`;
                }}
                showDetails={true}
              />
            ))
          )}
        </div>
      )}

      {/* Map Modal */}
      {mapModalOpen && (
        <div className={styles.mapModal} onClick={(e) => handleOutsideClick(e, mapModalRef)}>
          <div className={styles.mapModalContent} ref={mapModalRef}>
            <span className={styles.closeModal} onClick={closeMapModal}>
              &times;
            </span>
            <h2>How to get to {selectedVenue}</h2>
            <div className={styles.mapContainer}>
              <img src="/assets/map-placeholder.jpg" alt="Campus Map" />
            </div>
            <div className={styles.directions}>
              <h3>Directions:</h3>
              <ol>
                <li>Enter the main gate of the campus</li>
                <li>Take the first right after the fountain</li>
                <li>Continue straight until you reach the building</li>
                <li>The venue is located on the ground floor</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModalOpen && (
        <div className={styles.galleryModal} onClick={(e) => handleOutsideClick(e, galleryModalRef)}>
          <div className={styles.galleryModalContent} ref={galleryModalRef}>
            <span className={styles.closeModal} onClick={closeGalleryModal}>
              &times;
            </span>
            <h2>{selectedVenue} Gallery</h2>
            <div className={styles.galleryContainer}>
              <div className={styles.galleryImage}>
                <img src="/assets/venues/lecture-hall-a101-1.jpg" alt="Venue Image 1" />
              </div>
              <div className={styles.galleryImage}>
                <img src="/assets/venues/lecture-hall-a101-2.jpg" alt="Venue Image 2" />
              </div>
              <div className={styles.galleryImage}>
                <img src="/assets/venues/lecture-hall-a101-3.jpg" alt="Venue Image 3" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ExploreVenues;
