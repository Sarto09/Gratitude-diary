import React, { useState, useEffect } from "react";
import { Heart, Lightbulb, Star, Award } from "lucide-react";

function App() {
  const [answers, setAnswers] = useState(["", "", "", ""]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gratitudeAnswers")) || ["", "", "", ""];
    setAnswers(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("gratitudeAnswers", JSON.stringify(answers));
  }, [answers]);

  const questions = [
    {
      id: 1,
      icon: <Heart className="text-rose-500 w-8 h-8" />,
      color: "bg-rose-50",
      text: "Ripensando alla giornata di oggi, fai un piccolo elenco delle cose per cui essere grato.",
      placeholder: "Scrivi qui le cose di cui sei grato...",
    },
    {
      id: 2,
      icon: <Lightbulb className="text-amber-500 w-8 h-8" />,
      color: "bg-amber-50",
      text: "Ripensando alla giornata di oggi, fai un elenco delle cose che hai imparato.",
      placeholder: "Scrivi qui le lezioni o scoperte della giornata...",
    },
    {
      id: 3,
      icon: <Star className="text-indigo-500 w-8 h-8" />,
      color: "bg-indigo-50",
      text: "Fai un elenco delle cose belle che riconosci in te stesso.",
      placeholder: "Scrivi qui i tuoi punti di forza o qualità positive...",
    },
    {
      id: 4,
      icon: <Award className="text-yellow-500 w-8 h-8" />,
      color: "bg-yellow-50",
      text: "Fai un elenco delle cose di cui sei orgoglioso oggi.",
      placeholder: "Scrivi qui i tuoi successi o traguardi personali...",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col items-center px-4 py-8">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Diario di Leo 🌞</h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Rispondi alle domande riflettendo sulla tua giornata.
        </p>
      </div>

      {/* BLOCCO DATA CENTRATO */}
      <div className="flex justify-center w-full mb-10">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Seleziona la data del tuo diario
          </h2>
          <input
            type="text"
            readOnly
            value={new Date().toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            className="w-full max-w-xs text-center border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
          />
          <button
            onClick={() =>
              document.getElementById("questions")?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-2 rounded-lg transition"
          >
            Inizia
          </button>
        </div>
      </div>

      {/* SEZIONE DOMANDE */}
      <div id="questions" className="w-full max-w-md flex flex-col gap-8">
        <p className="text-center text-sm text-gray-500 mb-2 italic">
          Scorri per passare alla domanda successiva ↓
        </p>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className={`w-full ${q.color} border border-gray-200 rounded-2xl p-5 shadow-sm transition`}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <div className="mb-2">{q.icon}</div>
              <h3 className="text-gray-800 text-base font-semibold leading-snug max-w-xs">
                {q.text}
              </h3>
            </div>
            <textarea
              value={answers[index]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder={q.placeholder}
              className="w-full h-28 p-3 border border-gray-300 rounded-xl text-gray-700 text-base resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
        ))}
      </div>

      {/* SEZIONE RIEPILOGO */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 mt-12 mb-10">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Le tue riflessioni salvate
        </h2>
        {answers.every((a) => a.trim() === "") ? (
          <p className="text-gray-500 text-center italic">
            Non hai ancora scritto nulla oggi 💭
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {questions.map(
              (q, i) =>
                answers[i].trim() !== "" && (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                  >
                    <p className="font-medium text-gray-700 mb-1 text-sm">{q.text}</p>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {answers[i]}
                    </p>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
