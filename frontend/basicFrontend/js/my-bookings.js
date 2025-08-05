document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Load bookings when page loads
    loadUserBookings();
});

async function loadUserBookings() {
    try {
        console.log('My bookings: Starting to load user bookings...');
        
        // Get user data from localStorage
        const rawUserData = localStorage.getItem('user');
        if (!rawUserData || rawUserData === "undefined") {
            showError('User not logged in. Please log in again.');
            return;
        }

        let userData;
        try {
            userData = JSON.parse(rawUserData);
        } catch (e) {
            showError('User data corrupted. Please log in again.');
            return;
        }

        //console.log('My bookings: User data from localStorage:', userData);
        
        // Get user ID based on user type
        let userId;
        if (userData.user_type === 'faculty') {
            userId = userData.user_data.faculty_id;
        } else if (userData.user_type === 'club') {
            userId = userData.user_data.student_body_id;
        } else if (userData.user_type === 'student') {
            userId = userData.user_data.student_body_id;
        } else {
            userId = 1; // fallback
        }
        
        console.log('My bookings: Using user ID:', userId);
        const response = await fetch(`http://localhost:8000/api/bookings/${userId}`);
        console.log('My bookings: Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('My bookings: Data received:', data);
        
        if (data.bookings) {
            console.log('My bookings: Number of bookings:', data.bookings.length);
            // Clear existing bookings
            clearAllBookings();
            
            // Sort and display bookings
            data.bookings.forEach(booking => {
                const bookingElement = createBookingElement(booking);
                const tabContent = getAppropriateTab(booking);
                const bookingList = tabContent.querySelector('.booking-list');
                bookingList.appendChild(bookingElement);
            });
            console.log('My bookings: Bookings loaded successfully');
        } else {
            console.log('My bookings: No bookings found');
        }
    } catch (error) {
        console.error('My bookings: Error loading bookings:', error);
        showError(`Failed to load bookings: ${error.message}`);
    }
}

function clearAllBookings() {
    document.querySelectorAll('.booking-list').forEach(list => {
        list.innerHTML = '';
    });
}

function getAppropriateTab(booking) {
    const today = new Date();
    const bookingDate = new Date(booking.booking_date);
    const status = booking.approval_status?.toLowerCase() || 'pending';

    if (status === 'rejected') {
        return document.getElementById('rejected');
    } else if (status === 'pending') {
        return document.getElementById('pending');
    } else if (bookingDate < today) {
        return document.getElementById('history');
    } else {
        return document.getElementById('upcoming');
    }
}

function createBookingElement(booking) {
    const div = document.createElement('div');
    div.className = 'booking-item';
    
    // Format date and time
    const bookingDate = new Date(booking.booking_date).toLocaleDateString();
    const startTime = booking.start_time;
    const endTime = booking.end_time;

    div.innerHTML = `
        <div class="venue-header">
            <div class="venue-info">
                <h3 class="venue-title">${booking.venue_name || 'Unnamed Venue'}</h3>
                <p class="venue-location">Date: ${bookingDate}</p>
                <p class="venue-time">Time: ${startTime} - ${endTime}</p>
            </div>
        </div>
        <div class="booking-details">
            <p class="booking-purpose">${booking.purpose || 'No purpose specified'}</p>
            <p class="booking-status ${booking.approval_status?.toLowerCase()}">${booking.approval_status || 'Pending'}</p>
        </div>
        <div class="booking-actions">
            ${getActionButtons(booking)}
        </div>
    `;

    return div;
}

function getActionButtons(booking) {
    const status = booking.approval_status?.toLowerCase() || 'pending';
    
    if (status === 'approved') {
        return '<button class="btn-secondary">Cancel Booking</button>';
    } else if (status === 'pending') {
        return '<button class="btn-secondary">Cancel Request</button>';
    } else if (status === 'rejected') {
        return '<button class="btn">Book Again</button>';
    } else {
        return ''; // No actions for historical bookings
    }
}

function showError(message) {
    // You can enhance this to show a proper error UI
    alert(message);
}

// Cancel booking functionality
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-secondary')) {
        const bookingItem = e.target.closest('.booking-item');
        const venueName = bookingItem.querySelector('.venue-title').textContent;
        
        if (confirm(`Are you sure you want to cancel your booking for ${venueName}?`)) {
            // Here you would make an API call to cancel the booking
            alert('Booking cancelled successfully.');
            
            // Move to rejected tab
            const rejectedList = document.querySelector('#rejected .booking-list');
            const clonedItem = bookingItem.cloneNode(true);
            
            // Update the status
            const statusElement = clonedItem.querySelector('.booking-status');
            statusElement.textContent = 'Cancelled by You';
            statusElement.className = 'booking-status cancelled';
            
            // Update the actions
            const actionsElement = clonedItem.querySelector('.booking-actions');
            actionsElement.innerHTML = '<button class="btn">Book Again</button>';
            
            rejectedList.appendChild(clonedItem);
            bookingItem.remove();
            
            // Switch to rejected tab
            document.querySelector('[data-tab="rejected"]').click();
        }
    }
});
    
    // Check status functionality
    const checkStatusBtns = document.querySelectorAll('#pending .booking-actions .btn:not(.btn-secondary)');
    
    checkStatusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            const venueName = bookingItem.querySelector('.venue-name').textContent;
            
            alert(`Checking status of booking for ${venueName}... Status: Still under review.`);
        });
    });
    
    // Book again functionality
    const bookAgainBtns = document.querySelectorAll('#rejected .booking-actions .btn, #history .booking-actions .btn');
    
    bookAgainBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            const venueName = bookingItem.querySelector('.venue-name').textContent;
            const venueLocation = bookingItem.querySelector('.venue-location').textContent;
            
            // Extract capacity from the venue name (in a real app, this would come from the database)
            let capacity = "100 people";
            if (venueName.includes("Lecture Hall")) {
                capacity = "120 people";
            } else if (venueName.includes("Computer Lab")) {
                capacity = "60 workstations";
            } else if (venueName.includes("Seminar Hall")) {
                capacity = "150 people";
            } else if (venueName.includes("Auditorium")) {
                capacity = "500 people";
            } else if (venueName.includes("Student Plaza")) {
                capacity = "300+ people";
            } else if (venueName.includes("Conference Room")) {
                capacity = "25 people";
            }
            
            // Create a mock venue object to pass to the booking page
            localStorage.setItem('selectedVenue', JSON.stringify({
                title: venueName,
                location: venueLocation,
                capacity: capacity,
                image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }));
            
            // Navigate to the booking page
            window.location.href = 'booking.html';
        });
    });
    
    // Modify booking functionality
    const modifyBtns = document.querySelectorAll('#upcoming .booking-actions .btn:not(.btn-secondary)');
    
    modifyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            const venueName = bookingItem.querySelector('.venue-name').textContent;
            
            alert(`Redirecting to modify booking for ${venueName}...`);
            // In a real application, this would redirect to a booking modification page
        });
    });
    
    // Book alternative functionality
    const bookAltBtns = document.querySelectorAll('#rejected .booking-actions .btn');
    
    bookAltBtns.forEach(btn => {
        if (btn.textContent === 'Book Alternative') {
            btn.addEventListener('click', function() {
                window.location.href = 'explore-venues.html';
            });
        }
    });
