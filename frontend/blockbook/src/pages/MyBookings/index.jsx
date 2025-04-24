import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        let bookingsArr = [];
        let seen = new Set();

        // 1. Try user_id if available
        if (user?.user_id) {
          const url = `http://localhost:8000/api/my-bookings/?user_id=${user.user_id}`;
          const response = await fetch(url);
          if (response.ok) {
            try {
              const data = await response.json();
              // Debug: log the raw data
              console.log("Raw bookings data by user_id:", data);
              if (data.bookings && Array.isArray(data.bookings)) {
                data.bookings.forEach(b => {
                  if (!seen.has(b.booking_id)) {
                    // Debug: log each booking object
                    console.log("Booking object:", b);
                    bookingsArr.push(
                      Object.fromEntries(
                        Object.entries(b).map(([k, v]) => [k, v == null ? "" : v.toString()])
                      )
                    );
                    seen.add(b.booking_id);
                  }
                });
              }
            } catch (e) {
              console.error("Error parsing bookings by user_id:", e);
            }
          } else {
            const text = await response.text();
            console.error("Error response for user_id:", text);
          }
        }

        // 2. Try email if available and not already tried
        if (user?.email) {
          const url = `http://localhost:8000/api/my-bookings/?email=${encodeURIComponent(user.email)}`;
          const response = await fetch(url);
          if (response.ok) {
            try {
              const data = await response.json();
              // Debug: log the raw data
              console.log("Raw bookings data by email:", data);
              if (data.bookings && Array.isArray(data.bookings)) {
                data.bookings.forEach(b => {
                  if (!seen.has(b.booking_id)) {
                    // Debug: log each booking object
                    console.log("Booking object:", b);
                    bookingsArr.push(
                      Object.fromEntries(
                        Object.entries(b).map(([k, v]) => [k, v == null ? "" : v.toString()])
                      )
                    );
                    seen.add(b.booking_id);
                  }
                });
              }
            } catch (e) {
              console.error("Error parsing bookings by email:", e);
            }
          } else {
            const text = await response.text();
            console.error("Error response for email:", text);
          }
        }

        // Debug: log the bookingsArr after all fetches
        console.log("Final bookingsArr:", bookingsArr);

        setBookings(bookingsArr);
        if (bookingsArr.length === 0) {
          setError("No bookings found.");
        }
      } catch (err) {
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.user_id || user?.email) {
      fetchBookings();
    }
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
        {bookings.map((booking) => (
          <div 
            key={`booking-${booking.BOOKING_ID || booking.booking_id}`} 
            className={styles.bookingCard}
          >
            <div className={styles.venueImageWrapper}>
              <img
                src={booking.IMAGE_URL || booking.image_url || "/assets/venues/default.jpg"}
                alt={booking.VENUE_NAME || booking.venue_name}
                className={styles.venueImage}
              />
            </div>
            <div className={styles.bookingInfo}>
              <h2 className={styles.venueName}>{booking.VENUE_NAME || booking.venue_name}</h2>
              <div className={styles.venueLocation}>
                {booking.BUILDING_NAME || booking.building_name}
                {booking.FLOOR_NUMBER || booking.floor_number
                  ? `, Floor ${booking.FLOOR_NUMBER || booking.floor_number}`
                  : ""}
              </div>
              <div className={styles.venueCapacity}>
                Capacity: {booking.SEATING_CAPACITY || booking.seating_capacity}
              </div>
              <div className={styles.bookingDateTime}>
                <span>
                  <i className="far fa-calendar-alt"></i>{" "}
                  {booking.BOOKING_DATE || booking.booking_date}
                </span>
                <span>
                  <i className="far fa-clock"></i>{" "}
                  {booking.START_TIME || booking.start_time} - {booking.END_TIME || booking.end_time}
                </span>
              </div>
              <div className={styles.bookingPurpose}>
                <strong>Purpose:</strong> {booking.PURPOSE || booking.purpose}
              </div>
              <div className={styles.bookingStatus}>
                Status:{" "}
                <span className={styles[`status${booking.STATUS || booking.status}`] || ""}>
                  {booking.STATUS || booking.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MyBookings;
