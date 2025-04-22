document.addEventListener('DOMContentLoaded', function() {
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
        // In a real application, this would filter the venues based on the selected criteria
        alert('Filters applied! This would filter the venues in a real application.');
    });
    
    clearBtn.addEventListener('click', function() {
        dateFilter.value = new Date().toISOString().split('T')[0];
        timeFilter.value = '';
        capacityFilter.value = '';
        locationFilter.value = '';
        equipmentFilter.value = '';
        availableFilter.checked = false;
        exchangeFilter.checked = false;
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
            
            // Store venue information in localStorage to pass to the booking page
            localStorage.setItem('selectedVenue', JSON.stringify({
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
