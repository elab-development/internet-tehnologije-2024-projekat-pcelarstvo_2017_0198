import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminZakaziAktivnosti.css';
const AdminZakaziAktivnost = () => {
  const [kosnice, setKosnice] = useState([]);
  const [korisnici, setKorisnici] = useState([]);
  const [forma, setForma] = useState({
    naziv: '',
    datum: '',
    tip: 'sezonska',
    opis: '',
    kosnica_id: '',
    user_id: '',
  });
const token = sessionStorage.getItem('token');

// Kad se komponenta učita, šalje dva GET zahteva:
// 1. /api/admin/kosnice → vraća listu svih košnica (admin vidi sve).
// 2. /api/roles/2/users → vraća listu svih korisnika sa rolom pčelar (role_id = 2).
// Rezultati se stavljaju u state (kosnice, korisnici).
// console.log samo da proveri šta stiže.

  useEffect(() => {
    const fetchPodaci = async () => {
      const resKosnice = await axios.get('http://127.0.0.1:8000/api/admin/kosnice', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKosnice(resKosnice.data);
      console.log(resKosnice.data)
      const resKorisnici = await axios.get('http://127.0.0.1:8000/api/roles/2/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKorisnici(resKorisnici.data.data);
      console.log(resKorisnici.data.data);
    };
    fetchPodaci();
  }, []);

  const handleChange = (e) => {
    setForma({ ...forma, [e.target.name]: e.target.value });
  };

// Ova komponenta služi administratoru da:
// Učita sve košnice i sve pčelare.
// Ispuni formu (naziv, datum, tip, opis, odabir košnice i korisnika).
// Pošalje POST zahtev → backend kreira aktivnost i šalje notifikaciju pčelaru.

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/admin/aktivnosti', forma, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Uspešno zakazana aktivnost i poslata notifikacija.');
    } catch (err) {
      alert('Greška: ' + JSON.stringify(err.response?.data?.errors));
    }
  };

  return (
   <div className="admin-form-container">
      <h2>Zakazivanje aktivnosti (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <input name="naziv" placeholder="Naziv" value={forma.naziv} onChange={handleChange} required />
        <input type="date" name="datum" value={forma.datum} onChange={handleChange} required />
        <select name="tip" value={forma.tip} onChange={handleChange}>
          <option value="sezonska">Sezonska</option>
          <option value="prilagodjena">Prilagođena</option>
        </select>
        <input name="opis" placeholder="Opis" value={forma.opis} onChange={handleChange} />
        <select name="kosnica_id" value={forma.kosnica_id} onChange={handleChange} required>
          <option value="">Izaberi košnicu</option>
          {kosnice.map(k => (
            <option key={k.id} value={k.id}>{k.naziv}</option>
          ))}
        </select>
        <select name="user_id" value={forma.user_id} onChange={handleChange} required>
          <option value="">Izaberi pčelara</option>
          {korisnici.map(k => (
            <option key={k.id} value={k.id}>{k.name} </option>
          ))}
        </select>
        <button type="submit" className="start-button">Zakazi</button>
      </form>
    </div>
  );
};

export default AdminZakaziAktivnost;
