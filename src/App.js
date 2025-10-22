import React, { useEffect, useState } from 'react';
import GratitudeDiary from './components/GratitudeDiary';
import EntryHistory from './components/EntryHistory';
import QuoteBox from './components/QuoteBox';

// A small collection of motivational quotes. Each quote can include an author.
const QUOTES = [
  { text: 'Ogni giorno porta nuovi inizi, nuova speranza e nuove opportunità.', author: 'Anonimo' },
  { text: 'La gratitudine trasforma ciò che abbiamo in abbastanza.', author: 'Aesop' },
  { text: 'Ricorda che la felicità è un modo di viaggiare, non una destinazione.', author: 'Roy L. Goodman' },
  { text: 'Apprezza le piccole cose, perché un giorno potresti guardare indietro e scoprire che erano grandi.', author: 'Robert Brault' },
  { text: 'Ogni momento è un nuovo inizio.', author: 'T.S. Eliot' },
];

/**
 * Main application component
 *
 * Handles onboarding (asking for the user's name and date), renders the
 * GratitudeDiary component, maintains the list of past entries and displays
 * an EntryHistory with filtering and PDF export capabilities.
 */
export default function App() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [entries, setEntries] = useState([]);
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [quote, setQuote] = useState(null);

  // Local state for input fields
  const [nameInput, setNameInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);

  // Load persisted data on mount
  useEffect(() => {
    const storedName = localStorage.getItem('gratitude-name');
    if (storedName) setName(storedName);
    const storedEntries = localStorage.getItem('gratitude-entries');
    if (storedEntries) setEntries(JSON.parse(storedEntries));
  }, []);

  // Choose a random quote based on date to ensure a different one each day
  useEffect(() => {
    if (!quote) {
      const index = new Date().getDate() % QUOTES.length;
      setQuote(QUOTES[index]);
    }
  }, [quote]);

  // Persist name and entries to localStorage when they change
  useEffect(() => {
    if (name) {
      localStorage.setItem('gratitude-name', name);
    }
  }, [name]);
  useEffect(() => {
    if (entries) {
      localStorage.setItem('gratitude-entries', JSON.stringify(entries));
    }
  }, [entries]);

  // Handler when a new diary entry is completed
  const handleComplete = (entry) => {
    setEntries([...entries, entry]);
  };

  // Filter entries by year and month
  const filteredEntries = entries
    .filter((entry) => {
      if (filterYear && entry.date.split('-')[0] !== filterYear) return false;
      if (filterMonth && entry.date.split('-')[1] !== filterMonth) return false;
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  // Determine which view to show based on whether name and date are set
  if (!name) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-primary-light">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Benvenuto!</h1>
          <p className="text-gray-600 mb-4">Per iniziare, inserisci il tuo nome:</p>
          <input
            type="text"
            placeholder="Il tuo nome"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
          />
          <button
            onClick={() => {
              if (nameInput.trim()) setName(nameInput.trim());
            }}
            className="w-full py-3 bg-primary-dark text-white rounded-md font-semibold hover:bg-primary"
          >
            Continua
          </button>
        </div>
      </div>
    );
  }

  if (!date) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-primary-light">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ciao {name}!</h2>
          <p className="text-gray-600 mb-4">Seleziona la data per il tuo diario:</p>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-dark"
          />
          <button
            onClick={() => {
              if (dateInput) setDate(dateInput);
            }}
            className="w-full py-3 bg-primary-dark text-white rounded-md font-semibold hover:bg-primary"
          >
            Inizia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light">
      {/* Quote at top after selecting date */}
      <div className="max-w-4xl mx-auto p-6">
        {quote && <QuoteBox quote={quote.text} author={quote.author} />}
        {/* Gratitude diary for the selected date */}
        <GratitudeDiary name={name} date={date} onComplete={handleComplete} />
        {/* Show history of entries only if there are any */}
        {entries.length > 0 && (
          <EntryHistory
            entries={filteredEntries}
            onFilterChange={(year, month) => {
              // update filters. If year is null, update only month; vice versa.
              if (year !== null) setFilterYear(year);
              if (month !== null) setFilterMonth(month);
            }}
          />
        )}
      </div>
    </div>
  );
}