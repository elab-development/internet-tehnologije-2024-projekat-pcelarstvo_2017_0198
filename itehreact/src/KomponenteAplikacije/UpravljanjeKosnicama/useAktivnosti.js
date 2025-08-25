import { useState, useEffect } from 'react';
import axios from 'axios';

const useAktivnosti = (kosnicaId) => {
  const [aktivnosti, setAktivnosti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAktivnosti = async () => {
      if (!kosnicaId) return; // Ako nema kosnicaId, ne šalji zahtev

      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem('token'); // Dobijamo token iz sessionStorage
        const response = await axios.get('http://127.0.0.1:8000/api/aktivnosti', {
          params: { kosnica_id: kosnicaId }, // Prosleđujemo kosnica_id kao parametar
          headers: {
            Authorization: `Bearer ${token}`, // Dodajemo token u Authorization header
          },
        });

        setAktivnosti(response.data.data); // Postavljamo podatke u state
      } catch (err) {
        setError(err.response?.data?.errors || 'Greška prilikom učitavanja aktivnosti.');
      } finally {
        setLoading(false);
      }
    };

    fetchAktivnosti();
  }, [kosnicaId]);

  return { aktivnosti, loading, error };
};

export default useAktivnosti;
