import React, { useEffect, useState } from 'react';
import styles from './Approval.module.css';

// Simulate fetching approval requests from backend
const fetchApprovalRequests = async (role) => {
  // Replace with real API call: `/api/approval-requests/?role=${role}`
  return [
    {
      booking_id: 501,
      venue: 'Lecture Hall AB1-101',
      requested_by: 'IEEE Student Branch',
      booking_date: '2025-04-25',
      start_time: '10:00',
      end_time: '12:00',
      purpose: 'IEEE Technical Workshop',
      status: 'Pending',
      current_stage: 'FA'
    },
    {
      booking_id: 502,
      venue: 'Seminar Room AB1-201',
      requested_by: 'ACM Student Chapter',
      booking_date: '2025-04-26',
      start_time: '14:00',
      end_time: '16:00',
      purpose: 'ACM Coding Competition',
      status: 'Pending',
      current_stage: 'SC'
    }
  ];
};

const Approval = () => {
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState('FA'); // Simulate role, set from login context in real app
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApprovalRequests(role).then((data) => {
      setRequests(data.filter(r => r.current_stage === role));
      setLoading(false);
    });
  }, [role]);

  const handleApprove = async (booking_id) => {
    // Real API: POST `/api/approval-requests/${booking_id}/approve/`
    setRequests(reqs => reqs.filter(r => r.booking_id !== booking_id));
    // Optionally show a toast/alert
  };
  const handleReject = async (booking_id) => {
    // Real API: POST `/api/approval-requests/${booking_id}/reject/`
    setRequests(reqs => reqs.filter(r => r.booking_id !== booking_id));
  };

  return (
    <div className={styles.approvalBg}>
      <div className={styles.approvalBox}>
        <h2>Approve Venue Booking Requests</h2>
        <div className={styles.roleSwitch}>
          <label>Logged in as: </label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="FA">Faculty Advisor</option>
            <option value="SC">Student Council</option>
            <option value="SWO">SWO</option>
            <option value="Security">Security</option>
          </select>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : requests.length === 0 ? (
          <div className={styles.noRequests}>No requests to approve.</div>
        ) : (
          <table className={styles.requestTable}>
            <thead>
              <tr>
                <th>Venue</th>
                <th>Requested By</th>
                <th>Date</th>
                <th>Time</th>
                <th>Purpose</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.booking_id}>
                  <td>{req.venue}</td>
                  <td>{req.requested_by}</td>
                  <td>{req.booking_date}</td>
                  <td>{req.start_time} - {req.end_time}</td>
                  <td>{req.purpose}</td>
                  <td>
                    <button className={styles.approveBtn} onClick={() => handleApprove(req.booking_id)}>Approve</button>
                    <button className={styles.rejectBtn} onClick={() => handleReject(req.booking_id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Approval;
