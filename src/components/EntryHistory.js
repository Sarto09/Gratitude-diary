import React, { useMemo, useRef } from 'react';
import html2pdf from 'html2pdf.js';

/**
 * EntryHistory component
 *
 * Displays a list of past diary entries with optional filtering by year and month.
 * Also provides a button to export the currently displayed history as a PDF.
 */
export default function EntryHistory({ entries, onFilterChange }) {
  // reference to the printable container
  const printRef = useRef(null);

  // Build sets of years and months present in the entries
  const years = useMemo(() => {
    const set = new Set();
    entries.forEach((entry) => {
      const y = entry.date.split('-')[0];
      set.add(y);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  const months = useMemo(() => {
    const set = new Set();
    entries.forEach((entry) => {
      const m = entry.date.split('-')[1];
      set.add(m);
    });
    return Array.from(set).sort();
  }, [entries]);

  // Handler for export to PDF
  const handleExportPdf = () => {
    const element = printRef.current;
    if (!element) return;
    // Use html2pdf to generate the PDF from the element
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'diario-gratitudine.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Storico dei tuoi diari</h2>
      {/* Filter options */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="year-filter">Anno</label>
          <select id="year-filter" onChange={(e) => onFilterChange(e.target.value, null)} className="mt-1 block w-32 border-gray-300 rounded-md">
            <option value="">Tutti</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600" htmlFor="month-filter">Mese</label>
          <select id="month-filter" onChange={(e) => onFilterChange(null, e.target.value)} className="mt-1 block w-32 border-gray-300 rounded-md">
            <option value="">Tutti</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExportPdf}
          className="ml-auto bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-primary"
        >
          Esporta PDF
        </button>
      </div>
      {/* Printable container */}
      <div ref={printRef} className="space-y-6">
        {entries.map((entry) => (
          <div key={entry.timestamp} className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {new Date(entry.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <div className="space-y-4">
              {Object.entries(entry.answers).map(([key, value]) => (
                <div key={key}>
                  <p className="font-semibold text-gray-700 capitalize">{key === 'gratitude' ? 'Gratitudine' : key === 'learned' ? 'Imparato' : key === 'qualities' ? 'Qualità' : 'Orgoglioso di'}:</p>
                  <p className="ml-4 whitespace-pre-wrap text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}