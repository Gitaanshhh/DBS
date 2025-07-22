async function searchVenues(filters) {
    const response = await fetch(`/api/venues/search/?${new URLSearchParams(filters)}`);
    const data = await response.json();
    console.log(data.venues);
}

async function showAllVenues() {
    const response = await fetch('/api/venues/');
    const data = await response.json();
    console.log(data.venues);
}

async function bookVenue(bookingData) {
    const response = await fetch('/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    const data = await response.json();
    console.log(data.message);
}

async function getConfirmedBookings() {
    const response = await fetch('/api/bookings/confirmed/');
    const data = await response.json();
    console.log(data.bookings);
}

async function getUserBookings(userId) {
    const response = await fetch(`/api/bookings/user/?user_id=${userId}`);
    const data = await response.json();
    console.log(data.bookings);
}