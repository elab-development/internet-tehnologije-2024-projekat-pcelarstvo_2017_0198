import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🐝 Moje košnice</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Početna</Link>
        </li>
        <li>
          <Link to="/proizvodnja">Proizvodnja</Link>
        </li>
        <li>
          <Link to="/login">Prijava</Link>
        </li>
        <li>
          <Link to="/register">Registracija</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="navbar-logout">
            Odjava
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
