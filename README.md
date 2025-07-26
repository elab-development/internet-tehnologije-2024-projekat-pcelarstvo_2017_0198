# Aplikacija za podršku pčelarima

Ova aplikacija pruža podršku pčelarima kroz niz funkcionalnosti koje olakšavaju praćenje proizvodnje meda, upravljanje košnicama, planiranje aktivnosti i komunikaciju. Korisnici mogu da registruju i prijave naloge, dodaju i upravljaju košnicama, planiraju aktivnosti, ostavljaju komentare i prate sve na interaktivnoj mapi.

## Ključne funkcionalnosti

- Registracija i prijava korisnika
- Dodavanje i pregled košnica
- Planiranje aktivnosti po košnicama
- Ostavljenje komentara i izvoz komentara u PDF
- Interaktivna mapa sa lokacijama košnica
- Administratorska kontrolna tabla sa statistikom

## Korišćene tehnologije

- **Frontend:** React, React Router, Chart.js, React Leaflet
- **Backend:** Laravel, Laravel Sanctum (autentifikacija), MySQL
- **PDF export:** jsPDF
- **Mapa:** OpenStreetMap preko Leaflet biblioteke
- **Autentifikacija:** Token-based putem sessionStorage

## Pokretanje aplikacije (lokalno)

1. Klonirati repozitorijum.
2. Pokrenuti Laravel backend (`php artisan serve`).
3. Pokrenuti React frontend (`npm start`).
4. Aplikacija koristi token za autentifikaciju i zahteva kreiranog korisnika.

---

