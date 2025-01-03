import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [kosniceStats, setKosniceStats] = useState(null);
  const [aktivnostiStats, setAktivnostiStats] = useState(null);
  const [komentariStats, setKomentariStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const token = sessionStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [kosniceResponse, aktivnostiResponse, komentariResponse] =
          await Promise.all([
            axios.get('http://127.0.0.1:8000/api/admin/kosnice-stats', config),
            axios.get('http://127.0.0.1:8000/api/admin/aktivnosti-stats', config),
            axios.get('http://127.0.0.1:8000/api/admin/komentari-stats', config),
          ]);

        setKosniceStats(kosniceResponse.data);
        setAktivnostiStats(aktivnostiResponse.data.data);
        setKomentariStats(komentariResponse.data.data);
      } catch (err) {
        console.log(err);
        setError('Došlo je do greške prilikom učitavanja podataka.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Učitavanje statistika...</p>;
  if (error) return <p>{error}</p>;

  // Podaci za aktivnosti po tipu
  const aktivnostiData = {
    labels: aktivnostiStats.map((stat) => stat.tip),
    datasets: [
      {
        label: 'Aktivnosti po tipu',
        data: aktivnostiStats.map((stat) => stat.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // Podaci za komentare po košnicama
  const komentariData = {
    labels: komentariStats.map((stat) => `Košnica ${stat.kosnica_id}`),
    datasets: [
      {
        label: 'Komentari po košnicama',
        data: komentariStats.map((stat) => stat.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>

      {/* Grafikon za aktivnosti po tipu */}
      <div className="chart-section">
        <h2 className="chart-section-title">Aktivnosti po tipu</h2>
        <div className="chart-wrapper">
          <Bar data={aktivnostiData} />
        </div>
      </div>

      {/* Grafikon za komentare po košnicama */}
      <div className="chart-section">
        <h2 className="chart-section-title">Komentari po košnicama</h2>
        <div className="chart-wrapper">
          <Bar data={komentariData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
