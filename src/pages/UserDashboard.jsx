import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserDashboard.css";
const API_URL = "import.meta.env.VITE_BASE_URL";
function UserDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");
    const getBookings = async () => {
        try {
            setLoading(true);
            setError("");
            if (!token) {
                setError("Please login again.");
                setBookings([]);
                return;
            }
            const response = await axios.get(
                `${API_URL}/api/student/my-bookings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setBookings(response.data.bookings || []);
        } catch (error) {
            setBookings([]);
            setError(
                error.response?.data?.message ||
                "Unable to load bookings"
            );

        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getBookings();
    }, []);
    const cancelBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel?")) {
            return;
        }
        try {
            setError("");
            setMessage("");
            await axios.patch(
                `${API_URL}/api/student/booking/${id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage("Booking cancelled successfully");
            await getBookings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to cancel booking"
            );
        }
    }
    const pending = bookings.filter(
        b => b.status?.toLowerCase() === "pending"
    ).length;
    const approved = bookings.filter(
        b => b.status?.toLowerCase() === "approved"
    ).length;
    const rejected = bookings.filter(
        b => b.status?.toLowerCase() === "rejected"
    ).length;
    return (
        <div className="user-dashboard">
            <div className="user-header">
                <div>
                    <h1>User Dashboard</h1>
                    <p>
                        Welcome to Lab and Equipment Booking System
                    </p>
                </div>
                <button
                    className="user-refresh"
                    onClick={getBookings}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>
            <div className="user-links">
                <Link to="/resources">
                    View Resources
                </Link>
                <Link to="/booking">
                    Book a Resource
                </Link>
            </div>
            {message && (
                <p className="user-success">{message}</p>
            )}
            {error && (
                <p className="user-error">{error}</p>
            )}
            <div className="user-cards">
                <div className="user-card">
                    <h3>Total Bookings</h3>
                    <h2>{bookings.length}</h2>
                </div>
                <div className="user-card">
                    <h3>Pending</h3>
                    <h2>{pending}</h2>
                </div>
                <div className="user-card">
                    <h3>Approved</h3>
                    <h2>{approved}</h2>
                </div>
                <div className="user-card">
                    <h3>Rejected</h3>
                    <h2>{rejected}</h2>
                </div>
            </div>
            <div className="my-bookings">
                <h2>My Bookings</h2>
                {loading ? (
                    <p className="user-empty">
                        Loading bookings...
                    </p>
                ) : bookings.length === 0 ? (
                    <p className="user-empty">
                        No bookings found.
                    </p>
                ) : (
                    <div className="user-table-wrapper">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Resource</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td>
                                            {booking.resource?.name || "N/A"}
                                        </td>

                                        <td>
                                            {booking.bookingDate
                                                ? new Date(
                                                    booking.bookingDate
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td>
                                            {booking.startTime} - {booking.endTime}
                                        </td>

                                        <td>
                                            {booking.purpose || "N/A"}
                                        </td>

                                        <td>
                                            <span
                                                className={`user-status ${booking.status?.toLowerCase()}`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>

                                        <td>
                                            {booking.status?.toLowerCase() === "pending" && (

                                                <button
                                                    className="cancel-booking"
                                                    onClick={() =>
                                                        cancelBooking(booking._id)
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
export default UserDashboard;
