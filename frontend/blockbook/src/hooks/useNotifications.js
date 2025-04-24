import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNotifications = (initialNotifications) => {
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const navigate = useNavigate();
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };
  
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const markAllAsRead = () => {
    if (notifications.filter(n => n.unread).length === 0) {
      alert('No unread notifications.');
      return;
    }
    
    setNotifications(notifications.map(notification => ({ ...notification, unread: false })));
    alert('All notifications marked as read.');
  };
  
  const handleNotificationClick = (notification) => {
    const { title } = notification;
    
    // Mark as read when clicked
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (title.includes('Booking Approved') || title.includes('Booking Confirmed') || title.includes('Booking Completed')) {
      alert('Redirecting to My Bookings page...');
      navigate('/my-bookings');
    } else if (title.includes('Exchange Request')) {
      alert('Redirecting to Inbox page...');
      navigate('/inbox');
    } else if (title.includes('System Update') || title.includes('Important Announcement')) {
      alert('Showing full announcement details...');
    } else if (title.includes('Upcoming Booking Reminder')) {
      alert('Redirecting to booking details...');
    } else if (title.includes('Booking Rejected')) {
      alert('Redirecting to rejected bookings...');
      navigate('/my-bookings');
    }
  };
  
  return {
    notifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    handleNotificationClick
  };
};
