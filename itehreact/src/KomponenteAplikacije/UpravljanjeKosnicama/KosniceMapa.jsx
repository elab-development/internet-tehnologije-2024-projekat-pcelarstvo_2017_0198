import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import useKosnice from './useKosnice';
import L from 'leaflet';
import './MojeKosnice.css';

// Fix za Leaflet marker ikonice
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Ikonica pinova
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Primer ikone pčele
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const KosniceMapa = () => {
  const { kosnice, loading, error } = useKosnice(1, 100); // Učitavamo sve košnice

  return (
    <div className="moje-kosnice-container">
      <h1 className="section-title">Prikaz košnica na mapi</h1>

      {loading ? (
        <p>Učitavanje...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : kosnice.length > 0 ? (
        <MapContainer
          center={[44.8176, 20.4633]} // Centar mape (Beograd kao primer)
          zoom={7}
          style={{ height: '500px', width: '100%', borderRadius: '10px' }}
        >
          {/* Dodavanje TileLayer-a */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Prikaz pinova za košnice */}
          {kosnice.map((kosnica) => (
            <Marker
              key={kosnica.id}
              position={[kosnica.latitude, kosnica.longitude]}
              icon={customIcon}
            >
              <Popup>
                <strong>{kosnica.naziv}</strong>
                <br />
                Adresa: {kosnica.adresa}
                <br />
                Opis: {kosnica.opis || 'Nema opisa'}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Nema dostupnih košnica za prikazivanje.</p>
      )}
    </div>
  );
};

export default KosniceMapa;
