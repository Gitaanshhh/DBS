import React from "react";
import { Link } from "react-router-dom";
import { useBookingManagement } from "../../hooks/useBookingManagement";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  // Initialize with sample data
  const initialBookings = {
    upcoming: [
      {
        id: 1,
        venueName: "Computer Lab B204",
        venueLocation: "Academic Block 2, Second Floor",
        bookingTime: "8:00 AM - 12:00 PM",
        bookingDate: "April 25, 2025",
        bookingPurpose: "Programming Workshop for Freshmen",
        status: "approved",
        statusText: "Approved",
      },
      // More upcoming bookings
    ],
    pending: [
      {
        id: 2,
        venueName: "Seminar Hall 1",
        venueLocation: "Central Building, First Floor",
        bookingTime: "12:00 PM - 4:00 PM",
        bookingDate: "April 20, 2025",
        bookingPurpose: "Guest Lecture on Artificial Intelligence",
        status: "pending",
        statusText: "Pending",
      },
      // More pending bookings
    ],
    rejected: [
      {
        id: 3,
        venueName: "Main Auditorium",
        venueLocation: "Central Campus",
        bookingTime: "8:00 AM - 12:00 PM",
        bookingDate: "April 18, 2025",
        bookingPurpose: "Club Orientation",
        status: "rejected",
        statusText: "Rejected",
        rejectionReason: "Venue already booked for a university event",
      },
      // More rejected bookings
    ],
    history: [
      {
        id: 4,
        venueName: "Lecture Hall A101",
        venueLocation: "Academic Block 1, Ground Floor",
        bookingTime: "8:00 AM - 12:00 PM",
        bookingDate: "March 15, 2025",
        bookingPurpose: "Workshop on Public Speaking",
        status: "completed",
        statusText: "Completed",
      },
      // More history bookings
    ],
  };

  const {
    bookings,
    activeTab,
    switchTab,
    cancelBooking,
    checkStatus,
    bookAgain,
    modifyBooking,
    bookAlternative,
  } = useBookingManagement(initialBookings);

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>My Bookings</h1>

      <div className={styles.bookingTabs}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "upcoming" ? styles.active : ""
          }`}
          onClick={() => switchTab("upcoming")}
        >
          Upcoming Bookings
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "pending" ? styles.active : ""
          }`}
          onClick={() => switchTab("pending")}
        >
          Pending Requests
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "rejected" ? styles.active : ""
          }`}
          onClick={() => switchTab("rejected")}
        >
          Rejected/Cancelled
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "history" ? styles.active : ""
          }`}
          onClick={() => switchTab("history")}
        >
          History
        </button>
      </div>

      <div
        className={`${styles.tabContent} ${
          activeTab === "upcoming" ? styles.active : ""
        }`}
        id="upcoming"
      >
        <div className={styles.bookingList}>
          {bookings.upcoming.map((booking) => (
            <div key={booking.id} className={styles.bookingItem}>
              {/* Booking item content */}
              {/* ... */}
              <div className={styles.bookingActions}>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => cancelBooking(booking, "upcoming")}
                >
                  Cancel Booking
                </button>
                <button
                  className={styles.btn}
                  onClick={() => modifyBooking(booking)}
                >
                  Modify Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${styles.tabContent} ${
          activeTab === "pending" ? styles.active : ""
        }`}
        id="pending"
      >
        <div className={styles.bookingList}>
          {bookings.pending.map((booking) => (
            <div key={booking.id} className={styles.bookingItem}>
              {/* Booking item content */}
              {/* ... */}
              <div className={styles.bookingActions}>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => cancelBooking(booking, "pending")}
                >
                  Cancel Booking
                </button>
                <button
                  className={styles.btn}
                  onClick={() => modifyBooking(booking)}
                >
                  Modify Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${styles.tabContent} ${
          activeTab === "rejected" ? styles.active : ""
        }`}
        id="rejected"
      >
        <div className={styles.bookingList}>
          {bookings.rejected.map((booking) => (
            <div key={booking.id} className={styles.bookingItem}>
              {/* Booking item content */}
              {/* ... */}
              <div className={styles.bookingActions}>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => cancelBooking(booking, "rejected")}
                >
                  Cancel Booking
                </button>
                <button
                  className={styles.btn}
                  onClick={() => modifyBooking(booking)}
                >
                  Modify Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${styles.tabContent} ${
          activeTab === "history" ? styles.active : ""
        }`}
        id="history"
      >
        <div className={styles.bookingList}>
          {bookings.history.map((booking) => (
            <div key={booking.id} className={styles.bookingItem}>
              {/* Booking item content */}
              {/* ... */}
              <div className={styles.bookingActions}>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => cancelBooking(booking, "history")}
                >
                  Cancel Booking
                </button>
                <button
                  className={styles.btn}
                  onClick={() => modifyBooking(booking)}
                >
                  Modify Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyBookings;
