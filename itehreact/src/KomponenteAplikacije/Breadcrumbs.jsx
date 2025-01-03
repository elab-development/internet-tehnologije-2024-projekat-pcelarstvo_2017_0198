import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css'; // (opciono) vaš CSS za stil breadcrumbs

// (Opciono) Ako želite lepše naslove u breadcrumbs,
// možete koristiti mapu segment -> lepši naslov:
const segmentTitleMap = {
  '': 'Početna',        // za segment "" (root)
  'login': 'Prijava',
  'register': 'Registracija',
  'proizvodnja': 'Moje košnice',
  'kosnice': 'Košnice',
  'mapa': 'Mapa',
  'aktivnosti': 'Aktivnosti',
  'komentari': 'Komentari',
};

const Breadcrumbs = () => {
  const location = useLocation();
  // location.pathname -> npr. '/', '/login', '/kosnice/123/aktivnosti', ...
  
  // Razbijamo path na segmente i filtriramo prazne stringove
  // npr. '/kosnice/123/aktivnosti' -> ['', 'kosnice', '123', 'aktivnosti']
  // posle .filter(x => x) -> ['kosnice', '123', 'aktivnosti']
  const pathSegments = location.pathname.split('/').filter((segment) => segment);

  // Formiraćemo cumulative route za svaki segment,
  // da bismo napravili <Link> do svake “međustanice” u breadcrumbs
  // npr. segment[0] = 'kosnice' -> to: '/kosnice'
  //      segment[1] = '123'     -> to: '/kosnice/123'
  //      segment[2] = 'aktivnosti' -> to: '/kosnice/123/aktivnosti'
  
  // Uvek možemo ručno obraditi :id ako želimo (npr. prikazati "Kosnica #123"),
  // ali ovde ćemo ga ostaviti kako jeste.
  
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
          const url = '/' + pathSegments.slice(0, index + 1).join('/');

          // Da li je poslednji segment u nizu?
          const isLastSegment = index === pathSegments.length - 1;

          // Ako imamo definisano ime segmenta u mapi, iskoristimo ga, u suprotnom prikazujemo sam segment
          const segmentName = segmentTitleMap[segment] || segment;

          return (
            <li key={url} className="breadcrumb-item">
              {isLastSegment ? (
                // Poslednji segment nije link, već samo tekst
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
