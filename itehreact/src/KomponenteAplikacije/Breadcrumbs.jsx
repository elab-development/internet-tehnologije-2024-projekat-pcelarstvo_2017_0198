import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css'; // (opciono) vaš CSS

// Mapa za lepše prikazivanje naziva pojedinih ruta/segmenata.
const segmentTitleMap = {
  '': 'Početna',        
  'login': 'Prijava',
  'register': 'Registracija',
  'kosnice': 'Moje košnice',
  'mapa': 'Mapa',
  'aktivnosti': 'Aktivnosti',
  'komentari': 'Komentari',
};

const Breadcrumbs = () => {
  const location = useLocation();

  // Razbijamo pathname i uklanjamo prazne segmente
  let pathSegments = location.pathname.split('/').filter(Boolean);

  // Filtriramo sve segmente koji su isključivo brojevi (npr. "6" ili "123")
  pathSegments = pathSegments.filter(segment => !/^\d+$/.test(segment));

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {/* Početna stranica (uvek prvi breadcrumb) */}
        <li className="breadcrumb-item">
          <Link to="/">
            {segmentTitleMap[''] || 'Početna'}
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          // Formiramo putanju do trenutnog segmenta
          const url = '/' + pathSegments.slice(0, index + 1).join('/');

          // Proveravamo da li je poslednji segment (pa nećemo link, samo tekst)
          const isLastSegment = index === pathSegments.length - 1;

          // Ako imamo definisano ime segmenta u mapi, prikazujemo ga
          const segmentName = segmentTitleMap[segment] || segment;

          return (
            <li key={url} className="breadcrumb-item">
              {isLastSegment ? (
                <span>{segmentName}</span>
              ) : (
                <Link to={url}>{segmentName}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
