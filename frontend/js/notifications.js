document.addEventListener('DOMContentLoaded', function() {
    // Mark as read functionality
    const markReadBtns = document.querySelectorAll('.mark-read-btn');
    
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const notification = this.closest('.notification');
            notification.classList.remove('unread');
            
            // In a real application, this would update the notification status in the database
            alert('Notification marked as read.');
        });
    });
    
    // Delete notification functionality
    const deleteBtns = document.querySelectorAll('.delete-btn');
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const notification = this.closest('.notification');
            
            if (confirm('Are you sure you want to delete this notification?')) {
                notification.remove();
                
                // In a real application, this would delete the notification from the database
                alert('Notification deleted.');
            }
        });
    });
    
    // Mark all as read functionality
    const markAllBtn = document.querySelector('.mark-all-btn');
    
    markAllBtn.addEventListener('click', function() {
        const unreadNotifications = document.querySelectorAll('.notification.unread');
        
        if (unreadNotifications.length === 0) {
            alert('No unread notifications.');
            return;
        }
        
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
        });
        
        // In a real application, this would update all notification statuses in the database
        alert('All notifications marked as read.');
    });
    
    // Filter notifications functionality
    const notificationFilter = document.getElementById('notification-filter');
    
    notificationFilter.addEventListener('change', function() {
        const filterValue = this.value;
        const notifications = document.querySelectorAll('.notification');
        
        notifications.forEach(notification => {
            if (filterValue === 'all') {
                notification.style.display = 'flex';
            } else if (filterValue === 'unread') {
                if (notification.classList.contains('unread')) {
                    notification.style.display = 'flex';
                } else {
                    notification.style.display = 'none';
                }
            } else {
                if (notification.classList.contains(filterValue)) {
                    notification.style.display = 'flex';
                } else {
                    notification.style.display = 'none';
                }
            }
        });
    });
    
    // Notification click functionality
    const notificationContents = document.querySelectorAll('.notification-content');
    
    notificationContents.forEach(content => {
        content.addEventListener('click', function() {
            const notification = this.closest('.notification');
            const title = notification.querySelector('.notification-title').textContent;
            
            // In a real application, this would navigate to the relevant page
            // For now, we'll just show an alert
            if (title.includes('Booking Approved') || title.includes('Booking Confirmed') || title.includes('Booking Completed')) {
                alert('Redirecting to My Bookings page...');
                // window.location.href = 'my-bookings.html';
            } else if (title.includes('Exchange Request')) {
                alert('Redirecting to Inbox page...');
                // window.location.href = 'inbox.html';
            } else if (title.includes('System Update') || title.includes('Important Announcement')) {
                alert('Showing full announcement details...');
            } else if (title.includes('Upcoming Booking Reminder')) {
                alert('Redirecting to booking details...');
            } else if (title.includes('Booking Rejected')) {
                alert('Redirecting to rejected bookings...');
                // window.location.href = 'my-bookings.html#rejected';
            }
            
            // Mark as read when clicked
            notification.classList.remove('unread');
        });
    });
});
