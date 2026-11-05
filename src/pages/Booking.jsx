import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./Booking.css";
const API_URL = "http://localhost:5000";
function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedResourceId = location.state?.resourceId || "";
    const [resources, setResources] = useState([]);
    const [resource, setResource] = useState(selectedResourceId);
    const [bookingDate, setBookingDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [purpose, setPurpose] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const getResources = async () => {
        try {
            const token = localStorage.getItem("token");
                        const response = await axios.get(
                    `${API_URL}/api/student/resources`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            const data = response.data;
            const resourceList = Array.isArray(data)
                ? data
                : data.resources || data.resource || [];
            setResources(Array.isArray(resourceList) ? resourceList : []);
        } catch (err) {
            console.error("Resource Error:", err);
            setError("Unable to load resources.");
        }
    };
    useEffect(() => {
        getResources();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        if (!resource || !bookingDate || !startTime || !endTime || !purpose.trim()) {
            setError("Please fill all the fields.");
            return;
        }
        if (endTime <= startTime) {
            setError("End time must be after start time.");
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const bookingData = {
                resource: resource,
                bookingDate: bookingDate,
                startTime: startTime,
                endTime: endTime,
                purpose: purpose.trim()
            };
            const response = await axios.post(
                `${API_URL}/api/student/booking`,
                bookingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage(
                response.data.message || "Booking request submitted successfully!"
            );
            setResource("");
            setBookingDate("");
            setStartTime("");
            setEndTime("");
            setPurpose("");

        } catch (err) {
            console.error("Booking Error:", err);
            setError(
                err.response?.data?.message ||
                "Booking failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="booking-page">
            <div className="booking-header">
                <div>
                    <h1>Book a Resource</h1>
                    <p>Fill in the details to request a lab or equipment booking.</p>
                </div>

                <Link to="/resources" className="booking-back">
                    Back to Resources
                </Link>
            </div>
            <div className="booking-container">
                <div className="booking-form-header">
                    <h2>Booking Details</h2>
                    <p>Please enter your booking information below.</p>
                </div>
                {message && (
                    <div className="booking-success">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="booking-error">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="booking-field">
                        <label>Select Resource</label>
                        <select
                            value={resource}
                            onChange={(e) => setResource(e.target.value)}
                            required
                        >
                            <option value="">Choose a resource</option>
                            {resources.map((item) => (
                                <option
                                    key={item._id}
                                    value={item._id}
                                    disabled={item.isActive === false}
                                >
                                    {item.name || "Unnamed Resource"}
                                    {item.isActive === false ? " (Inactive)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="booking-field">
                        <label>Booking Date</label>
                        <input
                            type="date"
                            value={bookingDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setBookingDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="booking-time-row">
                        <div className="booking-field">
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="booking-field">
                            <label>End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="booking-field">
                        <label>Purpose</label>
                        <textarea
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="Enter the purpose of booking"
                            rows="4"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="booking-submit"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Booking"}
                    </button>
                    <button
                        type="button"
                        className="booking-cancel"
                        onClick={() => navigate("/resources")}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Booking;
