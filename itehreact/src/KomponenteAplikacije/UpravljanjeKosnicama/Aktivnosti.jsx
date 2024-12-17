import React from 'react';
import { useParams } from 'react-router-dom';
import useAktivnosti from './useAktivnosti';

const Aktivnosti = () => {
  const { id: kosnicaId } = useParams(); // Čitamo kosnicaId iz URL-a
  const { aktivnosti, loading, error } = useAktivnosti(kosnicaId); // Prosleđujemo kosnicaId u kuku

  return (
    <div className="aktivnosti-container">
      <h2>Aktivnosti košnice</h2>

      {loading ? (
        <p>Učitavanje aktivnosti...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : aktivnosti.length > 0 ? (
        <ul>
          {aktivnosti.map((aktivnost) => (
            <li key={aktivnost.id}>
              <h3>{aktivnost.naziv}</h3>
              <p>Datum: {aktivnost.datum}</p>
              <p>Tip: {aktivnost.tip}</p>
              <p>Opis: {aktivnost.opis || 'N/A'}</p>
              <h4>Komentari:</h4>
              {aktivnost.komentari.length > 0 ? (
                <ul>
                  {aktivnost.komentari.map((komentar) => (
                    <li key={komentar.id}>{komentar.tekst}</li>
                  ))}
                </ul>
              ) : (
                <p>Nema komentara za ovu aktivnost.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nema dostupnih aktivnosti za ovu košnicu.</p>
      )}
    </div>
  );
};

export default Aktivnosti;
