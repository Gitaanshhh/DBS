import React, { useEffect, useState } from "react";
import styles from "./Community.module.css";

/**
 * Records page - shows booking logs (BookingHistory) in card layout
 */
const Records = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch booking logs from backend
    const fetchLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8000/api/booking-logs/");
        if (!response.ok) throw new Error("Failed to fetch booking logs");
        const data = await response.json();
        // Defensive: convert all fields to string for display
        const logsArr = (data.logs || []).map(log =>
          Object.fromEntries(
            Object.entries(log).map(([k, v]) => [k, v == null ? "" : v.toString()])
          )
        );
        setLogs(logsArr);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Booking Logs</h1>
      {loading && <div>Loading logs...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && logs.length === 0 && (
        <div className={styles.noLogs}>No booking logs found.</div>
      )}
      <div className={styles.logsGrid}>
        {logs.map((log) => {
          // Defensive: try all casings for each field
          const bookingId = log.booking_id || log.BOOKING_ID;
          const action = log.action_taken || log.ACTION_TAKEN;
          const user = log.user_email || log.USER_EMAIL || log.action_by || log.ACTION_BY;
          const date = log.action_date || log.ACTION_DATE;
          return (
            <div key={log.history_id || log.HISTORY_ID} className={styles.logCard}>
              <div className={styles.logHeader}>
                <span className={styles.logBookingId}>Booking #{bookingId}</span>
                <span className={styles.logDate}>{date}</span>
              </div>
              <div className={styles.logBody}>
                <div className={styles.logAction}><strong>Action:</strong> {action}</div>
                <div className={styles.logUser}><strong>User:</strong> {user}</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Records;
