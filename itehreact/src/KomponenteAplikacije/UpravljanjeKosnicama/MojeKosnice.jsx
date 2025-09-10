import React, { useState } from 'react';
import useKosnice from './useKosnice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MojeKosnice.css';


const MojeKosnice = () => {
  const [filter, setFilter] = useState(null); //drzi trenutni tekst za pretragu
  const [newKosnica, setNewKosnica] = useState({ //objekat gde drzi vrednost iz forme za kreiranje kosnice 
    naziv: '',
    adresa: '',
    opis: '',
    longitude: '',
    latitude: '',
  });
  const [createError, setCreateError] = useState(null);
  const navigate = useNavigate();

  // uzima i setKosnice iz custom hooka useKosnice, ovde baca listu kosnice i drugo 
  const {
    kosnice,
    page,
    setPage,
    perPage,
    setPerPage,
    loading,
    error,
    totalPages,
    setKosnice,
  } = useKosnice(1, 10, filter);

//menja filter na osnovu unosa u polje i vraca na 1 kad se promeni
  const handleFilterChange = (e) => {
    setFilter(e.target.value || null);
    setPage(1);
  };

//ovo e se poziva kad god nesto unese u inputPolje , destruktuira ga na naziv i na value 
//Ako je name="naziv", menja newKosnica.naziv.
//Ako je name="adresa", menja newKosnica.adresa.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKosnica({ ...newKosnica, [name]: value });
  };
//sprecava browser da reloaduje stranicu kada se submituje forma i brise stare greske iz state
  const handleCreateKosnica = async (e) => {
    e.preventDefault();
    setCreateError(null);

//cita token da li je tu jer je zasticena pa salje post zahtev na api/kosnice
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

      // dodaje novu kosnicu u lokalni state da bi se odmah prikazala 
      setKosnice((prevKosnice) => [response.data.data, ...prevKosnice]);

      // kad se uspesno napravi vraca polja na prazno da bi moglo opet odmah nova ako korisnik hoce 
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

//prvo potvrdjuje da li zaista obrise kosnicu 
  const handleDeleteKosnica = async (id) => {
    const confirmDelete = window.confirm(
      'Da li ste sigurni da želite da obrišete ovu košnicu?'
    );
    if (!confirmDelete) return;

//salje delete zahtev sa bearer tokenom 
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/kosnice/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

// ovo je da se odmah vidi da je nestala kosnica iz tabele tj liste 
      setKosnice((prevKosnice) =>
        prevKosnice.filter((kosnica) => kosnica.id !== id)
      );
    } catch (err) {
      alert('Došlo je do greške prilikom brisanja košnice.');
    }
  };

//da udje na stranicu aktivnosti za tu kosnicu
  const handleDetaljiClick = (id) => {
    navigate(`/kosnice/${id}/aktivnosti`);
  };

//da udje na komentare za tu kosnicu
  const handleKomentariClick = (id) => {
    navigate(`/kosnice/${id}/komentari`);
  };

  return (
    <div className="moje-kosnice-container">
      <h1 className="section-title">Moje košnice</h1>

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

      {/* Filter pretraga */}
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
        ) : kosnice && kosnice.length > 0 ? (
          <table className="kosnice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Naziv</th>
                <th>Adresa</th>
                <th>Opis</th>
                <th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {kosnice.map((kosnica) => (
                <tr key={kosnica.id}>
                  <td>{kosnica.id}</td>
                  <td>{kosnica.naziv}</td>
                  <td>{kosnica.adresa}</td>
                  <td>{kosnica.opis || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleDetaljiClick(kosnica.id)}
                      className="start-button"
                    >
                      Aktivnosti
                    </button>
                    <button
                      onClick={() => handleKomentariClick(kosnica.id)}
                      className="start-button"
                    >
                      Komentari
                    </button>
                    <button
                      onClick={() => handleDeleteKosnica(kosnica.id)}
                      className="start-button"
                    >
                      Obriši
                    </button>
                  </td>
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
