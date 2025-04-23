// src/pages/Approval/index.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Approval.module.css';

const Approval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch approval requests based on user role
    const fetchRequests = async () => {
      try {
        // ACTUAL API CALL:
        // const response = await fetch(`http://your-django-api.com/api/approval-requests/?role=${user.role}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to fetch approval requests');
        // }
        // 
        // const data = await response.json();
        // setRequests(data.requests);
        
        // Mock data for testing
        const mockRequests = [
          {
            id: 1,
            venue: 'Lecture Hall AB1-101',
            requestedBy: 'IEEE Student Branch',
            date: '2025-04-25',
            time: '10:00 AM - 12:00 PM',
            purpose: 'Technical Workshop on IoT',
            currentApprover: user.role
          },
          {
            id: 2,
            venue: 'Seminar Hall 2',
            requestedBy: 'Computer Science Club',
            date: '2025-04-26',
            time: '2:00 PM - 4:00 PM',
            purpose: 'Guest Lecture on AI',
            currentApprover: user.role
          },
          {
            id: 3,
            venue: 'Main Auditorium',
            requestedBy: 'Cultural Club',
            date: '2025-04-27',
            time: '6:00 PM - 9:00 PM',
            purpose: 'Annual Cultural Festival',
            currentApprover: user.role
          }
        ];
        
        setRequests(mockRequests);
      } catch (error) {
        console.error('Error fetching approval requests:', error);
        alert('Failed to load approval requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [user]);

  const handleApprove = async (requestId) => {
    try {
      setLoading(true);
      
      // ACTUAL API CALL:
      // const response = await fetch(`http://your-django-api.com/api/approval-requests/${requestId}/approve/`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ role: user.role })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to approve request');
      // }
      // 
      // const data = await response.json();
      // // Update the requests list
      // setRequests(prevRequests => 
      //   prevRequests.filter(req => req.id !== requestId)
      // );
      
      // Mock approval for testing
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== requestId)
      );
      
      alert('Request approved successfully!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setLoading(true);
      
      // ACTUAL API CALL:
      // const response = await fetch(`http://your-django-api.com/api/approval-requests/${requestId}/reject/`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ 
      //     role: user.role,
      //     reason: prompt('Please provide a reason for rejection:') || 'No reason provided'
      //   })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to reject request');
      // }
      // 
      // const data = await response.json();
      // // Update the requests list
      // setRequests(prevRequests => 
      //   prevRequests.filter(req => req.id !== requestId)
      // );
      
      // Mock rejection for testing
      const reason = prompt('Please provide a reason for rejection:') || 'No reason provided';
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== requestId)
      );
      
      alert(`Request rejected. Reason: ${reason}`);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.approvalPage}>
      <div className={styles.header}>
        <h1>Approval Dashboard</h1>
        <div className={styles.userActions}>
          <span className={styles.userInfo}>
            Logged in as: <strong>{user?.email}</strong> ({user?.role})
          </span>
          <button className={styles.logoutBtn} onClick={logout}>Logout</button>
          {user?.role === 'student-council' && (
            <button className={styles.homeBtn} onClick={() => navigate('/app/home')}>
              Go to Home
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.approvalContainer}>
        <h2>Pending Approval Requests</h2>
        
        {loading ? (
          <div className={styles.loading}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No pending requests require your approval.</p>
          </div>
        ) : (
          <div className={styles.requestsTable}>
            <table>
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
                {requests.map(request => (
                  <tr key={request.id}>
                    <td>{request.venue}</td>
                    <td>{request.requestedBy}</td>
                    <td>{request.date}</td>
                    <td>{request.time}</td>
                    <td>{request.purpose}</td>
                    <td className={styles.actions}>
                      <button 
                        className={styles.approveBtn}
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className={styles.rejectBtn}
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className={styles.approvalInfo}>
          <h3>Approval Pipeline</h3>
          <div className={styles.pipeline}>
            <div className={`${styles.stage} ${user?.role === 'faculty' ? styles.active : ''}`}>
              Faculty Advisor
            </div>
            <div className={styles.arrow}>→</div>
            <div className={`${styles.stage} ${user?.role === 'student-council' ? styles.active : ''}`}>
              Student Council
            </div>
            <div className={styles.arrow}>→</div>
            <div className={`${styles.stage} ${user?.role === 'swo' ? styles.active : ''}`}>
              SWO
            </div>
            <div className={styles.arrow}>→</div>
            <div className={`${styles.stage} ${user?.role === 'security' ? styles.active : ''}`}>
              Security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approval;
