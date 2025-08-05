document.addEventListener('DOMContentLoaded', function() {
    // Load venues from backend
    loadVenuesFromBackend();
    
    // Map modal functionality
    const mapLinks = document.querySelectorAll('.map-link');
    const mapModal = document.getElementById('mapModal');
    const mapVenueTitle = document.getElementById('mapVenueTitle');
    const closeMapModal = mapModal.querySelector('.close-modal');
    
    mapLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const venueTitle = this.closest('.venue-card').querySelector('.venue-title').textContent;
            mapVenueTitle.textContent = venueTitle;
            mapModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeMapModal.addEventListener('click', function() {
        mapModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Gallery modal functionality
    const galleryBtns = document.querySelectorAll('.venue-gallery-btn');
    const galleryModal = document.getElementById('galleryModal');
    const galleryVenueTitle = document.getElementById('galleryVenueTitle');
    const closeGalleryModal = galleryModal.querySelector('.close-modal');
    
    galleryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const venueTitle = this.closest('.venue-card').querySelector('.venue-title').textContent;
            galleryVenueTitle.textContent = venueTitle;
            galleryModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeGalleryModal.addEventListener('click', function() {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === mapModal) {
            mapModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Filter functionality
    const filterBtn = document.querySelector('.filter-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const dateFilter = document.getElementById('date-filter');
    const timeFilter = document.getElementById('time-filter');
    const capacityFilter = document.getElementById('capacity-filter');
    const locationFilter = document.getElementById('location-filter');
    const equipmentFilter = document.getElementById('equipment-filter');
    const availableFilter = document.getElementById('available-filter');
    const exchangeFilter = document.getElementById('exchange-filter');
    
    filterBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    clearBtn.addEventListener('click', function() {
        dateFilter.value = new Date().toISOString().split('T')[0];
        timeFilter.value = '';
        capacityFilter.value = '';
        locationFilter.value = '';
        equipmentFilter.value = '';
        availableFilter.checked = false;
        exchangeFilter.checked = false;
        // Reload all venues when clearing filters
        loadVenuesFromBackend();
    });
    
    // Book venue functionality
    const bookBtns = document.querySelectorAll('.book-btn:not([disabled])');
    
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const venueCard = this.closest('.venue-card');
            const venueTitle = venueCard.querySelector('.venue-title').textContent;
            const venueLocation = venueCard.querySelector('.venue-location').textContent;
            const venueCapacity = venueCard.querySelector('.venue-capacity').textContent;
            const venueImage = venueCard.querySelector('img').src;
            const venueId = venueCard.dataset.venueId;
            
            // Store venue information in localStorage to pass to the booking page
            localStorage.setItem('selectedVenue', JSON.stringify({
                id: venueId,
                title: venueTitle,
                location: venueLocation,
                capacity: venueCapacity,
                image: venueImage
            }));
            
            // Navigate to the booking page
            window.location.href = 'booking.html';
        });
    });
    
    // Exchange request functionality
    const exchangeBtns = document.querySelectorAll('.exchange-btn');
    
    exchangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const venueTitle = this.closest('.venue-card').querySelector('.venue-title').textContent;
            alert(`Exchange request for ${venueTitle} will be sent to the current booker.`);
        });
    });
});

// Function to apply filters
function applyFilters() {
    const dateFilter = document.getElementById('date-filter');
    const timeFilter = document.getElementById('time-filter');
    const capacityFilter = document.getElementById('capacity-filter');
    const locationFilter = document.getElementById('location-filter');
    const equipmentFilter = document.getElementById('equipment-filter');
    const availableFilter = document.getElementById('available-filter');
    
    // Get filter values
    const filters = {
        date: dateFilter.value,
        time: timeFilter.value,
        capacity: capacityFilter.value,
        location: locationFilter.value,
        equipment: equipmentFilter.value,
        availableOnly: availableFilter.checked
    };
    
    // Apply filters to existing venue cards
    const venueCards = document.querySelectorAll('.venue-card');
    
    venueCards.forEach(card => {
        let showCard = true;
        
        // Capacity filter
        if (filters.capacity) {
            const capacityText = card.querySelector('.venue-capacity').textContent;
            const capacity = parseInt(capacityText.match(/\d+/)[0]);
            
            if (filters.capacity === 'small' && capacity > 30) showCard = false;
            else if (filters.capacity === 'medium' && (capacity <= 30 || capacity > 100)) showCard = false;
            else if (filters.capacity === 'large' && (capacity <= 100 || capacity > 200)) showCard = false;
            else if (filters.capacity === 'xlarge' && capacity <= 200) showCard = false;
        }
        
        // Venue type filter (using location filter for venue type)
        if (filters.location) {
            const venueType = card.querySelector('.venue-type span').textContent.toLowerCase();
            if (!venueType.includes(filters.location.toLowerCase())) {
                showCard = false;
            }
        }
        
        // Show/hide card based on filters
        card.style.display = showCard ? 'block' : 'none';
    });
    
    // Show message if no venues match filters
    const visibleCards = document.querySelectorAll('.venue-card[style="display: block"], .venue-card:not([style*="display: none"])');
    if (visibleCards.length === 0) {
        const venuesGrid = document.querySelector('.venues-grid');
        venuesGrid.innerHTML = '<div class="no-results">No venues match your filters. Try adjusting your criteria.</div>';
    }
};

// Function to load venues from backend
async function loadVenuesFromBackend() {
    try {
        console.log('Explore venues: Attempting to fetch venues from backend...');
        const response = await fetch('http://localhost:8000/api/venues/');
        console.log('Explore venues: Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch venues: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Explore venues: Data received:', data);
        const venues = data.venues || [];
        console.log('Explore venues: Number of venues:', venues.length);
        
        // Clear existing venues
        const venuesGrid = document.querySelector('.venues-grid');
        console.log('Explore venues: Venues grid found:', !!venuesGrid);
        
        if (venuesGrid) {
            venuesGrid.innerHTML = '';
            
            // Create venue cards
            venues.forEach(venue => {
                const venueCard = createVenueCard(venue);
                venuesGrid.appendChild(venueCard);
            });
            
            // Re-attach event listeners to new venue cards
            attachVenueCardEventListeners();
            console.log('Explore venues: Venues loaded successfully');
        } else {
            console.error('Explore venues: Venues grid not found');
        }
        
    } catch (error) {
        console.error('Explore venues: Error loading venues:', error);
        // Show error message to user
        const venuesGrid = document.querySelector('.venues-grid');
        if (venuesGrid) {
            venuesGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load venues: ${error.message}</p>
                    <p>Please check if the backend server is running on http://localhost:8000</p>
                </div>
            `;
        }
    }
}

// Function to create venue card
function createVenueCard(venue) {
    const card = document.createElement('div');
    card.className = 'venue-card';
    card.dataset.venueId = venue.venue_id;
    
    // Determine venue type icon
    let iconClass = 'fas fa-building';
    if (venue.venue_type?.toLowerCase().includes('lab')) {
        iconClass = 'fas fa-flask';
    } else if (venue.venue_type?.toLowerCase().includes('hall')) {
        iconClass = 'fas fa-chalkboard';
    } else if (venue.venue_type?.toLowerCase().includes('auditorium')) {
        iconClass = 'fas fa-theater-masks';
    } else if (venue.venue_type?.toLowerCase().includes('conference')) {
        iconClass = 'fas fa-users';
    }
    
    card.innerHTML = `
        <div class="venue-image">
            <img src="https://placehold.co/400x250/4a90e2/ffffff?text=${encodeURIComponent(venue.venue_name)}" alt="${venue.venue_name}">
            <div class="venue-overlay">
                <button class="venue-gallery-btn" title="View Gallery">
                    <i class="fas fa-images"></i>
                </button>
                <button class="map-link" title="View on Map">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
            </div>
        </div>
        <div class="venue-content">
            <div class="venue-header">
                <h3 class="venue-title">${venue.venue_name}</h3>
                <div class="venue-type">
                    <i class="${iconClass}"></i>
                    <span>${venue.venue_type || 'Venue'}</span>
                </div>
            </div>
            <div class="venue-details">
                <p class="venue-location">
                    <i class="fas fa-map-marker-alt"></i>
                    Floor ${venue.floor_number || 'N/A'}
                </p>
                <p class="venue-capacity">
                    <i class="fas fa-users"></i>
                    ${venue.seating_capacity || 'N/A'} seats
                </p>
            </div>
            <div class="venue-features">
                <span class="feature-tag">Projector</span>
                <span class="feature-tag">Wi-Fi</span>
                <span class="feature-tag">Air Conditioned</span>
            </div>
            <div class="venue-actions">
                <button class="book-btn" ${venue.seating_capacity > 0 ? '' : 'disabled'}>
                    ${venue.seating_capacity > 0 ? 'Book Now' : 'Unavailable'}
                </button>
                <button class="exchange-btn" title="Request Exchange">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Function to attach event listeners to venue cards
function attachVenueCardEventListeners() {
    // Re-attach map modal functionality
    const mapLinks = document.querySelectorAll('.map-link');
    const mapModal = document.getElementById('mapModal');
    const mapVenueTitle = document.getElementById('mapVenueTitle');
    
    mapLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const venueTitle = this.closest('.venue-card').querySelector('.venue-title').textContent;
            mapVenueTitle.textContent = venueTitle;
            mapModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Re-attach gallery modal functionality
    const galleryBtns = document.querySelectorAll('.venue-gallery-btn');
    const galleryModal = document.getElementById('galleryModal');
    const galleryVenueTitle = document.getElementById('galleryVenueTitle');
    
    galleryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const venueTitle = this.closest('.venue-card').querySelector('.venue-title').textContent;
            galleryVenueTitle.textContent = venueTitle;
            galleryModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Re-attach book button functionality
    const bookBtns = document.querySelectorAll('.book-btn:not([disabled])');
    
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const venueCard = this.closest('.venue-card');
            const venueTitle = venueCard.querySelector('.venue-title').textContent;
            const venueLocation = venueCard.querySelector('.venue-location').textContent;
            const venueCapacity = venueCard.querySelector('.venue-capacity').textContent;
            const venueImage = venueCard.querySelector('img').src;
            const venueId = venueCard.dataset.venueId;
            
            // Store venue information in localStorage to pass to the booking page
            localStorage.setItem('selectedVenue', JSON.stringify({
                id: venueId,
                title: venueTitle,
                location: venueLocation,
                capacity: venueCapacity,
                image: venueImage
            }));
            
            // Navigate to the booking page
            window.location.href = 'booking.html';
        });
    });
    
    // Re-attach exchange button functionality
    const exchangeBtns = document.querySelectorAll('.exchange-btn');
    
    exchangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const venueTitle = this.closest('.venue-card').querySelector('.venue-title').textContent;
            alert(`Exchange request for ${venueTitle} will be sent to the current booker.`);
        });
    });
}
