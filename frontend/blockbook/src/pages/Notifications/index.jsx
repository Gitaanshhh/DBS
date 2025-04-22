import React from "react";
import { useNotifications } from "../../hooks/useNotifications";
import styles from "./Notifications.module.css";

const Notifications = () => {
  // Sample initial notifications
  const initialNotifications = [
    {
      id: 1,
      type: "booking-status",
      title: "Booking Approved",
      message:
        "Your booking request for <strong>Computer Lab B204</strong> on <strong>April 25, 2025</strong> has been approved.",
      time: "10 minutes ago",
      unread: true,
    },
    // More notifications
    // ...
  ];

  const {
    filteredNotifications,
    filter,
    setFilter,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    handleNotificationClick,
  } = useNotifications(initialNotifications);

  return (
    <main className={styles.main}>
      <div className={styles.notificationsHeader}>
        <h1 className={styles.sectionTitle}>Notifications</h1>
        <div className={styles.notificationsActions}>
          <button
            className={`${styles.btn} ${styles.btnSecondary} ${styles.markAllBtn}`}
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
          <div className={styles.filterDropdown}>
            <select
              id="notification-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="booking-status">Booking Status</option>
              <option value="admin-alert">Admin Alerts</option>
              <option value="reminder">Reminders</option>
              <option value="exchange-request">Exchange Requests</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.notificationsContainer}>
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`${styles.notification} ${
              notification.unread ? styles.unread : ""
            } ${styles[notification.type]}`}
          >
            <div className={styles.notificationIcon}>
              {notification.type === "booking-status" &&
                (notification.title.includes("Approved") ||
                notification.title.includes("Confirmed") ? (
                  <i className="fas fa-check-circle"></i>
                ) : notification.title.includes("Rejected") ? (
                  <i className="fas fa-times-circle"></i>
                ) : (
                  <i className="fas fa-calendar-check"></i>
                ))}
              {notification.type === "admin-alert" &&
                (notification.title.includes("Important") ? (
                  <i className="fas fa-exclamation-triangle"></i>
                ) : (
                  <i className="fas fa-info-circle"></i>
                ))}
              {notification.type === "reminder" && (
                <i className="fas fa-bell"></i>
              )}
              {notification.type === "exchange-request" && (
                <i className="fas fa-exchange-alt"></i>
              )}
            </div>
            <div
              className={styles.notificationContent}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={styles.notificationTitle}>
                {notification.title}
              </div>
              <div
                className={styles.notificationMessage}
                dangerouslySetInnerHTML={{ __html: notification.message }}
              ></div>
              <div className={styles.notificationTime}>{notification.time}</div>
            </div>
            <div className={styles.notificationActions}>
              <button
                className={`${styles.actionBtn} ${styles.markReadBtn}`}
                onClick={() => markAsRead(notification.id)}
              >
                <i className="fas fa-check"></i>
              </button>
              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => deleteNotification(notification.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Notifications;
