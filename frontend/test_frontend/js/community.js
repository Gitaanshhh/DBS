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
    
    // Exchange request functionality
    const exchangeBtns = document.querySelectorAll('.booking-actions .btn-secondary');
    
    exchangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingCard = this.closest('.booking-card');
            const studentBody = bookingCard.querySelector('.student-body h3').textContent;
            const venue = bookingCard.querySelector('.venue-info h4').textContent;
            
            alert(`Exchange request will be sent to ${studentBody} for their booking of ${venue}.`);
        });
    });
    
    // Add to calendar functionality
    const calendarBtns = document.querySelectorAll('.booking-actions .btn:not(.btn-secondary)');
    
    calendarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingCard = this.closest('.booking-card');
            const event = bookingCard.querySelector('.event-info h4').textContent;
            
            alert(`Event "${event}" has been added to your calendar.`);
        });
    });
    
    // Exchange history actions
    const cancelRequestBtns = document.querySelectorAll('.exchange-actions .btn-secondary');
    const sendReminderBtns = document.querySelectorAll('.exchange-actions .btn:not(.btn-secondary)');
    
    cancelRequestBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exchangeCard = this.closest('.exchange-card');
            
            if (confirm('Are you sure you want to cancel this exchange request?')) {
                alert('Exchange request cancelled successfully.');
                exchangeCard.remove();
            }
        });
    });
    
    sendReminderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exchangeCard = this.closest('.exchange-card');
            const otherParty = exchangeCard.querySelector('.exchange-party:nth-child(3) h4').textContent;
            
            alert(`Reminder sent to ${otherParty}.`);
        });
    });
    
    // Search functionality
    const searchBox = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');
    
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchBox.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            alert('Please enter a search term.');
            return;
        }
        
        alert(`Searching for "${searchTerm}"... In a real application, this would filter the results.`);
    });
    
    // Filter dropdowns
    const filterDropdowns = document.querySelectorAll('.filter-dropdown select');
    
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const filterType = this.parentElement.querySelector('label')?.textContent || 'Filter';
            const filterValue = this.options[this.selectedIndex].text;
            
            if (this.value !== '') {
                alert(`Filter applied: ${filterType} = ${filterValue}`);
            }
        });
    });
});
