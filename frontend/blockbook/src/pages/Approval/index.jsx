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
        {approvals.map((approval) => (
          <div key={approval.approval_id} className={styles.approvalCard}>
            <div className={styles.venueImageWrapper}>
              <img
                src={approval.image_url || "/assets/venues/default.jpg"}
                alt={approval.venue_name}
                className={styles.venueImage}
              />
            </div>
            <div className={styles.approvalInfo}>
              <h2 className={styles.venueName}>{approval.venue_name}</h2>
              <div className={styles.venueLocation}>
                {approval.building_name}
                {approval.floor_number
                  ? `, Floor ${approval.floor_number}`
                  : ""}
              </div>
              <div className={styles.venueCapacity}>
                Capacity: {approval.seating_capacity}
              </div>
              <div className={styles.bookingDateTime}>
                <span>
                  <i className="far fa-calendar-alt"></i>{" "}
                  {approval.booking_date}
                </span>
                <span>
                  <i className="far fa-clock"></i>{" "}
                  {approval.start_time} - {approval.end_time}
                </span>
              </div>
              <div className={styles.bookingPurpose}>
                <strong>Purpose:</strong> {approval.purpose}
              </div>
              <div className={styles.requesterEmail}>
                <strong>Requester:</strong> {approval.requester_email}
              </div>
              <div className={styles.bookingStatus}>
                Status:{" "}
                <span className={styles[`status${approval.booking_status}`] || ""}>
                  {approval.booking_status}
                </span>
              </div>
              <div className={styles.actionButtons}>
                <button
                  className={styles.approveBtn}
                  onClick={() => handleAction(approval.approval_id, "Y")}
                  disabled={actionLoading}
                >
                  Approve
                </button>
                <button
                  className={styles.rejectBtn}
                  onClick={() => handleAction(approval.approval_id, "N")}
                  disabled={actionLoading}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Approval;
