import { useState, useEffect } from 'react';
import axios from 'axios';
//useKosnice je custom hook koji radi fetch liste košnica sa backenda, čuva ih u state, prati paginaciju, filter, loading i error
//pravi custom hook sa tri parametra pocetna strana, broj stavki po strani i filter
const useKosnice = (initialPage = 1, initialPerPage = 10, filter = null) => {
  const [kosnice, setKosnice] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  //kad krene fetch pali loading 
  const fetchKosnice = async () => {
    setLoading(true);
    setError(null);
  //uzima token iz sessionStorage jer mora autorizacija
    try {
      const token = sessionStorage.getItem('token');

  // Parametri za pretragu i paginaciju
      const params = {
        page,
        per_page: perPage,
        ...(filter && { search: filter }),
      };
  
  // salje get zahtev na backend sa bearer tokenom i daje parametre za paginaciju i filter
      const response = await axios.get('http://127.0.0.1:8000/api/kosnice', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

  // cuva u state listu kosnica i broj strana i ako nesto pukne upisuje gresku
      setKosnice(response.data.data.data);
      setTotalPages(response.data.data.last_page);
    } catch (err) {
      setError(err.response ? err.response.data : 'Greška prilikom učitavanja.');
    } finally {
      setLoading(false);
    }
  };

//kad se promene page perPage i filter ponovo zove fetchKosnice
  useEffect(() => {
    fetchKosnice();
  }, [page, perPage, filter]);

//vraca sve state vrednosti i fje za update da bi sve bilo pod kontrolerom
  return {
    kosnice,
    setKosnice, 
    page,
    setPage,
    perPage,
    setPerPage,
    loading,
    error,
    totalPages,
  };
};

export default useKosnice;
