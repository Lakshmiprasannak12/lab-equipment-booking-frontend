import { Link } from "react-router-dom";
function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      <h3>Welcome, {user?.name}</h3>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Resources</h2>
          <p>View available labs and equipment.</p>
          <Link to="/resources">View Resources</Link>
        </div>

        <div className="dashboard-card">
          <h2>My Bookings</h2>
          <p>View and cancel your bookings.</p>
          <Link to="/my-bookings">My Bookings</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
