import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css'; // Make sure the CSS is imported

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Custom Form Builder
        </Link>
        
        <div className="navbar-nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/builder" className="nav-link">New Form</Link>
              <div className="nav-link user-info">
                <FiUser />
                {user.email}
              </div>
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;