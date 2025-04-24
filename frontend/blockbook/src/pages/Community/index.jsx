import React from "react";
import { useCommunity } from "../../hooks/useCommunity";
import styles from "./Community.module.css";

const Community = () => {
  const {
    activeTab,
    switchTab,
    addToCalendar,
    sendReminder,
    searchEvents,
    applyFilter,
  } = useCommunity();

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Community</h1>

      <div className={styles.communityTabs}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "booking-board" ? styles.active : ""
          }`}
          onClick={() => switchTab("booking-board")}
        >
          Booking Board
        </button>
      </div>

      <div className={`${styles.tabContent} ${activeTab === 'board' ? styles.active : ''}`}>
        <div className={styles.bookingList}>
          <div className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <div className={styles.studentBody}>
                <img
                  src="/assets/logos/student-council.jpg"
                  alt="Student Council Logo"
                />
                <h3>Student Council</h3>
              </div>
              <div className={styles.bookingDate}>
                <i className="far fa-calendar-alt"></i> April 23, 2025
              </div>
            </div>
            <div className={styles.bookingDetails}>
              <div className={styles.venueInfo}>
                <h4>Main Auditorium</h4>
                <p>
                  <i className="fas fa-map-marker-alt"></i> Central Campus
                </p>
                <p>
                  <i className="far fa-clock"></i> 4:00 PM - 8:00 PM
                </p>
              </div>
              <div className={styles.eventInfo}>
                <h4>Annual Cultural Festival</h4>
                <p>
                  A celebration of diverse cultures with performances, food
                  stalls, and interactive sessions.
                </p>
                <div className={styles.eventTags}>
                  <span className={styles.tag}>Cultural</span>
                  <span className={styles.tag}>Festival</span>
                  <span className={styles.tag}>Open to All</span>
                </div>
              </div>
            </div>
          </div>

          {/* More booking cards would go here */}
        </div>
      </div>

      <div className={`${styles.tabContent} ${activeTab === 'exchange' ? styles.active : ''}`}>
        <div className={styles.exchangeList}>
          {/* ... existing exchange list content ... */}
        </div>
      </div>
    </main>
  );
};

export default Community;
