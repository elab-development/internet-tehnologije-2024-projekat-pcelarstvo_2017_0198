import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import InputField from './InputField'; // Import nove komponente
import pcelicaVideo from './pcelice.mp4';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });
      const { token } = response.data;
      sessionStorage.setItem('token', token);
      navigate('/proizvodnja');
    } catch (err) {
      console.error('Greška prilikom logina:', err);
      alert('Neuspešna prijava. Proverite kredencijale.');
    }
  };

  return (
    <div className="login-container">
      <video
        className="login-video"
        src={pcelicaVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="login-overlay">
        <div className="login-content">
          <h1 className="login-title">Dobrodošli!</h1>
          <p className="login-subtitle">Unesite svoje podatke za pristup proizvodnji.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <InputField
              label="Email adresa"
              type="email"
              id="email"
              placeholder="Vaš email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              label="Šifra"
              type="password"
              id="password"
              placeholder="Vaša šifra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
              isTextVisible={showPassword}
            />
            <button className="login-button" type="submit">
              Prijavi se
            </button>
          </form>
          <p className="register-link">
            Nemate nalog?{' '}
            <span onClick={() => navigate('/register')}>Registrujte se</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
