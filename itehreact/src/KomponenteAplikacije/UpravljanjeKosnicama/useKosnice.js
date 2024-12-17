import { useState, useEffect } from 'react';
import axios from 'axios';

const useKosnice = (initialPage = 1, initialPerPage = 10, filter = null) => {
  const [kosnice, setKosnice] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchKosnice = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: perPage,
        ...(filter && { search: filter }), // Koristimo search umesto kosnica_id
      };
  
      const token = sessionStorage.getItem('token');
  
      const response = await axios.get('http://127.0.0.1:8000/api/kosnice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      setKosnice(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (err) {
      setError(err.response ? err.response.data : 'Greška prilikom učitavanja.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchKosnice();
  }, [page, perPage, filter]);

  return { kosnice, page, setPage, perPage, setPerPage, loading, error, totalPages };
};

export default useKosnice;
