// src/pages/Approval/index.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Approval.module.css";

const Approval = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchApprovals = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `http://localhost:8000/api/approvals/?user_id=${user.user_id}&role=${user.role || user.user_type}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch approvals");
        const data = await response.json();
        setApprovals(data.approvals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.user_id && (user.role || user.user_type)) fetchApprovals();
  }, [user]);

  const handleAction = async (approval_id, approve) => {
    setActionLoading(true);
    setError("");
    try {
      const comments = prompt(approve === "Y" ? "Comments for approval (optional):" : "Reason for rejection:");
      const payload = {
        approval_id,
        approve,
        comments: comments || "",
        approver_id: user.user_id,
      };
      const response = await fetch("http://localhost:8000/api/approve-booking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update approval");
      }
      // Refresh approvals after action
      setApprovals((prev) => prev.filter((a) => a.approval_id !== approval_id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.sectionTitle}>Booking Approvals</h1>
      {loading && <div>Loading approvals...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.approvalsGrid}>
        {approvals.length === 0 && !loading && (
          <div className={styles.noApprovals}>No pending approvals.</div>
        )}
        {approvals.map((approval) => {
          // Normalize field casing for display
          const approvalId = approval.approval_id || approval.APPROVAL_ID;
          const venueName = approval.venue_name || approval.VENUE_NAME;
          const buildingName = approval.building_name || approval.BUILDING_NAME;
          const floorNumber = approval.floor_number || approval.FLOOR_NUMBER;
          const seatingCapacity = approval.seating_capacity || approval.SEATING_CAPACITY;
          const imageUrl = approval.image_url || approval.IMAGE_URL || "/assets/venues/default.jpg";
          const bookingDate = approval.booking_date || approval.BOOKING_DATE;
          const startTime = approval.start_time || approval.START_TIME;
          const endTime = approval.end_time || approval.END_TIME;
          const purpose = approval.purpose || approval.PURPOSE;
          const requesterEmail = approval.requester_email || approval.REQUESTER_EMAIL;
          const status = (approval.status || approval.STATUS || "").toLowerCase();

          return (
            <div 
              key={`approval-${approvalId}`} 
              className={styles.approvalCard}
            >
              <div className={styles.venueImageWrapper}>
                <img
                  src={imageUrl}
                  alt={venueName}
                  className={styles.venueImage}
                />
              </div>
              <div className={styles.approvalInfo}>
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
                <div className={styles.requesterEmail}>
                  <strong>Requester:</strong> {requesterEmail}
                </div>
                <div className={styles.bookingStatus}>
                  Status:{" "}
                  <span className={styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`] || ""}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleAction(approvalId, "Y")}
                    disabled={actionLoading}
                  >
                    Approve
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleAction(approvalId, "N")}
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Approval;
