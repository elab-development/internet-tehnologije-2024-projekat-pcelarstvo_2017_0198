import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import InputField from './InputField';
import Button from './Button';
import pcelicaVideo from './pcelice.mp4';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValidation({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      number: /\d/.test(value),
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const isPasswordValid =
      passwordValidation.length &&
      passwordValidation.uppercase &&
      passwordValidation.specialChar &&
      passwordValidation.number;

    if (!isPasswordValid) {
      alert('Lozinka nije validna. Proverite uslove za lozinku.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role_id: 1,
      });
      const { token } = response.data;
      sessionStorage.setItem('token', token);
      navigate('/login');
    } catch (err) {
      console.error('Greška prilikom registracije:', err);
      alert('Neuspešna registracija. Proverite podatke i pokušajte ponovo.');
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
          <h1 className="login-title">Registracija</h1>
          <p className="login-subtitle">Kreirajte nalog kako biste pristupili proizvodnji.</p>
          <form className="login-form" onSubmit={handleRegister}>
            <InputField
              label="Ime"
              type="text"
              id="name"
              placeholder="Vaše ime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              onChange={handlePasswordChange}
              required
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
              isTextVisible={showPassword}
            />
            <ul className="password-requirements">
              <li className={passwordValidation.length ? 'valid' : 'invalid'}>Minimum 8 karaktera</li>
              <li className={passwordValidation.uppercase ? 'valid' : 'invalid'}>Jedno veliko slovo</li>
              <li className={passwordValidation.specialChar ? 'valid' : 'invalid'}>Jedan specijalan znak</li>
              <li className={passwordValidation.number ? 'valid' : 'invalid'}>Jedan broj</li>
            </ul>
            <InputField
              label="Potvrda šifre"
              type="password"
              id="password_confirmation"
              placeholder="Potvrdite šifru"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              showToggle
              onToggle={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              isTextVisible={showPasswordConfirmation}
            />
            <Button label="Registruj se" type="submit" className="login-button" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
