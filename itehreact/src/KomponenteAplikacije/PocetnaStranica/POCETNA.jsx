import React from 'react';
import './POCETNA.css';
import { useNavigate } from 'react-router-dom';
import pcelicaVideo from './pcelica.mp4'; 
//kad se klikne prebaci na login
const POCETNA = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="pocetna-container">
      <header className="hero-section">
        <video className="hero-video" src={pcelicaVideo} autoPlay loop muted playsInline />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="title">Proces proizvodnje meda</h1>
            <p className="subtitle">Pratite sve korake u procesu i vodite svoje pčelarsko društvo uz pomoć naših alata.</p>
            <button className="start-button" onClick={handleStart}>
              POČNI
            </button>
          </div>
        </div>
      </header>

      <section className="steps-section">
        <h2 className="section-title">Koraci u procesu proizvodnje meda</h2>
        <div className="process-diagram">
          <div className="process-line"></div>
          <div className="process-step">
            <div className="step-circle nectar-icon"></div>
            <div className="step-details">
              <h3>Sakupljanje nektara</h3>
              <p>Pčele sakupljaju nektar iz cvetova i odnose ga u košnicu.</p>
            </div>
          </div>
          <div className="process-arrow"></div>
          <div className="process-step">
            <div className="step-circle hive-icon"></div>
            <div className="step-details">
              <h3>Obrada u košnici</h3>
              <p>Nektar se u košnici pretvara u med kroz enzime i isparavanje vode.</p>
            </div>
          </div>
          <div className="process-arrow"></div>
          <div className="process-step">
            <div className="step-circle honeycomb-icon"></div>
            <div className="step-details">
              <h3>Čuvanje u saću</h3>
              <p>Med se skladišti u saću, gde sazreva i postaje gust i aromatičan.</p>
            </div>
          </div>
          <div className="process-arrow"></div>
          <div className="process-step">
            <div className="step-circle harvest-icon"></div>
            <div className="step-details">
              <h3>Vrcanje meda</h3>
              <p>Pčelar vrca med iz saća pomoću vrcaljke, pripremajući ga za pakovanje.</p>
            </div>
          </div>
          <div className="process-arrow"></div>
          <div className="process-step">
            <div className="step-circle jar-icon"></div>
            <div className="step-details">
              <h3>Pakovanje i obeležavanje</h3>
              <p>Med se puni u teglice, obeležava datumom i sortom, spreman za prodaju i korišćenje.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2 className="section-title">Vaši alati</h2>
        <p>Uz našu aplikaciju možete:</p>
        <ul className="features-list">
          <li>Dobiti notifikacije o potrebnim aktivnostima vezanim za pčele i košnice</li>
          <li>Ostavljati i preuzimati datuminirane komentare u PDF formatu</li>
          <li>Planirati sezonske i dodatne aktivnosti putem integrisanog kalendara</li>
          <li>Dobiti sugestije za optimizaciju proizvodnje</li>
        </ul>
      </section>
    </div>
  );
};

export default POCETNA;
