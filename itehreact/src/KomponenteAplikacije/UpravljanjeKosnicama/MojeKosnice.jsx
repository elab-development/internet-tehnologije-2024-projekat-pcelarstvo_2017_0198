import React, { useState } from 'react';
import useKosnice from './useKosnice';

const MojeKosnice = () => {
  const [filter, setFilter] = useState(null);
  const { kosnice, page, setPage, perPage, setPerPage, loading, error, totalPages } = useKosnice(1, 10, filter);

  const handleFilterChange = (e) => {
    setFilter(e.target.value || null);
    setPage(1); // Resetujemo na prvu stranicu kad se filter promeni
  };

  return (
    <div className="moje-kosnice-container">
      <h1>Moje Košnice</h1>

      {/* Filter */}
      <div className="filter-container">
        <label htmlFor="kosnica-filter">Filter po ID košnice:</label>
        <input
          type="text"
          id="kosnica-filter"
          placeholder="Unesite ID košnice"
          onChange={handleFilterChange}
        />
      </div>

      {/* Lista košnica */}
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

      {/* Paginacija */}
      <div className="pagination-container">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prethodna
        </button>
        <span>
          Stranica {page} od {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Sledeća
        </button>
        <label>
          Stavki po stranici:
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
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
