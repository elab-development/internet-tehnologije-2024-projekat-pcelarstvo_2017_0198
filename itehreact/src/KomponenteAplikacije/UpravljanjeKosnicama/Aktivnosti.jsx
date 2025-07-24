import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAktivnosti from './useAktivnosti';
import axios from 'axios';
import './Aktivnosti.css';

const Aktivnosti = () => {
  const { id: kosnicaId } = useParams();
  const { aktivnosti, loading, error } = useAktivnosti(kosnicaId);
  const [novaAktivnost, setNovaAktivnost] = useState({
    naziv: '',
    datum: '',
    tip: 'sezonska',
    opis: '',
  });
  const [createError, setCreateError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaAktivnost({ ...novaAktivnost, [name]: value });
  };

  const handleCreateAktivnost = async (e) => {
    e.preventDefault();
    setCreateError(null);
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:8000/api/aktivnosti',
        { ...novaAktivnost, kosnica_id: kosnicaId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNovaAktivnost({
        naziv: '',
        datum: '',
        tip: 'sezonska',
        opis: '',
      });
      window.location.reload();
    } catch (err) {
      setCreateError(
        err.response?.data?.errors || 'Greška prilikom dodavanja aktivnosti.'
      );
    }
  };

  // Sortiranje aktivnosti po datumu (hronološki)
  const sortiraneAktivnosti = [...aktivnosti].sort(
    (a, b) => new Date(a.datum) - new Date(b.datum)
  );

  return (
    <div className="moje-kosnice-container">
      <h1 className="section-title">Aktivnosti košnice</h1>

      {/* Forma za dodavanje nove aktivnosti */}
      <div className="steps-section">
        <h2 className="section-title">Dodaj novu aktivnost</h2>
        <form onSubmit={handleCreateAktivnost} className="create-form">
          <div>
            <label>Naziv:</label>
            <input
              type="text"
              name="naziv"
              value={novaAktivnost.naziv}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Datum:</label>
            <input
              type="date"
              name="datum"
              value={novaAktivnost.datum}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Tip aktivnosti:</label>
            <select
              name="tip"
              value={novaAktivnost.tip}
              onChange={handleInputChange}
            >
              <option value="sezonska">Sezonska</option>
              <option value="prilagodjena">Prilagođena</option>
            </select>
          </div>
          <div>
            <label>Opis:</label>
            <input
              type="text"
              name="opis"
              value={novaAktivnost.opis}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="start-button">
            Dodaj aktivnost
          </button>
          {createError && (
            <p className="error-message">{JSON.stringify(createError)}</p>
          )}
        </form>
      </div>

      {/* Lista aktivnosti u flow chart formatu */}
      <div className="steps-section">
        {loading ? (
          <p>Učitavanje aktivnosti...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : sortiraneAktivnosti.length > 0 ? (
          <div className="flow-chart">
            {sortiraneAktivnosti.map((aktivnost, index) => (
              <div key={aktivnost.id} className="flow-step">
                <div className="step-content">
                  <h3>{aktivnost.naziv}</h3>
                  <p>Datum: {aktivnost.datum}</p>
                  <p>Tip: {aktivnost.tip}</p>
                  <p>Opis: {aktivnost.opis || 'N/A'}</p>
                </div>
                {index < sortiraneAktivnosti.length - 1 && (
                  <div className="arrow"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Nema dostupnih aktivnosti za ovu košnicu.</p>
        )}
      </div>
    </div>
  );
};

export default Aktivnosti;
