
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

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/admin/kosnice`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setKosnice(arr);
      } catch {
        setError('Greška prilikom učitavanja košnica.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const includeCsv = useMemo(
    () =>
      Object.entries(include)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(','),
    [include]
  );

  const toggleAll = (checked) => {
    if (checked) setSelectedIds(kosnice.map((k) => k.id));
    else setSelectedIds([]);
  };
  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const fmt = (v) => (v == null || v === '' ? '-' : String(v));
  const short = (v, n = 100) =>
    v ? (String(v).length > n ? String(v).slice(0, n) + '…' : String(v)) : '-';

  const generatePdf = (meta, items) => {
    // A4 landscape u pt, zbog preciznih širina
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();   // ≈ 842 pt
    const margin = 36;                                    // 0.5"
    const contentWidth = pageWidth - margin * 2;          // ≈ 770 pt

    // Naslov + meta
    doc.setFontSize(18);
    doc.text('Izveštaj o košnicama', margin, margin + 28);

    doc.setFontSize(11);
    const metaLines = [
      `Generisano: ${fmt(meta.generated_at)}`,
      `Filtri: IDs=[${(meta.filters?.kosnica_ids ?? []).join(', ')}]`,
      `Include: ${(meta.filters?.include ?? []).join(', ')}`,
      `Ukupno košnica: ${fmt(meta.totals?.kosnice)}, aktivnosti: ${fmt(
        meta.totals?.aktivnosti
      )}, komentara: ${fmt(meta.totals?.komentari)}`,
    ];
    metaLines.forEach((l, i) => doc.text(l, margin, margin + 28 + 18 + i * 14));

    // --- SUMMARY TABELA ---
    // Sabir širina = 752 pt (<= contentWidth ~770) -> neće seći stranicu
    const summaryColStyles = {
      0: { cellWidth: 32, halign: 'center' }, // ID
      1: { cellWidth: 110 },                  // Naziv
      2: { cellWidth: 150 },                  // Adresa
      3: { cellWidth: 110 },                  // Geo
      4: { cellWidth: 40, halign: 'right' },  // #Akt
      5: { cellWidth: 40, halign: 'right' },  // #Kom
      6: { cellWidth: 110 },                  // Vlasnik
      7: { cellWidth: 80 },                   // Kreirano
      8: { cellWidth: 80 },                   // Ažurirano
    };

    const summaryRows = items.map((k) => [
      k.id,
      fmt(k.naziv),
      fmt(k.adresa),
      `${fmt(k.latitude)}, ${fmt(k.longitude)}`,
      k.aktivnosti_count ?? 0,
      k.komentari_count ?? 0,
      include.vlasnik ? fmt(k.user?.name ?? k.user?.email) : '-',
      fmt(k.created_at),
      fmt(k.updated_at),
    ]);

    autoTable(doc, {
      startY: margin + 28 + 18 + metaLines.length * 14 + 10,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
      headStyles: {
        fillColor: [30, 136, 229],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left',
        lineWidth: 0.5,
      },
      bodyStyles: { valign: 'top' },
      columnStyles: summaryColStyles,
      head: [['ID', 'Naziv', 'Adresa', 'Geo', '#Akt', '#Kom', 'Vlasnik', 'Kreirano', 'Ažurirano']],
      body: summaryRows,
    });

    // --- DETALJI PO KOŠNICI ---
    items.forEach((k) => {
      doc.addPage('a4', 'landscape');

      doc.setFontSize(14);
      doc.text(`Košnica #${k.id} — ${fmt(k.naziv)}`, margin, margin);

      doc.setFontSize(11);
      const info = [
        `Adresa: ${fmt(k.adresa)}`,
        `Lokacija: ${fmt(k.latitude)}, ${fmt(k.longitude)}`,
        `Vlasnik: ${include.vlasnik ? fmt(k.user?.name ?? k.user?.email) : 'N/A'}`,
        `Kreirano: ${fmt(k.created_at)} | Ažurirano: ${fmt(k.updated_at)}`,
        `Aktivnosti: ${k.aktivnosti_count ?? 0}, Komentari: ${k.komentari_count ?? 0}`,
        ...(k.opis ? [`Opis: ${fmt(k.opis)}`] : []),
      ];
      info.forEach((l, i) => doc.text(l, margin, margin + 18 + i * 14));

      let startY = margin + 18 + info.length * 14 + 10;

      // Aktivnosti — sabir širina = 762 pt (<= contentWidth)
      if (include.aktivnosti && Array.isArray(k.aktivnosti) && k.aktivnosti.length) {
        const actColStyles = {
          0: { cellWidth: 32, halign: 'center' }, // ID
          1: { cellWidth: 70 },                   // Datum
          2: { cellWidth: 120 },                  // Naziv
          3: { cellWidth: 70 },                   // Tip
          4: { cellWidth: 110 },                  // Autor
          5: { cellWidth: 200 },                  // Opis
          6: { cellWidth: 80 },                   // Kreirano
          7: { cellWidth: 80 },                   // Ažurirano
        };

        const actRows = k.aktivnosti.map((a) => [
          a.id,
          fmt(a.datum),
          fmt(a.naziv),
          fmt(a.tip),
          include.autori ? fmt(a.user?.name ?? a.user?.email) : '-',
          short(a.opis, 180),
          fmt(a.created_at),
          fmt(a.updated_at),
        ]);

        autoTable(doc, {
          startY,
          margin: { left: margin, right: margin },
          tableWidth: contentWidth,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
          headStyles: { fillColor: [38, 166, 154], textColor: 255, fontStyle: 'bold' },
          columnStyles: actColStyles,
          head: [['ID', 'Datum', 'Naziv', 'Tip', 'Autor', 'Opis', 'Kreirano', 'Ažurirano']],
          body: actRows,
        });

        startY = doc.lastAutoTable.finalY + 12;
      }

      // Komentari — sabir širina = 682 pt
      if (include.komentari && Array.isArray(k.komentari) && k.komentari.length) {
        const comColStyles = {
          0: { cellWidth: 32, halign: 'center' }, // ID
          1: { cellWidth: 70 },                   // Datum
          2: { cellWidth: 120 },                  // Autor
          3: { cellWidth: 300 },                  // Sadržaj
          4: { cellWidth: 80 },                   // Kreirano
          5: { cellWidth: 80 },                   // Ažurirano
        };

        const comRows = k.komentari.map((c) => [
          c.id,
          fmt(c.datum),
          include.autori ? fmt(c.user?.name ?? c.user?.email) : '-',
          short(c.sadrzaj, 260),
          fmt(c.created_at),
          fmt(c.updated_at),
        ]);

        autoTable(doc, {
          startY,
          margin: { left: margin, right: margin },
          tableWidth: contentWidth,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
          headStyles: { fillColor: [239, 108, 0], textColor: 255, fontStyle: 'bold' },
          columnStyles: comColStyles,
          head: [['ID', 'Datum', 'Autor', 'Sadržaj', 'Kreirano', 'Ažurirano']],
          body: comRows,
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
          {!loading && !error && kosnice.length === 0 && <p>Nema košnica za prikaz.</p>}

          {!loading && !error && kosnice.length > 0 && (
            <>
              <div className="kosnice-toolbar">
                <label style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={kosnice.length > 0 && selectedIds.length === kosnice.length}
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
                      <div className="kosnica-title">{k.naziv || `Košnica #${k.id}`}</div>
                      <div className="kosnica-meta">
                        {fmt(k.adresa)} | {fmt(k.latitude)}, {fmt(k.longitude)}
                      </div>
                      {k.opis && <div className="kosnica-opis">{short(k.opis, 80)}</div>}
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
