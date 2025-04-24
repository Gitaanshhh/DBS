import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    buildings: [],
    venueTypes: [],
    features: []
  });
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    capacity: '',
    building: '',
    venueType: '',
    features: '',
    availableOnly: false
  });

  const mapModalRef = React.useRef(null);
  const galleryModalRef = React.useRef(null);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/filter-options/');
        if (!response.ok) throw new Error('Failed to fetch filter options');
        const data = await response.json();
        setFilterOptions({
          buildings: data.buildings,
          venueTypes: data.venue_types,
          features: data.features
        });
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Fetch venues with filters
  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`http://localhost:8000/api/venues/?${queryParams}`);
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
  }, [filters]);

  const handleFilterChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [id.replace('-filter', '')]: type === 'checkbox' ? checked : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: new Date().toISOString().split('T')[0],
      time: '',
      capacity: '',
      building: '',
      venueType: '',
      features: '',
      availableOnly: false
    });
  };

  const bookVenue = (venueData) => {
    localStorage.setItem('selectedVenue', JSON.stringify(venueData));
    navigate(`/booking/${venueData.venue_id}`);
  };

  // Get unique building names for location filter
  const buildingNames = [...new Set(venues.map(venue => venue.building_name).filter(Boolean))];
  
  // Get unique venue types
  const venueTypes = [...new Set(venues.map(venue => venue.venue_type).filter(Boolean))];
  
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
            <label htmlFor="time-filter">Time</label>
            <input
              type="time"
              id="time-filter"
              className={styles.filterInput}
              value={filters.time}
              onChange={handleFilterChange}
            />
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
              <option value="small">Small (≤50)</option>
              <option value="medium">Medium (51-150)</option>
              <option value="large">Large (151-300)</option>
              <option value="xlarge">Extra Large (&gt;300)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="building-filter">Building</label>
            <select
              id="building-filter"
              className={styles.filterInput}
              value={filters.building}
              onChange={handleFilterChange}
            >
              <option value="">All Buildings</option>
              {filterOptions.buildings.map(building => (
                <option key={building} value={building}>{building}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="venueType-filter">Venue Type</label>
            <select
              id="venueType-filter"
              className={styles.filterInput}
              value={filters.venueType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {filterOptions.venueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="features-filter">Features</label>
            <select
              id="features-filter"
              className={styles.filterInput}
              value={filters.features}
              onChange={handleFilterChange}
            >
              <option value="">All Features</option>
              {filterOptions.features.map(feature => (
                <option key={feature} value={feature}>{feature}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
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
          <button className={styles.filterBtn} onClick={fetchVenues}>
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
                  bookVenue(venueData);
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
