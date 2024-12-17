import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import POCETNA from './KomponenteAplikacije/PocetnaStranica/POCETNA';
import Login from './KomponenteAplikacije/LoginRegistracija/Login';
import Register from './KomponenteAplikacije/LoginRegistracija/Register';
import MojeKosnice from './KomponenteAplikacije/UpravljanjeKosnicama/MojeKosnice';
import Navbar from './KomponenteAplikacije/Navbar/Navbar';
import Aktivnosti from './KomponenteAplikacije/UpravljanjeKosnicama/Aktivnosti';
 

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<POCETNA />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/proizvodnja" element={<MojeKosnice />} />
          <Route path="/kosnice/:id/aktivnosti" element={<Aktivnosti />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
