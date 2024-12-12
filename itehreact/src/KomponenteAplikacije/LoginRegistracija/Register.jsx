import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 
import pcelicaVideo from './pcelice.mp4';  

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('2'); // Primer: role_id = 2
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name, 
        email, 
        role_id: roleId,
        password,
        password_confirmation: passwordConfirmation
      });
      const { token } = response.data;
      sessionStorage.setItem('token', token);
      navigate('/proizvodnja');
    } catch (err) {
      console.error('Greška prilikom registracije:', err.response ? err.response.data : err);
      alert('Neuspešna registracija. Proverite podatke i pokušajte ponovo.');
    }
  };

  return (
    <div className="login-container">
      <video className="login-video" src={pcelicaVideo} autoPlay loop muted playsInline />
      <div className="login-overlay">
        <div className="login-content">
          <h1 className="login-title">Registracija</h1>
          <p className="login-subtitle">Kreirajte nalog kako biste pristupili proizvodnji.</p>
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Ime</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Vaše ime" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email adresa</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Vaš email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            

            <div className="form-group">
              <label htmlFor="password">Šifra</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Vaša šifra" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation">Potvrda šifre</label>
              <input 
                type="password" 
                id="password_confirmation" 
                placeholder="Potvrdite šifru" 
                value={passwordConfirmation} 
                onChange={(e) => setPasswordConfirmation(e.target.value)} 
                required 
              />
            </div>

            <button className="login-button" type="submit">Registruj se</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
