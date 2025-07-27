// Constants
const API_BASE_URL = 'http://localhost:8000/api';
const ENDPOINTS = {
    bookings: `${API_BASE_URL}/bookings`,
    venues: `${API_BASE_URL}/venues`
};

// State management
let currentTab = 'upcoming';
let loadingState = false;
let bookingsData = [];

// API functions

function submitBookingRequest() {
  const selectedTimeSlot = document.querySelector(".time-slot.selected");
  if (!selectedTimeSlot) {
    alert("Please select a time slot");
    return;
  }

  const venueData = JSON.parse(localStorage.getItem("selectedVenue"));
  const userId = parseInt(localStorage.getItem("userId")); // <-- Assumes login stores this

  if (!venueData || !userId) {
    alert("Booking failed: User or venue not found.");
    return;
  }

  const date = document.getElementById("booking-date").value;
  const [startTimeStr, endTimeStr] = selectedTimeSlot.dataset.time
    .split(" - ")
    .map(t => convertTo24Hour(date, t));

  const payload = {
    venue_id: venueData.id,         // From localStorage
    user_id: userId,                // From localStorage
    start_time: startTimeStr,       // ISO datetime
    end_time: endTimeStr,           // ISO datetime
    purpose: document.getElementById("booking-purpose").value
  };

  fetch("http://localhost:8000/api/bookings/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to create booking");
      return response.json();
    })
    .then(data => {
      alert("Booking submitted successfully!");
      window.location.href = "mainPage.html";
    })
    .catch(error => {
      console.error("Booking error:", error);
      alert("There was an error. Please try again.");
    });
}


async function fetchUserBookings(userId) {
    showLoading(true);
    hideError();
    
    try {
        const response = await fetch(`${ENDPOINTS.bookings}/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        bookingsData = data.bookings || [];
        return bookingsData;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        showError('Failed to load your bookings. Please try again later.');
        return [];
    } finally {
        showLoading(false);
    }
}

async function cancelBookingRequest(bookingId) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }

        showSuccess('Booking cancelled successfully');
        return true;
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showError('Failed to cancel booking. Please try again.');
        return false;
    }
}

async function checkBookingStatus(bookingId) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch booking status');
        }
        const data = await response.json();
        return data.status;
    } catch (error) {
        console.error('Error checking booking status:', error);
        showError('Failed to check booking status. Please try again.');
        return null;
    }
}

// UI Helper functions
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.querySelector('p').textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideError() {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function showLoading(show) {
    loadingState = show;
    const loadingDiv = document.getElementById('loading');
    const contentDiv = document.getElementById('booking-list');
    
    if (loadingDiv && contentDiv) {
        loadingDiv.style.display = show ? 'flex' : 'none';
        contentDiv.style.display = show ? 'none' : 'block';
    }
}

function updateBookingsList(bookings) {
    const bookingList = document.getElementById('booking-list');
    if (!bookingList) return;

    const filteredBookings = filterBookingsByTab(bookings, currentTab);
    
    if (filteredBookings.length === 0) {
        showEmptyState(true);
        bookingList.style.display = 'none';
        return;
    }

    showEmptyState(false);
    bookingList.style.display = 'flex';
    bookingList.innerHTML = '';
    
    filteredBookings.forEach(booking => {
        const bookingElement = createBookingElement(booking);
        bookingList.appendChild(bookingElement);
    });
}

function showEmptyState(show) {
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        emptyState.style.display = show ? 'block' : 'none';
    }
}

function filterBookingsByTab(bookings, tabId) {
    switch (tabId) {
        case 'upcoming':
            return bookings.filter(b => b.status === 'approved' && new Date(b.start_time) > new Date());
        case 'pending':
            return bookings.filter(b => b.status === 'pending');
        case 'rejected':
            return bookings.filter(b => b.status === 'rejected' || b.status === 'cancelled');
        case 'history':
            return bookings.filter(b => b.status === 'completed' || new Date(b.end_time) < new Date());
        default:
            return bookings;
    }
}

function createBookingElement(booking) {
    const div = document.createElement('div');
    div.className = 'booking-item';
    
    const bookingDate = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);
    
    div.innerHTML = `
        <div class="booking-date">
            <div class="date-box">
                <span class="month">${bookingDate.toLocaleString('default', { month: 'short' })}</span>
                <span class="day">${bookingDate.getDate()}</span>
                <span class="year">${bookingDate.getFullYear()}</span>
            </div>
        </div>
        <div class="booking-details">
            <h3 class="venue-name">${booking.venue_name}</h3>
            <p class="venue-location"><i class="fas fa-map-marker-alt"></i> ${booking.location || 'Location not specified'}</p>
            <p class="booking-time">
                <i class="far fa-clock"></i> 
                ${bookingDate.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} - 
                ${endTime.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p class="booking-purpose"><i class="fas fa-info-circle"></i> ${booking.purpose}</p>
            <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
            ${booking.rejection_reason ? `
                <div class="rejection-reason">
                    <p><i class="fas fa-exclamation-circle"></i> ${booking.rejection_reason}</p>
                </div>
            ` : ''}
        </div>
        ${getBookingActions(booking)}
    `;
    
    return div;
}

function getBookingActions(booking) {
    const status = booking.status.toLowerCase();
    let actions = '';
    
    switch (status) {
        case 'pending':
            actions = `
                <div class="booking-actions">
                    <button class="btn check-status" data-booking-id="${booking.id}">Check Status</button>
                    <button class="btn btn-secondary cancel-booking" data-booking-id="${booking.id}">Cancel</button>
                </div>
            `;
            break;
        case 'approved':
            if (new Date(booking.start_time) > new Date()) {
                actions = `
                    <div class="booking-actions">
                        <button class="btn modify-booking" data-booking-id="${booking.id}">Modify</button>
                        <button class="btn btn-secondary cancel-booking" data-booking-id="${booking.id}">Cancel</button>
                    </div>
                `;
            }
            break;
        case 'rejected':
            actions = `
                <div class="booking-actions">
                    <button class="btn book-again" data-venue-id="${booking.venue_id}">Book Again</button>
                    <button class="btn book-alternative">Book Alternative</button>
                </div>
            `;
            break;
        case 'completed':
            actions = `
                <div class="booking-actions">
                    <button class="btn book-again" data-venue-id="${booking.venue_id}">Book Again</button>
                </div>
            `;
            break;
    }
    
    return actions;
}

// Event Handlers
function setupEventHandlers() {
    // Tab switching
    const tabInputs = document.querySelectorAll('.tab-input');
    
    tabInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                currentTab = this.id.replace('tab-', '');
                updateBookingsList(bookingsData);
            }
        });
    });

    // Global click handler for dynamic elements
    document.addEventListener('click', async function(e) {
        const target = e.target;
        
        // Cancel booking
        if (target.classList.contains('cancel-booking')) {
            const bookingId = target.dataset.bookingId;
            if (confirm('Are you sure you want to cancel this booking?')) {
                if (await cancelBookingRequest(bookingId)) {
                    loadUserBookings();
                }
            }
        }
        
        // Check status
        else if (target.classList.contains('check-status')) {
            const bookingId = target.dataset.bookingId;
            const status = await checkBookingStatus(bookingId);
            if (status) {
                showSuccess(`Current booking status: ${status}`);
            }
        }
        
        // Book again
        else if (target.classList.contains('book-again')) {
            const venueId = target.dataset.venueId;
            window.location.href = `booking.html?venue=${venueId}`;
        }
        
        // Book alternative
        else if (target.classList.contains('book-alternative')) {
            window.location.href = 'explore-venues.html';
        }
        
        // Modify booking
        else if (target.classList.contains('modify-booking')) {
            const bookingId = target.dataset.bookingId;
            window.location.href = `modify-booking.html?id=${bookingId}`;
        }
    });
}

// Initialize
async function loadUserBookings(tabId = 'upcoming') {
    const userId = getCurrentUserId();
    const bookings = await fetchUserBookings(userId);
    updateBookingsList(bookings, tabId);
}

function getCurrentUserId() {
    // Replace with actual user authentication
    return '1'; // Temporary hardcoded value
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    setupEventHandlers();
    
    // Check if we have a userId in localStorage or session
    const userId = getCurrentUserId();
    if (!userId) {
        showError('Please log in to view your bookings');
        return;
    }
    
    try {
        await loadUserBookings();
    } catch (error) {
        console.error('Failed to initialize bookings:', error);
        showError('Failed to load your bookings. Please try again later.');
    }
});

function convertTo24Hour(dateStr, timeRange) {
  // "8:00 AM" -> "2025-07-24T08:00:00"
  const date = new Date(dateStr + " " + timeRange);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}
