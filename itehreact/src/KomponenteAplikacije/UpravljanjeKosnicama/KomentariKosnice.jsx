import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useKomentari from './useKomentari';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF
import './MojeKosnice.css';
import imageLogo from './a.png'; // Slika logotipa
const KomentariKosnice = () => {
  const { id } = useParams(); // Dohvata ID košnice iz URL-a
  const { komentari, loading, error } = useKomentari(id);

  const [newKomentar, setNewKomentar] = useState({
    sadrzaj: '',
    datum: new Date().toISOString().split('T')[0], // Današnji datum
    kosnica_id: id, // ID trenutne košnice
  });

  const [createError, setCreateError] = useState(null);

  // Ažuriranje stanja prilikom unosa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKomentar({ ...newKomentar, [name]: value });
  };

  // Funkcija za dodavanje komentara
  const handleCreateKomentar = async (e) => {
    e.preventDefault();
    setCreateError(null);

    try {
      const token = sessionStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:8000/api/komentari',
        newKomentar,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload(); // Osvježavanje stranice za prikaz novog komentara
    } catch (err) {
      setCreateError(
        err.response?.data?.errors || 'Greška prilikom dodavanja komentara.'
      );
    }
  };


  const handleExportPDF = () => {
    const sortedKomentari = [...komentari].sort(
      (a, b) => new Date(a.datum) - new Date(b.datum)
    );
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Dodavanje slike logotipa
    doc.addImage(imageLogo, 'PNG', 10, 10, 30, 30);
  
    // Naslov
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#4e342e');
    doc.text(`Komentari za košnicu ${id}`, 50, 20);
  
    // Dekorativna linija ispod naslova
    doc.setDrawColor('#ffa726');
    doc.line(10, 35, pageWidth - 10, 35);
  
    // Lista komentara
    let yOffset = 45;
    doc.setFontSize(12);
    doc.setTextColor('#5d4037');
  
    sortedKomentari.forEach((komentar, index) => {
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20; // Resetovanje za novu stranicu
      }
  
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${index + 1}. Sadržaj: ${komentar.sadrzaj}`,
        10,
        yOffset
      );
      doc.text(`Datum: ${komentar.datum}`, 10, yOffset + 6);
      doc.text(
        `Korisnik: ${komentar.user?.name || 'Nepoznato'} (${komentar.user?.email || 'Nepoznato'})`,
        10,
        yOffset + 12
      );
  
      yOffset += 20; // Razmak između komentara
    });
  
    // Čuvanje fajla
    doc.save(`komentari_kosnice_${id}.pdf`);
  };
  
  

  return (
    <div className="moje-kosnice-container">
      <h1 className="section-title">Komentari za košnicu {id}</h1>

      {/* Forma za unos novog komentara */}
      <div className="steps-section">
        <h2 className="section-title">Dodaj komentar</h2>
        <form onSubmit={handleCreateKomentar} className="create-form">
          <div>
            <label>Sadržaj:</label>
            <input
              type="text"
              name="sadrzaj"
              value={newKomentar.sadrzaj}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Datum:</label>
            <input
              type="date"
              name="datum"
              value={newKomentar.datum}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="start-button">
            Dodaj komentar
          </button>
          {createError && (
            <p className="error-message">{JSON.stringify(createError)}</p>
          )}
        </form>
      </div>

      {/* Prikaz komentara */}
      <div className="steps-section">
        <button onClick={handleExportPDF} className="start-button">
          Exportuj komentare u PDF
        </button>
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
                <th>Ime korisnika</th>
                <th>Email korisnika</th>
                </tr>
            </thead>
            <tbody>
                {komentari.map((komentar) => (
                <tr key={komentar.id}>
                    <td>{komentar.id}</td>
                    <td>{komentar.sadrzaj}</td>
                    <td>{komentar.datum}</td>
                    <td>{komentar.user?.name || 'Nepoznato'}</td>
                    <td>{komentar.user?.email || 'Nepoznato'}</td>
                </tr>
                ))}
            </tbody>
            </table>

        ) : (
          <p>Nema komentara za ovu košnicu.</p>
        )}
      </div>
    </div>
  );
};

export default KomentariKosnice;
