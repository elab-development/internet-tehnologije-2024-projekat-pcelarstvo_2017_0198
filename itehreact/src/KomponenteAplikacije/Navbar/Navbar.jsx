import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Navbar.css';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext); //proverava da li je korisnik ulogovan da bi mogao da se izloguje 
  const navigate = useNavigate(); 

  // Ucitava ulogu iz sessionStorage da bi znao sta da prikazuje 1 za admina, 2 za pčelara
  const uloga = Number(sessionStorage.getItem("uloga")); 
  
  //uzima token pa zove backend za tu rutu i ako uspe brise ga i vraca korisnika na login stranicu 
  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logout(); 
      navigate('/login');
    } catch (error) {
      console.error('Greška prilikom odjave:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🐝 Pčelarstvo</Link>
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
                <li>
                  <Link to="/adminDashboard/izvestaji">Izveštaji</Link>
                </li>
              </>
            )}

            {uloga === 2 && (
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
