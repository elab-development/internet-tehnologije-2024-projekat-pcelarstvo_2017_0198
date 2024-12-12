import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import POCETNA from './KomponenteAplikacije/PocetnaStranica/POCETNA';
 

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<POCETNA />} />
         
        </Routes>
      </Router>
    </div>
  );
}

export default App;
