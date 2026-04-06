import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Css/navbar.css";
import logo from "../assets/movie-munchers-final.svg";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Movie Munchers" className="logo-img" />
      </div>

      {/* Desktop nav */}
      <div className="navbar-right">
        <Link to="/dashboard" className="nav-btn">Dashboard</Link>
        <Link to="/favorites" className="nav-btn">My Favorites</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <button
        className="hamburger"
        onClick={() => setOpen(prev => !prev)}
      >
        ☰
      </button>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="mobile-menu">
          <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/favorites" onClick={() => setOpen(false)}>My Favorites</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
