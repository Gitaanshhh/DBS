import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./MyBookings.module.css";

/**
 * MyBookings page - shows all bookings made by the logged-in user.
 */
const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch bookings by user_id and email, deduplicate by booking_id
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        let bookingsArr = [];
        let seen = new Set();

        // Fetch by user_id
        if (user?.user_id) {
          const url = `http://localhost:8000/api/my-bookings/?user_id=${user.user_id}`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (data.bookings && Array.isArray(data.bookings)) {
              data.bookings.forEach(b => {
                if (!seen.has(b.booking_id)) {
                  bookingsArr.push(
                    Object.fromEntries(
                      Object.entries(b).map(([k, v]) => [k, v == null ? "" : v.toString()])
                    )
                  );
                  seen.add(b.booking_id);
                }
              });
            }
          }
        }

        // Fetch by email as fallback
        if (user?.email) {
          const url = `http://localhost:8000/api/my-bookings/?email=${encodeURIComponent(user.email)}`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (data.bookings && Array.isArray(data.bookings)) {
              data.bookings.forEach(b => {
                if (!seen.has(b.booking_id)) {
                  bookingsArr.push(
                    Object.fromEntries(
                      Object.entries(b).map(([k, v]) => [k, v == null ? "" : v.toString()])
                    )
                  );
                  seen.add(b.booking_id);
                }
              });
            }
          }
        }

        setBookings(bookingsArr);
        if (bookingsArr.length === 0) setError("No bookings found.");
      } catch (err) {
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.user_id || user?.email) fetchBookings();
  }, [user]);

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>My Bookings</h1>
      {loading && <div>Loading your bookings...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && bookings.length === 0 && (
        <div className={styles.noBookings}>No bookings found.</div>
      )}
      <div className={styles.bookingsGrid}>
        {bookings.map((booking) => {
          // Normalize field casing for display
          const bookingId = booking.booking_id || booking.BOOKING_ID;
          const venueName = booking.venue_name || booking.VENUE_NAME;
          const buildingName = booking.building_name || booking.BUILDING_NAME;
          const floorNumber = booking.floor_number || booking.FLOOR_NUMBER;
          const seatingCapacity = booking.seating_capacity || booking.SEATING_CAPACITY;
          const imageUrl = booking.image_url || booking.IMAGE_URL || "/assets/venues/default.jpg";
          const bookingDate = booking.booking_date || booking.BOOKING_DATE;
          const startTime = booking.start_time || booking.START_TIME;
          const endTime = booking.end_time || booking.END_TIME;
          const purpose = booking.purpose || booking.PURPOSE;
          const status = (booking.status || booking.STATUS || "").toLowerCase();

          return (
            <div 
              key={`booking-${bookingId}`} 
              className={styles.bookingCard}
            >
              <div className={styles.venueImageWrapper}>
                <img
                  src={imageUrl}
                  alt={venueName}
                  className={styles.venueImage}
                />
              </div>
              <div className={styles.bookingInfo}>
                <h2 className={styles.venueName}>{venueName}</h2>
                <div className={styles.venueLocation}>
                  {buildingName}
                  {floorNumber ? `, Floor ${floorNumber}` : ""}
                </div>
                <div className={styles.venueCapacity}>
                  Capacity: {seatingCapacity}
                </div>
                <div className={styles.bookingDateTime}>
                  <span>
                    <i className="far fa-calendar-alt"></i>{" "}
                    {bookingDate}
                  </span>
                  <span>
                    <i className="far fa-clock"></i>{" "}
                    {startTime} - {endTime}
                  </span>
                </div>
                <div className={styles.bookingPurpose}>
                  <strong>Purpose:</strong> {purpose}
                </div>
                <div className={styles.bookingStatus}>
                  Status:{" "}
                  <span className={styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`] || ""}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default MyBookings;
