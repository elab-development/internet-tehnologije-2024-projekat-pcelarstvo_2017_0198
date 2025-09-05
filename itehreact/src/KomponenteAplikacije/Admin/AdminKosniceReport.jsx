
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminKosniceReport.css';

const API_BASE =
  import.meta?.env?.VITE_API_BASE ??
  process.env.REACT_APP_API_BASE ??
  'http://127.0.0.1:8000';

const AdminKosniceReport = () => {
  // --- STATE ---
  const [kosnice, setKosnice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [include, setInclude] = useState({
    aktivnosti: true,
    komentari: true,
    vlasnik: true,
    autori: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // --- FETCH ALL HIVES (ADMIN) ---
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/admin/kosnice`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // podrži i {data: [...]} i direktan niz
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setKosnice(arr);
      } catch (e) {
        setError('Greška prilikom učitavanja košnica.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // --- UI HELPERS ---
  const includeCsv = useMemo(() => {
    return Object.entries(include)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(',');
  }, [include]);

  const toggleAll = (checked) => {
    if (checked) setSelectedIds(kosnice.map((k) => k.id));
    else setSelectedIds([]);
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // --- PDF ---
  const generatePdf = (meta, items) => {
    const doc = new jsPDF();

    // 1) Header
    doc.setFontSize(16);
    doc.text('Izveštaj o košnicama', 14, 16);
    doc.setFontSize(11);
    const metaLines = [
      `Generisano: ${meta.generated_at}`,
      `Filtri: IDs=[${(meta.filters?.kosnica_ids ?? []).join(', ')}]`,
      `Include: ${(meta.filters?.include ?? []).join(', ')}`,
      `Ukupno košnica: ${meta.totals.kosnice}, aktivnosti: ${meta.totals.aktivnosti}, komentara: ${meta.totals.komentari}`,
    ];
    metaLines.forEach((l, i) => doc.text(l, 14, 24 + i * 6));

    // 2) Summary table
    const summaryRows = items.map((k) => [
      k.id,
      k.naziv ?? '-',
      k.adresa ?? '-',
      (k.latitude ?? '-') + ', ' + (k.longitude ?? '-'),
      k.aktivnosti_count ?? 0,
      k.komentari_count ?? 0,
      k.user ? (k.user.name ?? k.user.email ?? '-') : '-',
    ]);

    autoTable(doc, {
      startY: 24 + metaLines.length * 6 + 4,
      head: [['ID', 'Naziv', 'Adresa', 'Geo', '#Akt', '#Kom', 'Vlasnik']],
      body: summaryRows,
      styles: { fontSize: 9 },
      headStyles: { halign: 'left' },
      bodyStyles: { valign: 'top' },
    });

    // 3) Details per hive
    items.forEach((k) => {
      doc.addPage();

      doc.setFontSize(14);
      doc.text(`Košnica #${k.id} — ${k.naziv ?? ''}`, 14, 16);
      doc.setFontSize(11);
      const lines = [
        `Adresa: ${k.adresa ?? '-'}`,
        `Lokacija: ${(k.latitude ?? '-') + ', ' + (k.longitude ?? '-')}`,
        `Vlasnik: ${k.user ? (k.user.name ?? k.user.email ?? '-') : 'N/A'}`,
        `Aktivnosti: ${k.aktivnosti_count ?? 0}, Komentari: ${k.komentari_count ?? 0}`,
        ...(k.opis ? [`Opis: ${k.opis}`] : []),
      ];
      lines.forEach((l, i) => doc.text(l, 14, 24 + i * 6));

      let startY = 24 + lines.length * 6 + 4;

      if (Array.isArray(k.aktivnosti)) {
        const actRows = k.aktivnosti.map((a) => [
          a.id,
          a.datum,
          a.naziv ?? '-',
          a.tip ?? '-',
          a.user ? (a.user.name ?? a.user.email ?? '-') : '-',
          a.opis ? String(a.opis).slice(0, 80) : '-',
        ]);

        autoTable(doc, {
          startY,
          head: [['ID', 'Datum', 'Naziv', 'Tip', 'Autor', 'Opis']],
          body: actRows,
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
        });

        startY = doc.lastAutoTable.finalY + 6;
      }

      if (Array.isArray(k.komentari)) {
        const comRows = k.komentari.map((c) => [
          c.id,
          c.datum,
          c.user ? (c.user.name ?? c.user.email ?? '-') : '-',
          c.sadrzaj ? String(c.sadrzaj).slice(0, 100) : '-',
        ]);

        autoTable(doc, {
          startY,
          head: [['ID', 'Datum', 'Autor', 'Sadržaj']],
          body: comRows,
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
        });
      }
    });

    doc.save('izvestaj-kosnice.pdf');
  };
 
  const handleGenerate = async () => {
    setBackendError(null);

    if (selectedIds.length === 0) {
      setBackendError('Odaberite bar jednu košnicu.');
      return;
    }

    setSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');

      const params = new URLSearchParams();
      selectedIds.forEach((id) => params.append('kosnica_ids[]', String(id)));
      if (includeCsv) params.set('include', includeCsv);

      const res = await axios.get(
        `${API_BASE}/api/admin/reports/kosnice?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data?.success) throw new Error('Backend vratio neuspeh.');
      const { meta, data } = res.data;
      generatePdf(meta, data);
    } catch (e) {
      setBackendError(
        e?.response?.data?.message ||
          e?.message ||
          'Došlo je do greške tokom generisanja izveštaja.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="admin-report">
      <h2>Izvoz izveštaja o košnicama (PDF)</h2>

      <div className="filters-grid">
        <fieldset>
          <legend>Uključi sekcije</legend>
        <div className="include-grid">
            {Object.keys(include).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={include[key]}
                  onChange={(e) =>
                    setInclude((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                />
                {key}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Odaberite košnice</legend>

          {loading && <p>Učitavanje košnica…</p>}
          {error && <p className="error">{String(error)}</p>}
          {!loading && !error && kosnice.length === 0 && (
            <p>Nema košnica za prikaz.</p>
          )}

          {!loading && !error && kosnice.length > 0 && (
            <>
              <div className="kosnice-toolbar">
                <label
                  style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    checked={
                      kosnice.length > 0 && selectedIds.length === kosnice.length
                    }
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                  Selektuj sve
                </label>
              </div>

              <div className="kosnice-grid">
                {kosnice.map((k) => (
                  <label key={k.id} className="kosnica-card">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(k.id)}
                      onChange={() => toggleOne(k.id)}
                      style={{ marginTop: 4 }}
                    />
                    <div>
                      <div className="kosnica-title">
                        {k.naziv || `Košnica #${k.id}`}
                      </div>
                      <div className="kosnica-meta">
                        {k.adresa || '—'} |{' '}
                        {(k.latitude ?? '-') + ', ' + (k.longitude ?? '-')}
                      </div>
                      {k.opis && (
                        <div className="kosnica-opis">
                          {String(k.opis).slice(0, 80)}
                          {String(k.opis).length > 80 ? '…' : ''}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </fieldset>

        {backendError && <div className="error">{backendError}</div>}

        <div>
          <button onClick={handleGenerate} disabled={submitting || kosnice.length === 0}>
            {submitting ? 'Generišem…' : 'Generiši PDF izveštaj'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminKosniceReport;
