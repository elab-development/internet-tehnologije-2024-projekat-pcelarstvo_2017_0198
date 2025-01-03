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

  // --- Uzimamo userId iz sessionStorage (pretpostavka) ---
  const loggedInUserId = parseInt(sessionStorage.getItem('userId'), 10);

  // Forma za kreiranje novog komentara
  const [newKomentar, setNewKomentar] = useState({
    sadrzaj: '',
    datum: new Date().toISOString().split('T')[0], // Današnji datum
    kosnica_id: id, // ID trenutne košnice
  });
  const [createError, setCreateError] = useState(null);

  // --- Novo: stanja za uređivanje komentara ---
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState({
    sadrzaj: '',
    datum: '',
    kosnica_id: id,
  });

  // Ažuriranje stanja prilikom unosa za novi komentar (kreiranje)
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
      window.location.reload();
    } catch (err) {
      setCreateError(
        err.response?.data?.errors || 'Greška prilikom dodavanja komentara.'
      );
    }
  };

  // Funkcija za pokretanje "Uredi" režima
  const handleEditClick = (komentar) => {
    setEditingCommentId(komentar.id);
    setEditedComment({
      sadrzaj: komentar.sadrzaj,
      datum: komentar.datum,
      kosnica_id: komentar.kosnica_id,
    });
  };

  // Ažuriranje editedComment polja kad korisnik kuca
  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedComment({ ...editedComment, [name]: value });
  };

  // Funkcija za ažuriranje komentara na serveru
  const handleSaveComment = async (komentarId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:8000/api/komentari/${komentarId}`,
        editedComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (err) {
      alert('Greška prilikom ažuriranja komentara.');
      console.error(err);
    }
  };

  // Funkcija za brisanje komentara
  const handleDeleteComment = async (komentarId) => {
    const confirmDelete = window.confirm(
      'Da li ste sigurni da želite da obrišete ovaj komentar?'
    );
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/komentari/${komentarId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (err) {
      alert('Greška prilikom brisanja komentara.');
      console.error(err);
    }
  };

  // Funkcija za generisanje PDF-a
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
        yOffset = 20;
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

      yOffset += 20;
    });

    doc.save(`komentari_kosnice_${id}.pdf`);
  };

  return (
    <div className="moje-kosnice-container">
      <h1 className="section-title">Komentari za košnicu {id}</h1>

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
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {komentari.map((komentar) => {
                const isOwner = komentar.user?.id === loggedInUserId;
                const isEditing = editingCommentId === komentar.id;

                return (
                  <tr key={komentar.id}>
                    <td>{komentar.id}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          name="sadrzaj"
                          value={editedComment.sadrzaj}
                          onChange={handleEditFieldChange}
                        />
                      ) : (
                        komentar.sadrzaj
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="date"
                          name="datum"
                          value={editedComment.datum}
                          onChange={handleEditFieldChange}
                        />
                      ) : (
                        komentar.datum
                      )}
                    </td>
                    <td>{komentar.user?.name || 'Nepoznato'}</td>
                    <td>{komentar.user?.email || 'Nepoznato'}</td>
                    <td>
                      {isOwner && !isEditing && (
                        <button
                          onClick={() => handleEditClick(komentar)}
                          className="start-button"
                        >
                          Uredi
                        </button>
                      )}
                      {isOwner && isEditing && (
                        <button
                          onClick={() => handleSaveComment(komentar.id)}
                          className="start-button"
                        >
                          Sačuvaj
                        </button>
                      )}
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteComment(komentar.id)}
                          className="start-button delete-button"
                        >
                          Obriši
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
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
