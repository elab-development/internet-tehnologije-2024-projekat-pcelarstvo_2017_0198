import React from 'react';
import { useParams } from 'react-router-dom';
import useKomentari from './useKomentari';
import './MojeKosnice.css';

const KomentariKosnice = () => {
  const { id } = useParams(); // Dohvata ID košnice iz URL-a
  const { komentari, loading, error } = useKomentari(id);

  return (
    <div className="moje-kosnice-container">
      <h1 className="section-title">Komentari za košnicu {id}</h1>

      {loading ? (
        <p>Učitavanje...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : komentari.length > 0 ? (
        <table className="kosnice-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sadržaj</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {komentari.map((komentar) => (
              <tr key={komentar.id}>
                <td>{komentar.id}</td>
                <td>{komentar.sadrzaj}</td>
                <td>{komentar.datum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nema komentara za ovu košnicu.</p>
      )}
    </div>
  );
};

export default KomentariKosnice;
