import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
 
import './Navbar.css';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
 // Učitavamo ulogu iz sessionStorage
  const uloga = Number(sessionStorage.getItem("uloga")); // npr. 1 za admina, 2 za pčelara
  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout(); // Uklanja token i ažurira state
      navigate('/login');
    } catch (error) {
      console.error('Greška prilikom odjave:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🐝 Pcelarstvo</Link>
      </div>
      <ul className="navbar-links">
        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/">Početna</Link>
            </li>
            <li>
              <Link to="/login">Prijava</Link>
            </li>
            <li>
              <Link to="/register">Registracija</Link>
            </li>
          </>
        ) : (
          <>

           {uloga === 1 && (
              <>
                <li>
                  <Link to="/adminDashboard">Admin panel</Link>
                </li>
                <li>
                  <Link to="/adminDashboard/aktivnosti">Zakazivanje aktivnosti</Link>
                </li>
              </>
            )}

             {uloga ===2 && (
              <>
                  <li>
              <Link to="/kosnice">Proizvodnja</Link>
            </li>
            <li>
              <Link to="/kosnice/mapa">Mapa košnica</Link>
            </li>
              </>
            )}
          
            <li>
              <button onClick={handleLogout} className="navbar-logout">
                Odjava
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
