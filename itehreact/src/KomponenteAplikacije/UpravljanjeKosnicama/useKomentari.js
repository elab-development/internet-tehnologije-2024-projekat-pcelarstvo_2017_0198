import { useState, useEffect } from 'react';
import axios from 'axios';

const useKomentari = (kosnicaId) => {
  const [komentari, setKomentari] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKomentari = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(
          `http://127.0.0.1:8000/api/komentari?kosnica_id=${kosnicaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setKomentari(response.data.data);
      } catch (err) {
        setError('Greška prilikom učitavanja komentara.');
      } finally {
        setLoading(false);
      }
    };

    if (kosnicaId) fetchKomentari();
  }, [kosnicaId]);

  return { komentari, loading, error };
};

export default useKomentari;
