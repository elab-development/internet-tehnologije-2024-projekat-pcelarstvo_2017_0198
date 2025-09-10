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
import Breadcrumbs from './KomponenteAplikacije/Breadcrumbs';
import AdminDashboard from './KomponenteAplikacije/Admin/AdminDashboard';
import AdminZakaziAktivnost from './KomponenteAplikacije/Admin/AdminZakaziAktivnost';
import AdminKosniceReport from './KomponenteAplikacije/Admin/AdminKosniceReport';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Navbar />
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<POCETNA />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/kosnice" element={<MojeKosnice />} />
            <Route path="/kosnice/:id/aktivnosti" element={<Aktivnosti />} />
            <Route path="/kosnice/:id/komentari" element={<KomentariKosnice />} />
            <Route path="/kosnice/mapa" element={<KosniceMapa />} />


            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/adminDashboard/aktivnosti" element={<AdminZakaziAktivnost />} />
            <Route path="/adminDashboard/izvestaji" element={<AdminKosniceReport />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
