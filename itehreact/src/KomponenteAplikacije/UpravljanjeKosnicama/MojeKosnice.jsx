import React, { useState } from 'react';
import useKosnice from './useKosnice';
import axios from 'axios';
import './MojeKosnice.css';
const MojeKosnice = () => {
  const [filter, setFilter] = useState(null);
  const [newKosnica, setNewKosnica] = useState({
    naziv: '',
    adresa: '',
    opis: '',
    longitude: '',
    latitude: '',
  });
  const [createError, setCreateError] = useState(null);

  const {
    kosnice,
    page,
    setPage,
    perPage,
    setPerPage,
    loading,
    error,
    totalPages,
  } = useKosnice(1, 10, filter);

  const handleFilterChange = (e) => {
    setFilter(e.target.value || null);
    setPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKosnica({ ...newKosnica, [name]: value });
  };

  const handleCreateKosnica = async (e) => {
    e.preventDefault();
    setCreateError(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/kosnice',
        newKosnica,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      kosnice.unshift(response.data.data); // Dodavanje nove košnice u listu
      setNewKosnica({
        naziv: '',
        adresa: '',
        opis: '',
        longitude: '',
        latitude: '',
      });
    } catch (err) {
      setCreateError(
        err.response?.data?.errors || 'Greška prilikom kreiranja košnice.'
      );
    }
  };

  return (
    <div className="moje-kosnice-container">
      <h1 className="section-title">Moje Košnice</h1>

      {/* Forma za kreiranje nove košnice */}
      <div className="steps-section">
        <h2 className="section-title">Kreiraj novu košnicu</h2>
        <form onSubmit={handleCreateKosnica} className="create-form">
          <div>
            <label>Naziv:</label>
            <input
              type="text"
              name="naziv"
              value={newKosnica.naziv}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Adresa:</label>
            <input
              type="text"
              name="adresa"
              value={newKosnica.adresa}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Opis:</label>
            <input
              type="text"
              name="opis"
              value={newKosnica.opis}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Longitude:</label>
            <input
              type="number"
              step="0.0001"
              name="longitude"
              value={newKosnica.longitude}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Latitude:</label>
            <input
              type="number"
              step="0.0001"
              name="latitude"
              value={newKosnica.latitude}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="start-button">
            Kreiraj košnicu
          </button>
          {createError && (
            <p className="error-message">{JSON.stringify(createError)}</p>
          )}
        </form>
      </div>

      {/* Filter */}
      <div className="filter-container">
        <label htmlFor="kosnica-filter">Pretraži po nazivu ili opisu:</label>
        <input
          type="text"
          id="kosnica-filter"
          placeholder="Unesite naziv ili opis košnice"
          onChange={handleFilterChange}
        />
      </div>

      {/* Lista košnica */}
      <div className="steps-section">
        {loading ? (
          <p>Učitavanje...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : kosnice.length > 0 ? (
          <table className="kosnice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Naziv</th>
                <th>Adresa</th>
                <th>Opis</th>
              </tr>
            </thead>
            <tbody>
              {kosnice.map((kosnica) => (
                <tr key={kosnica.id}>
                  <td>{kosnica.id}</td>
                  <td>{kosnica.naziv}</td>
                  <td>{kosnica.adresa}</td>
                  <td>{kosnica.opis || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nema dostupnih košnica.</p>
        )}
      </div>

      {/* Paginacija */}
      <div className="pagination-container">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="start-button"
        >
          Prethodna
        </button>
        <span>
          Stranica {page} od {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="start-button"
        >
          Sledeća
        </button>
        <label>
          Stavki po stranici:
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default MojeKosnice;
