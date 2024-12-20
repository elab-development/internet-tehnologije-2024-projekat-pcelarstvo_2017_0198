import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import './App.css';
import POCETNA from './KomponenteAplikacije/PocetnaStranica/POCETNA';
import Login from './KomponenteAplikacije/LoginRegistracija/Login';
import Register from './KomponenteAplikacije/LoginRegistracija/Register';
import MojeKosnice from './KomponenteAplikacije/UpravljanjeKosnicama/MojeKosnice';
import Navbar from './KomponenteAplikacije/Navbar/Navbar';
import Aktivnosti from './KomponenteAplikacije/UpravljanjeKosnicama/Aktivnosti';
import KomentariKosnice from './KomponenteAplikacije/UpravljanjeKosnicama/KomentariKosnice';
import KosniceMapa from './KomponenteAplikacije/UpravljanjeKosnicama/KosniceMapa';
import { AuthProvider } from './KomponenteAplikacije/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<POCETNA />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/proizvodnja" element={<MojeKosnice />} />
            <Route path="/kosnice/:id/aktivnosti" element={<Aktivnosti />} />
            <Route path="/kosnice/:id/komentari" element={<KomentariKosnice />} />
            <Route path="/kosnice/mapa" element={<KosniceMapa />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
