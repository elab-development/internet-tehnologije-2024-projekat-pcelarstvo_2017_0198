import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 
import './Login.css';
import InputField from './InputField';
import Button from './Button';
import pcelicaVideo from './pcelice.mp4';
import { AuthContext } from '../AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('markobogdanovic0409@gmail.com');
  const [password, setPassword] = useState('markobogdanovic0409');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });
      const { token } = response.data;
      login(token); // Pozivamo funkciju iz AuthContext-a
      navigate('/proizvodnja');
    } catch (err) {
      console.error('Greška prilikom logina:', err);
      alert('Neuspešna prijava. Proverite kredencijale.');
    }
  };

  return (
    <div className="login-container">
      <video className="login-video" src={pcelicaVideo} autoPlay loop muted playsInline />
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
            <Button label="Prijavi se" type="submit" className="login-button" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
