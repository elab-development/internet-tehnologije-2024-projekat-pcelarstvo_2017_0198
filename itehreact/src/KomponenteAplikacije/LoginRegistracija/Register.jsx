import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
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
  const [showPassword, setShowPassword] = useState(false); // Kontrola vidljivosti lozinke
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // Kontrola vidljivosti potvrde lozinke

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Provera validnosti lozinke
    setPasswordValidation({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      number: /\d/.test(value),
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Finalna validacija
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
      });

      const { token } = response.data;
      sessionStorage.setItem('token', token);
      navigate('/proizvodnja');
    } catch (err) {
      console.error(
        'Greška prilikom registracije:',
        err.response ? err.response.data : err
      );
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
          <p className="login-subtitle">
            Kreirajte nalog kako biste pristupili proizvodnji.
          </p>
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
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Vaša šifra"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Sakrij' : 'Prikaži'}
                </button>
              </div>
              <ul className="password-requirements">
                <li className={passwordValidation.length ? 'valid' : 'invalid'}>
                  Bar 8 karaktera
                </li>
                <li
                  className={passwordValidation.uppercase ? 'valid' : 'invalid'}
                >
                  Bar jedno veliko slovo
                </li>
                <li
                  className={passwordValidation.specialChar ? 'valid' : 'invalid'}
                >
                  Bar jedan specijalan karakter (!@#$...)
                </li>
                <li className={passwordValidation.number ? 'valid' : 'invalid'}>
                  Bar jedan broj
                </li>
              </ul>
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation">Potvrda šifre</label>
              <div className="password-input-container">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  id="password_confirmation"
                  placeholder="Potvrdite šifru"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                >
                  {showPasswordConfirmation ? 'Sakrij' : 'Prikaži'}
                </button>
              </div>
            </div>

            <button className="login-button" type="submit">
              Registruj se
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
