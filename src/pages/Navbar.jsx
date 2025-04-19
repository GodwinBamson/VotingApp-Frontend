

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ role, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // State to manage spinner visibility
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Close menu automatically when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Function to simulate a loading state (for demonstration purposes)
  const handleMenuToggle = () => {
    setIsLoading(true);
    toggleMenu();
    setTimeout(() => setIsLoading(false), 1000);  // Simulate 1 second delay
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Product Store</Link>
      </div>

      <div
        className="navbar-toggle"
        onClick={handleMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <div className={`hamburger-icon ${isMenuOpen ? "open" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        {isLoading && <div className="spinner show"></div>}
      </div>

      <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
        {role === "admin" && (
          <>
            <Link to="/addproduct" className="navbar-link">Add Product</Link>
            <Link to="/inventory" className="navbar-link">Inventory</Link>
            <Link to="/admin-register" className="navbar-link">Add Staff</Link>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/reportpage" className="navbar-link">Report Page</Link>
            <Link to="/daily-report" className="navbar-link">Daily Report</Link> {/* Added Daily Report */}
          </>
        )}

        {role === "staff" && (
          <Link to="/inventory" className="navbar-link">Inventory</Link>
        )}

        {role === "superadmin" && (
          <>
            <Link to="/add-admin" className="navbar-link">Add Admin</Link>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/daily-report" className="navbar-link">Daily Report</Link> {/* Added Daily Report */}
          </>
        )}

        {role ? (
          <button
            onClick={onLogout}
            className="navbar-link logout-button"
            aria-label="Logout"
          >
            Logout
          </button>
        ) : (
          <Link to="/" className="navbar-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
