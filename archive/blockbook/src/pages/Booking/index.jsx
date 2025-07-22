import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Booking.module.css";

const Booking = () => {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [venueData, setVenueData] = useState(null);
  const [formData, setFormData] = useState({
    organizerName: "",
    organizerEmail: "",
    department: "",
    attendees: "",
    purpose: "",
    setupRequirements: "",
    additionalNotes: "",
  });
  const [bookingDate, setBookingDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    setBookingDate(today);

    // Load venue information from localStorage
    try {
      const storedVenueData = localStorage.getItem("selectedVenue");
      if (storedVenueData) {
        setVenueData(JSON.parse(storedVenueData));
      } else {
        // If no venue data, redirect back to main page
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading venue data:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleTimeSlotClick = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!selectedTimeSlot) {
      setSubmitError("Please select a time slot");
      return;
    }

    setSubmitting(true);

    try {
      // Prepare start and end time based on slot
      let start_time = "", end_time = "";
      if (selectedTimeSlot === "8:00 AM - 12:00 PM") {
        start_time = "08:00:00";
        end_time = "12:00:00";
      } else if (selectedTimeSlot === "12:00 PM - 4:00 PM") {
        start_time = "12:00:00";
        end_time = "16:00:00";
      } else if (selectedTimeSlot === "4:00 PM - 8:00 PM") {
        start_time = "16:00:00";
        end_time = "20:00:00";
      }

      // Compose booking payload
      const payload = {
        venue_id: venueId || (venueData && (venueData.venue_id || venueData.id)),
        booking_date: bookingDate,
        start_time,
        end_time,
        organizer_name: formData.organizerName,
        organizer_email: formData.organizerEmail,
        department: formData.department,
        attendees: formData.attendees,
        purpose: formData.purpose,
        setup_requirements: formData.setupRequirements,
        additional_notes: formData.additionalNotes,
      };

      // POST to backend
      const response = await fetch("http://localhost:8000/api/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit booking request");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!venueData) {
    return <div className={styles.loading}>Loading venue information...</div>;
  }

  return (
    <main className={styles.main}>
      <Link to="/explore" className={styles.backLink}>
        Back to venues
      </Link>

      <div className={styles.bookingContainer}>
        <div className={styles.venueHeader}>
          <img
            src={venueData.image || "/assets/venues/default.jpg"}
            alt={venueData.title}
            className={styles.venueImage}
          />
          <div className={styles.venueInfo}>
            <h1 className={styles.venueTitle}>{venueData.title}</h1>
            <p className={styles.venueLocation}>{venueData.location}</p>
            <p className={styles.venueCapacity}>{venueData.capacity}</p>
            <div className={styles.venueFeatures}>
              <span className={styles.feature} id="feature1"></span>
              <span className={styles.feature} id="feature2"></span>
              <span className={styles.feature} id="feature3"></span>
            </div>
            <p className={styles.venueDescription}>
              This venue offers state-of-the-art facilities in a convenient
              location. Perfect for academic events, presentations, workshops,
              and group activities. The space is well-maintained and equipped
              with modern technology to support your educational and
              extracurricular needs.
            </p>
          </div>
        </div>

        <div className={styles.bookingForm}>
          <h2 className={styles.formTitle}>Book This Venue</h2>

          <div className={styles.availabilityCalendar}>
            <div className={styles.calendarHeader}>
              <span className={styles.calendarTitle}>Select Date and Time</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="booking-date" className={styles.required}>
                Date
              </label>
              <input
                type="date"
                id="booking-date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>

            <div className={styles.timeSlots}>
              <div
                className={`${styles.timeSlot} ${
                  selectedTimeSlot === "8:00 AM - 12:00 PM"
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleTimeSlotClick("8:00 AM - 12:00 PM")}
              >
                8:00 AM - 12:00 PM
              </div>
              <div
                className={`${styles.timeSlot} ${
                  selectedTimeSlot === "12:00 PM - 4:00 PM"
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleTimeSlotClick("12:00 PM - 4:00 PM")}
              >
                12:00 PM - 4:00 PM
              </div>
              <div
                className={`${styles.timeSlot} ${
                  selectedTimeSlot === "4:00 PM - 8:00 PM"
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleTimeSlotClick("4:00 PM - 8:00 PM")}
              >
                4:00 PM - 8:00 PM
              </div>
            </div>
          </div>

          <form id="venue-booking-form" onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="organizerName" className={styles.required}>
                  Organizer Name
                </label>
                <input
                  type="text"
                  id="organizerName"
                  required
                  value={formData.organizerName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="organizerEmail" className={styles.required}>
                  Email
                </label>
                <input
                  type="email"
                  id="organizerEmail"
                  required
                  value={formData.organizerEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="department" className={styles.required}>
                  Department
                </label>
                <select
                  id="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  <option value="computer-science">Computer Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="business">Business</option>
                  <option value="arts">Arts & Humanities</option>
                  <option value="science">Science</option>
                  <option value="student-club">
                    Student Club/Organization
                  </option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="attendees" className={styles.required}>
                  Expected Number of Attendees
                </label>
                <input
                  type="number"
                  id="attendees"
                  min="1"
                  required
                  value={formData.attendees}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="purpose" className={styles.required}>
                Purpose to book selected venue
              </label>
              <textarea
                id="purpose"
                required
                placeholder="Please describe the purpose of your booking (e.g., lecture, workshop, meeting, event)"
                value={formData.purpose}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="setupRequirements" className={styles.required}>
                Tools/Setup Requirements
              </label>
              <textarea
                id="setupRequirements"
                required
                placeholder="Describe any specific setup or equipment you need (e.g., projector, microphones, special seating arrangement)"
                value={formData.setupRequirements}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="additionalNotes">
                Additional Notes (Optional)
              </label>
              <textarea
                id="additionalNotes"
                placeholder="Any additional information or special requests"
                value={formData.additionalNotes}
                onChange={handleInputChange}
              ></textarea>
            </div>

            {submitError && (
              <div className={styles.error}>{submitError}</div>
            )}
            {submitSuccess && (
              <div className={styles.success}>
                Booking request submitted successfully!
              </div>
            )}

            <div className={styles.formActions}>
              <Link
                to="/"
                className={`${styles.btn} ${styles.btnSecondary} ${styles.cancelBtn}`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`${styles.btn} ${styles.submitBtn}`}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Booking Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Booking;
