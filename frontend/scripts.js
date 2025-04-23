// Search venues
async function searchVenues(filters) {
    const response = await fetch(`/api/venues/search/?${new URLSearchParams(filters)}`);
    const data = await response.json();
    // Update UI with search results
    console.log(data.venues);
}

// Show all venues
async function showAllVenues() {
    const response = await fetch('/api/venues/');
    const data = await response.json();
    // Update UI with all venues
    console.log(data.venues);
}

// Book venue
async function bookVenue(bookingData) {
    const response = await fetch('/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    const data = await response.json();
    // Show success or error message
    console.log(data.message);
}

// Get confirmed bookings for community page
async function getConfirmedBookings() {
    const response = await fetch('/api/bookings/confirmed/');
    const data = await response.json();
    // Update UI with confirmed bookings
    console.log(data.bookings);
}

// Get user's bookings
async function getUserBookings(userId) {
    const response = await fetch(`/api/bookings/user/?user_id=${userId}`);
    const data = await response.json();
    // Update UI with user's bookings
    console.log(data.bookings);
}

// Approve booking
async function approveBooking(bookingId) {
    const response = await fetch(`/api/bookings/${bookingId}/approve/`, { method: 'POST' });
    const data = await response.json();
    // Show success or error message
    console.log(data.message);
}

// Reject booking
async function rejectBooking(bookingId) {
    const response = await fetch(`/api/bookings/${bookingId}/reject/`, { method: 'POST' });
    const data = await response.json();
    // Show success or error message
    console.log(data.message);
}