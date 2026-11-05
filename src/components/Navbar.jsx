
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <h2>Lab Booking System</h2>

      <div className="nav-links">
        {user && user.role === "student" && (
          <>
            <Link to="/student">Dashboard</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </>
        )}

        {user && user.role === "admin" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
