import React, { useEffect, useMemo, useRef, useState } from "react";
import html2pdf from "html2pdf.js";

/* ===== Utilità data ===== */
function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const d2 = new Date(d.getTime() - off * 60 * 1000);
  return d2.toISOString().slice(0, 10); // YYYY-MM-DD
}
function formatIT(iso) {
  const [y, m, d] = iso.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STORAGE_KEY = "gratitudeDiaryV1";

export default function App() {
  /* ===== Stato principale ===== */
  const [step, setStep] = useState("date"); // 'date' | 'questions' | 'review' | 'history'
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const questions = useMemo(
    () => [
      {
        id: 1,
        icon: "❤️",
        text:
          "Ripensando alla giornata di oggi, elenca le cose per cui essere grato.",
        placeholder: "Scrivi qui le cose di cui sei grato...",
      },
      {
        id: 2,
        icon: "💡",
        text:
          "Che cosa hai imparato oggi? Piccole o grandi lezioni vanno benissimo.",
        placeholder: "Scrivi qui quello che hai imparato...",
      },
      {
        id: 3,
        icon: "⭐",
        text:
          "Fai un elenco delle qualità o azioni di cui vai fiero di te stesso.",
        placeholder: "Scrivi qui le tue qualità o azioni positive...",
      },
      {
        id: 4,
        icon: "🏅",
        text: "Quali sono le cose di cui sei orgoglioso oggi?",
        placeholder: "Scrivi qui i tuoi successi o traguardi...",
      },
    ],
    []
  );
  const [answers, setAnswers] = useState(Array(4).fill(""));
  const [qIndex, setQIndex] = useState(0);
  const [savedToday, setSavedToday] = useState(false);

  // storico: { [dateISO]: { answers: string[], savedAt:number } }
  const [diary, setDiary] = useState({});

  /* ===== Carica/salva archivio ===== */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDiary(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diary));
  }, [diary]);

  // quando cambio data carico eventuali risposte salvate
  useEffect(() => {
    const existing = diary[selectedDate]?.answers ?? Array(4).fill("");
    setAnswers(existing);
    setSavedToday(Boolean(diary[selectedDate]));
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ===== Navigazione domande ===== */
  const canNext = (answers[qIndex] ?? "").trim().length > 0;

  const goNext = () => {
    if (!canNext) return;
    if (qIndex < questions.length - 1) setQIndex((i) => i + 1);
    else setStep("review");
  };
  const goPrev = () => {
    if (qIndex > 0) setQIndex((i) => i - 1);
    else setStep("date");
  };

  // Swipe mobile: sinistra = avanti (se compilato), destra = indietro
  const touchStartX = useRef(null);
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50 && canNext) goNext();
    if (dx > 50) goPrev();
    touchStartX.current = null;
  };

  /* ===== FIX tastiera mobile =====
     ref dichiarato QUI (fuori da qualsiasi if) per rispettare le regole degli hook */
  const textRef = useRef(null);

  /* ===== Salvataggio del giorno ===== */
  const registerToday = () => {
    const clean = answers.map((a) => a.trim());
    const any = clean.some((a) => a.length > 0);
    if (!any) return;
    setDiary((prev) => ({
      ...prev,
      [selectedDate]: { answers: clean, savedAt: Date.now() },
    }));
    setSavedToday(true);
  };

  /* ===== PDF (data grassetto, domande corsivo, risposte normali) ===== */
  const exportPDF = () => {
    const container = document.createElement("div");
    container.style.padding = "18px";
    container.style.fontFamily = "Inter, system-ui, -apple-system, sans-serif";
    container.style.color = "#111827";
    container.style.lineHeight = "1.5";

    const title = document.createElement("div");
    title.innerHTML = `<div style="font-weight:700;font-size:18px;margin-bottom:10px;">
      Diario – <span>${formatIT(selectedDate)}</span>
    </div>`;
    container.appendChild(title);

    questions.forEach((q, i) => {
      const block = document.createElement("div");
      block.innerHTML = `
        <div style="font-style:italic;margin:8px 0 2px 0;">
          ${q.text}
        </div>
        <div style="white-space:pre-wrap;margin:0 0 8px 0;">
          ${answers[i] || ""}
        </div>`;
      container.appendChild(block);
    });

    const opt = {
      margin: 10,
      filename: `Diario_${selectedDate}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(container).set(opt).save();
  };

  /* ===== Wrapper layout caldo/centrato ===== */
  const Wrapper = ({ children }) => (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );

  /* ========== STEP: Data ========== */
  if (step === "date") {
    return (
      <Wrapper>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Diario della Gratitudine 🌞
          </h1>
          <p className="text-gray-600 text-base">
            Imposta la data e inizia. Una domanda alla volta, con riepilogo finale.
          </p>
        </div>

        {/* card bianca + input data grigio PERFETTAMENTE centrato */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
              Seleziona la data del tuo diario
            </h2>
            <div className="w-full flex justify-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full max-w-xs text-center border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              onClick={() => {
                setQIndex(0);
                setStep("questions");
              }}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-2 rounded-lg transition"
            >
              Inizia
            </button>

            {diary[selectedDate] && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Hai già risposte salvate per {formatIT(selectedDate)}. Puoi aggiornarle.
              </p>
            )}
          </div>
        </div>
      </Wrapper>
    );
  }

  /* ========== STEP: Domande (una alla volta) ========== */
  if (step === "questions") {
    const q = questions[qIndex];

    return (
      <Wrapper>
        <div className="text-center mb-3">
          <p className="text-sm text-gray-500 italic">
            Scorri a sinistra o premi “Avanti” per passare alla domanda successiva
          </p>
          <p className="text-xs text-gray-500">{formatIT(selectedDate)}</p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-md p-5"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex flex-col items-center text-center mb-4">
            <div className="text-3xl mb-2">{q.icon}</div>
            <h2 className="text-gray-800 text-base font-semibold leading-snug max-w-sm">
              {q.text}
            </h2>
          </div>

          <textarea
            key={qIndex}                 /* remount quando cambi domanda */
            ref={textRef}
            defaultValue={answers[qIndex]} /* non controllata durante la scrittura */
            onChange={(e) => {
              // aggiorno il buffer locale senza re-render
              answers[qIndex] = e.target.value;
            }}
            onBlur={(e) => {
              // salvo nello stato SOLO quando esci dal campo → niente chiusura tastiera
              const a = [...answers];
              a[qIndex] = e.target.value;
              setAnswers(a);
            }}
            onFocus={() => {
              // mantiene visibile il campo con tastiera aperta
              setTimeout(() => {
                textRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 150);
            }}
            placeholder={q.placeholder}
            className="w-full h-32 p-3 border border-gray-300 rounded-xl text-gray-700 text-base resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              onClick={goPrev}
              className="w-1/2 bg-gray-100 text-gray-800 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
            >
              Indietro
            </button>
            <button
              onClick={goNext}
              disabled={!canNext}
              className={
                "w-1/2 py-2 rounded-lg transition " +
                (canNext
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-yellow-200 text-white cursor-not-allowed")
              }
            >
              {qIndex < questions.length - 1 ? "Avanti" : "Riepilogo"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            Domanda {qIndex + 1} di {questions.length}
          </p>
        </div>
      </Wrapper>
    );
  }

  /* ========== STEP: Riepilogo (modificabile) ========== */
  if (step === "review") {
    const allFilled = answers.every((a) => a.trim().length > 0);

    return (
      <Wrapper>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Riepilogo – {formatIT(selectedDate)}
          </h2>
          <p className="text-sm text-gray-500">
            Modifica liberamente prima di registrare.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
              <p className="italic text-gray-700 mb-2">{q.text}</p>
              <textarea
                defaultValue={answers[i]}
                onBlur={(e) => {
                  const a = [...answers];
                  a[i] = e.target.value;
                  setAnswers(a);
                }}
                className="w-full h-24 p-3 border border-gray-300 rounded-xl text-gray-800 text-base resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => setStep("questions")}
            className="w-full sm:w-1/3 bg-gray-100 text-gray-800 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
          >
            Torna alle domande
          </button>
          <button
            onClick={registerToday}
            disabled={!allFilled}
            className={
              "w-full sm:w-2/3 py-2 rounded-lg transition " +
              (allFilled
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-yellow-200 text-white cursor-not-allowed")
            }
          >
            Registra risposte
          </button>
        </div>

        {savedToday && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
            <p className="text-green-700 font-medium mb-3">
              ✅ Risposte registrate per {formatIT(selectedDate)}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep("history")}
                className="w-full sm:w-1/2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
              >
                Il mio diario
              </button>
              <button
                onClick={exportPDF}
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Esporta in PDF
              </button>
            </div>
          </div>
        )}
      </Wrapper>
    );
  }

  /* ========== STEP: Storico ========== */
  if (step === "history") {
    const dates = Object.keys(diary).sort((a, b) => (a < b ? 1 : -1));
    return (
      <Wrapper>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Il mio diario</h2>
        </div>

        {dates.length === 0 ? (
          <p className="text-center text-gray-500">Non hai ancora registrato nulla.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {dates.map((d) => (
              <div key={d} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">{formatIT(d)}</p>
                {diary[d].answers.map((ans, i) => (
                  <div key={i} className="mb-2">
                    <p className="italic text-gray-700 text-sm">{questions[i]?.text}</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{ans}</p>
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => {
                      setSelectedDate(d);
                      setAnswers(diary[d].answers);
                      setSavedToday(true);
                      setStep("review");
                    }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
                  >
                    Apri e modifica
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDate(d);
                      setAnswers(diary[d].answers);
                      exportPDF();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setStep("date")}
          className="w-full mt-6 bg-gray-100 text-gray-800 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
        >
          Torna alla data
        </button>
      </Wrapper>
    );
  }

  return null;
}
