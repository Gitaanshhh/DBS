document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Cancel booking functionality
    const cancelBtns = document.querySelectorAll('.booking-actions .btn-secondary');
    
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingItem = this.closest('.booking-item');
            const venueName = bookingItem.querySelector('.venue-name').textContent;
            
            if (confirm(`Are you sure you want to cancel your booking for ${venueName}?`)) {
                alert('Booking cancelled successfully.');
                
                // In a real application, this would update the booking status in the database
                // For now, we'll just move the item to the rejected/cancelled tab
                const rejectedList = document.querySelector('#rejected .booking-list');
                const clonedItem = bookingItem.cloneNode(true);
                
                // Update the status to "Cancelled by You"
                const statusElement = clonedItem.querySelector('.booking-status');
                statusElement.textContent = 'Cancelled by You';
                statusElement.className = 'booking-status cancelled';
                
                // Update the actions
                const actionsElement = clonedItem.querySelector('.booking-actions');
                actionsElement.innerHTML = '<button class="btn">Book Again</button>';
                
                // Add to rejected list and remove from current list
                rejectedList.appendChild(clonedItem);
                bookingItem.remove();
                
                // Switch to the rejected tab
                document.querySelector('[data-tab="rejected"]').click();
            }
        });
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
});
