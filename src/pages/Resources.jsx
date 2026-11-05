
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Resource.css";

const API_URL = "http://localhost:5000";

function Resource() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
   const getResources = async () => {
        try {
            setLoading(true);
            setError("");

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

            setResources(
                Array.isArray(resourceList) ? resourceList : []
            );

        } catch (error) {
            console.error("Resource Error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load resources"
            );

        } finally {
            setLoading(false);
        }
    };

      useEffect(() => {
        getResources();
    }, []);

    return (
        <div className="resource-page">
                      <div className="resource-header">
                <div>
                    <h1>Available Resources</h1>
                    <p>
                        Explore available labs and equipment
                    </p>
                </div>
                <Link
                    to="/user-dashboard"
                    className="resource-back"
                >
                    Dashboard
                </Link>
            </div>
              <div className="resource-refresh-section">
                <button
                    className="resource-refresh"
                    onClick={getResources}
                >
                    Refresh Resources
                </button>
            </div>
                {loading && (
                <p className="resource-message">
                    Loading resources...
                </p>
            )}
                      {!loading && error && (
                <div className="resource-error">
                    {error}
                </div>
            )}

           {!loading && !error && resources.length === 0 && (
                <p className="resource-message">
                    No resources available.
                </p>
            )}
                     {!loading && !error && resources.length > 0 && (
                <div className="resource-grid">
                    {resources.map((resource) => (
                        <div
                            className="resource-card"
                            key={resource._id}
                        >
                            <div className="resource-card-header">
                                <h2>
                                    {resource.name || "Unnamed Resource"}
                                </h2>
                                <span
                                    className={
                                        resource.isActive
                                            ? "available"
                                            : "inactive"
                                    }
                                >
                                    {resource.isActive
                                        ? "Available"
                                        : "Inactive"}
                                </span>

                            </div>
                            <div className="resource-details">
                                <p>
                                    <strong>Resource Type:</strong>
                                    {" "}
                                    {resource.type || "N/A"}
                                </p>
                                <p>
                                    <strong>Location:</strong>
                                    {" "}
                                    {resource.location || "N/A"}
                                </p>
                                <p>
                                    <strong>Capacity:</strong>
                                    {" "}
                                    {resource.capacity ?? "N/A"}
                                </p>
                            </div>
                            {resource.isActive && (
                                <Link
                                    to="/booking"
                                    state={{
                                        resourceId: resource._id
                                    }}
                                    className="resource-book"
                                >
                                    Book Now
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Resource;
