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
        const url = `http://localhost:8000/api/my-bookings/?user_id=${user.user_id}`;
        const response = await fetch(url);
        
        // First check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          setError(`Server error: ${errorText.substring(0, 200)}`);
          setBookings([]);
          setLoading(false);
          return;
        }

        // If response is ok, try to parse as JSON
        try {
          const data = await response.json();
          setBookings(data.bookings || []);
        } catch (jsonErr) {
          setError("Invalid response format from server");
          setBookings([]);
        }
      } catch (err) {
        setError(err.message);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.user_id) {
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
          <div key={booking.booking_id} className={styles.bookingCard}>
            <div className={styles.venueImageWrapper}>
              <img
                src={booking.image_url || "/assets/venues/default.jpg"}
                alt={booking.venue_name}
                className={styles.venueImage}
              />
            </div>
            <div className={styles.bookingInfo}>
              <h2 className={styles.venueName}>{booking.venue_name}</h2>
              <div className={styles.venueLocation}>
                {booking.building_name}
                {booking.floor_number
                  ? `, Floor ${booking.floor_number}`
                  : ""}
              </div>
              <div className={styles.venueCapacity}>
                Capacity: {booking.seating_capacity}
              </div>
              <div className={styles.bookingDateTime}>
                <span>
                  <i className="far fa-calendar-alt"></i>{" "}
                  {booking.booking_date}
                </span>
                <span>
                  <i className="far fa-clock"></i>{" "}
                  {booking.start_time} - {booking.end_time}
                </span>
              </div>
              <div className={styles.bookingPurpose}>
                <strong>Purpose:</strong> {booking.purpose}
              </div>
              <div className={styles.bookingStatus}>
                Status:{" "}
                <span className={styles[`status${booking.status}`] || ""}>
                  {booking.status}
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
