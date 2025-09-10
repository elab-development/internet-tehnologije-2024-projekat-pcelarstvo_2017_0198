import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css'; 

// Da prevede da lepse pise kako se zovu rute 
const segmentTitleMap = {
  '': 'Početna',        
  'login': 'Prijava',
  'register': 'Registracija',
  'kosnice': 'Moje košnice',
  'mapa': 'Mapa',
  'aktivnosti': 'Aktivnosti',
  'komentari': 'Komentari',
};
//hvata ovaj hook gde smo na trenutnoj putanji 
const Breadcrumbs = () => {
  const location = useLocation();

  // razbije pathname na delove po / kosnice/aktivnosti/6 → ["kosnice", "aktivnosti", "6"].
  let pathSegments = location.pathname.split('/').filter(Boolean);

  // izbacuje ono sto su brojevi pa bude ["kosnice", "aktivnosti", "6"] → ostaje ["kosnice", "aktivnosti"].
  pathSegments = pathSegments.filter(segment => !/^\d+$/.test(segment));

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {/* pocetna stranica da bude uvek prvi breadcrumb */}
        <li className="breadcrumb-item">
          <Link to="/">
            {segmentTitleMap[''] || 'Početna'}
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          // pravi putanju do trenutnog segmenta
          const url = '/' + pathSegments.slice(0, index + 1).join('/');

          // gleda da li je poslednji segment i prikazuje ga kao tekst ne kao link
          const isLastSegment = index === pathSegments.length - 1;

          // cita lep naziv iz maper a koristi raw ime ako ga nemaa
          const segmentName = segmentTitleMap[segment] || segment;

          //Ako je poslednji → prikaži samo tekst (npr. Aktivnosti).
          //Ako nije poslednji → prikaži link (npr. Moje košnice).

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
