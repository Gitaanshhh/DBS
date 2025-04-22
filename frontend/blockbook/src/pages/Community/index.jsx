import React from "react";
import { useCommunity } from "../../hooks/useCommunity";
import styles from "./Community.module.css";

const Community = () => {
  const {
    activeTab,
    switchTab,
    requestExchange,
    addToCalendar,
    cancelExchangeRequest,
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
        <button
          className={`${styles.tabBtn} ${
            activeTab === "exchange-history" ? styles.active : ""
          }`}
          onClick={() => switchTab("exchange-history")}
        >
          Exchange History
        </button>
      </div>

      <div
        className={`${styles.tabContent} ${
          activeTab === "booking-board" ? styles.active : ""
        }`}
        id="booking-board"
      >
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by student body or venue..."
            />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className={styles.filterDropdown}>
            <select>
              <option value="">All Student Bodies</option>
              <option value="student-council">Student Council</option>
              <option value="cultural-club">Cultural Club</option>
              <option value="tech-society">Tech Society</option>
              <option value="sports-club">Sports Club</option>
              <option value="debate-club">Debate Club</option>
            </select>
          </div>
          <div className={styles.filterDropdown}>
            <select>
              <option value="">All Venues</option>
              <option value="lecture-halls">Lecture Halls</option>
              <option value="seminar-halls">Seminar Halls</option>
              <option value="auditoriums">Auditoriums</option>
              <option value="outdoor">Outdoor Venues</option>
            </select>
          </div>
          <div className={styles.filterDropdown}>
            <select>
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
            </select>
          </div>
        </div>

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
            <div className={styles.bookingActions}>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <i className="fas fa-exchange-alt"></i> Request Exchange
              </button>
              <button className={styles.btn}>
                <i className="far fa-calendar-plus"></i> Add to Calendar
              </button>
            </div>
          </div>

          {/* More booking cards would go here */}
        </div>
      </div>

      <div
        className={`${styles.tabContent} ${
          activeTab === "exchange-history" ? styles.active : ""
        }`}
        id="exchange-history"
      >
        <div className={styles.exchangeList}>
          <div className={styles.exchangeCard}>
            <div className={styles.exchangeHeader}>
              <div className={`${styles.exchangeStatus} ${styles.completed}`}>
                <i className="fas fa-check-circle"></i> Completed
              </div>
              <div className={styles.exchangeDate}>April 15, 2025</div>
            </div>
            <div className={styles.exchangeDetails}>
              <div className={styles.exchangeParties}>
                <div className={styles.exchangeParty}>
                  <h4>Your Booking</h4>
                  <p className={styles.venue}>Lecture Hall A101</p>
                  <p className={styles.time}>8:00 AM - 12:00 PM</p>
                  <p className={styles.date}>April 15, 2025</p>
                </div>
                <div className={styles.exchangeArrow}>
                  <i className="fas fa-exchange-alt"></i>
                </div>
                <div className={styles.exchangeParty}>
                  <h4>Cultural Club's Booking</h4>
                  <p className={styles.venue}>Seminar Hall 1</p>
                  <p className={styles.time}>8:00 AM - 12:00 PM</p>
                  <p className={styles.date}>April 15, 2025</p>
                </div>
              </div>
              <div className={styles.exchangeReason}>
                <h4>Reason for Exchange</h4>
                <p>
                  Needed a larger venue for unexpected increase in attendees.
                </p>
              </div>
            </div>
          </div>

          {/* More exchange cards would go here */}
        </div>
      </div>
    </main>
  );
};

export default Community;
