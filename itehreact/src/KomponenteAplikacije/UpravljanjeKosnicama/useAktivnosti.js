import { useState, useEffect } from 'react';
import axios from 'axios';

//custom hook sto prima kosnicaId da bi povukao aktivnosti bas za tu kosnicu
const useAktivnosti = (kosnicaId) => {
  const [aktivnosti, setAktivnosti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//pali se svaki put kada se kosnicaId promeni a ako nema tog id ne salje zahtev, pali loading i brise staru gresku 
  useEffect(() => {
    const fetchAktivnosti = async () => {
      if (!kosnicaId) return; 
      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem('token'); // dobija token iz sessionStoragea
        const response = await axios.get('http://127.0.0.1:8000/api/aktivnosti', {
          params: { kosnica_id: kosnicaId }, // salje kosnica id kao parametar
          headers: {
            Authorization: `Bearer ${token}`, // daje token u auth header 
          },
        });

        setAktivnosti(response.data.data); // ako vrati listu akt pise ih u state
      } catch (err) {
        setError(err.response?.data?.errors || 'Greška prilikom učitavanja aktivnosti.');
      } finally {
        setLoading(false);
      }
    };

    fetchAktivnosti();
  }, [kosnicaId]);
//ponavlja svaki put kad se kosnicaId promeni i vraca ovo iz return
  return { aktivnosti, loading, error };
};

export default useAktivnosti;
