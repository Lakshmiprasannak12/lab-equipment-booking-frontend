import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "./AdminDashboard.css";
function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [resourceName, setResourceName] = useState("");
    const [resourceType, setResourceType] = useState("Lab");
    const [capacity, setCapacity] = useState("");
    const [resourceError, setResourceError] = useState("");
    const [resourceMessage, setResourceMessage] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const getBookings = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/admin/bookings");
            setBookings(
                Array.isArray(response.data.bookings)
                    ? response.data.bookings
                    : []
            );
        } catch (error) {
            console.error("Booking error:", error);
            setError(
                error.response?.data?.message ||
                "Unable to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };
    const getResources = async () => {
        try {
            setResourceError("");
            const response = await api.get("/admin/resources");
            setResources(
                Array.isArray(response.data.resources)
                    ? response.data.resources
                    : []
            );
        } catch (error) {
            console.error("Resource error:", error);
            setResourceError(
                error.response?.data?.message ||
                "Unable to load resources"
            );
        }
    };
    useEffect(() => {
        getBookings();
        getResources();
    }, []);
    const addResource = async (e) => {
        e.preventDefault();
        setResourceMessage("");
        setResourceError("");
        try {
            await api.post("/admin/resources", {
                name: resourceName,
                type: resourceType,
                capacity: Number(capacity)
            });
            setResourceMessage("Resource added successfully!");
            setResourceName("");
            setResourceType("Lab");
            setCapacity("");
            await getResources();
        } catch (error) {
            console.error("Add resource error:", error);
            setResourceError(
                error.response?.data?.message ||
                "Unable to add resource"
            );
        }
    };
    const updateStatus = async (id, status) => {
        try {
            setMessage("");
            setError("");
            await api.patch(`/admin/booking/${id}/status`, {
                status: status
            });
            setMessage(`Booking ${status} successfully`);
            if (selectedBooking?._id === id) {
                setSelectedBooking(null);
            }
            await getBookings();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update booking status"
            );
        }
    };
    const filteredBookings = bookings.filter((booking) => {
        if (filter === "All") {
            return true;
        }
        return booking.status?.toLowerCase() === filter.toLowerCase();
    });
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
        (booking) => booking.status?.toLowerCase() === "pending"
    ).length;
    const approvedBookings = bookings.filter(
        (booking) => booking.status?.toLowerCase() === "approved"
    ).length;
    const rejectedBookings = bookings.filter(
        (booking) => booking.status?.toLowerCase() === "rejected"
    ).length;
    return (
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage lab and equipment bookings</p>
                </div>
                <button
                    className="refresh-btn"
                    onClick={() => {
                        getBookings();
                        getResources();
                    }}
                >
                    Refresh
                </button>
            </div>
            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <div className="admin-cards">
                <div className="admin-card total">
                    <h3>Total Bookings</h3>
                    <h2>{totalBookings}</h2>
                </div>
                <div className="admin-card pending">
                    <h3>Pending Bookings</h3>
                    <h2>{pendingBookings}</h2>
                </div>
                <div className="admin-card approved">
                    <h3>Approved Bookings</h3>
                    <h2>{approvedBookings}</h2>
                </div>
                <div className="admin-card rejected">
                    <h3>Rejected Bookings</h3>
                    <h2>{rejectedBookings}</h2>
                </div>
            </div>
            <div className="booking-section">
                <h2>Manage Resources</h2>
                {resourceMessage && (
                    <div className="success-message">
                        {resourceMessage}
                    </div>
                )}
                {resourceError && (
                    <div className="error-message">
                        {resourceError}
                    </div>
                )}
                <form onSubmit={addResource}>
                    <div>
                        <label>Resource Name</label>
                        <input
                            type="text"
                            placeholder="Enter resource name"
                            value={resourceName}
                            onChange={(e) =>
                                setResourceName(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <label>Resource Type</label>
                        <select
                            value={resourceType}
                            onChange={(e) =>
                                setResourceType(e.target.value)
                            }
                        >
                            <option value="Lab">Lab</option>
                            <option value="Seminar Hall">Seminar Hall</option>
                            <option value="Projector">Projector</option>
                            <option value="Device">Device</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label>Capacity</label>
                        <input
                            type="number"
                            placeholder="Enter capacity"
                            value={capacity}
                            onChange={(e) =>
                                setCapacity(e.target.value)
                            }
                            min="1"
                            required
                        />
                    </div>
                    <button type="submit">
                        Add Resource
                    </button>
                </form>
                <h3>Available Resources</h3>
                {resources.length === 0 ? (
                    <p>No resources found.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="booking-table">

                            <thead>
                                <tr>
                                    <th>Resource Name</th>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td>{item.capacity}</td>
                                        <td>
                                            {item.isActive
                                                ? "Available"
                                                : "Inactive"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
               <div className="booking-section">
                <div className="booking-heading">
                    <h2>All Bookings</h2>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Bookings</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                {loading ? (
                    <p className="loading-text">
                        Loading bookings...
                    </p>
                ) : filteredBookings.length === 0 ? (
                    <p className="empty-text">
                        No bookings found.
                    </p>
                ) : (

                    <div className="table-wrapper">
                        <table className="booking-table">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Resource</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((booking) => (

                                    <tr key={booking._id}>

                                        <td>
                                            {booking.user?.name || "N/A"}
                                        </td>

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
                                                className={`status-badge ${
                                                    booking.status?.toLowerCase()
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">

                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        setSelectedBooking(booking)
                                                    }
                                                >
                                                    View Details
                                                </button>

                                                {booking.status?.toLowerCase() === "pending" && (
                                                    <>
                                                        <button
                                                            className="approve-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    booking._id,
                                                                    "Approved"
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            className="reject-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    booking._id,
                                                                    "Rejected"
                                                                )
                                                            }
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                            </div>
                                        </td>

                                    </tr>

                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
            {selectedBooking && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className="booking-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-heading">
                            <h2>Booking Details</h2>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedBooking(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-details">
                            <p>
                                <strong>User:</strong>{" "}
                                {selectedBooking.user?.name || "N/A"}
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedBooking.user?.email || "N/A"}
                            </p>

                            <p>
                                <strong>Resource:</strong>{" "}
                                {selectedBooking.resource?.name || "N/A"}
                            </p>

                            <p>
                                <strong>Date:</strong>{" "}
                                {selectedBooking.bookingDate
                                    ? new Date(
                                        selectedBooking.bookingDate
                                    ).toLocaleDateString()
                                    : "N/A"}
                            </p>

                            <p>
                                <strong>Start Time:</strong>{" "}
                                {selectedBooking.startTime}
                            </p>

                            <p>
                                <strong>End Time:</strong>{" "}
                                {selectedBooking.endTime}
                            </p>

                            <p>
                                <strong>Purpose:</strong>{" "}
                                {selectedBooking.purpose || "N/A"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedBooking.status}
                            </p>

                        </div>

                        {selectedBooking.status?.toLowerCase() === "pending" && (
                            <div className="modal-actions">

                                <button
                                    className="approve-btn"
                                    onClick={() =>
                                        updateStatus(
                                            selectedBooking._id,
                                            "Approved"
                                        )
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={() =>
                                        updateStatus(
                                            selectedBooking._id,
                                            "Rejected"
                                        )
                                    }
                                >
                                    Reject
                                </button>

                            </div>
                        )}

                        <button
                            className="close-btn"
                            onClick={() => setSelectedBooking(null)}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminDashboard;
