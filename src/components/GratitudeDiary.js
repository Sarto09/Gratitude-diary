import React, { useState } from 'react';
import { Heart, Lightbulb, Sparkles, Award, ArrowRight, Check, Calendar } from 'lucide-react';

/**
 * GratitudeDiary component
 *
 * Presents a series of reflective questions to the user. Answers are collected
 * and returned to the parent via the onComplete callback. A warm and inviting
 * theme is applied using Tailwind's custom colour palette defined in the
 * configuration. Once all questions have been answered, a summary is
 * displayed along with an option to start a new entry.
 */
export default function GratitudeDiary({ name, date, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    gratitude: '',
    learned: '',
    qualities: '',
    proud: ''
  });
  const [isComplete, setIsComplete] = useState(false);

  const questions = [
    {
      id: 'gratitude',
      question: 'Ripensando alla giornata di oggi, fai un piccolo elenco delle cose per cui essere grato',
      icon: Heart,
      color: 'text-primary-dark',
      bgColor: 'bg-primary-light',
      placeholder: 'Es:\n- La colazione tranquilla di stamattina\n- La telefonata con un amico\n- Il sole che ho visto dalla finestra'
    },
    {
      id: 'learned',
      question: 'Ripensando alla giornata di oggi, fai un elenco delle cose che hai imparato',
      icon: Lightbulb,
      color: 'text-secondary-dark',
      bgColor: 'bg-secondary-light',
      placeholder: 'Es:\n- Come risolvere un problema al lavoro\n- Una nuova parola in inglese\n- Che ho bisogno di più pause durante il giorno'
    },
    {
      id: 'qualities',
      question: 'Fai un elenco delle cose belle che riconosci in te stesso',
      icon: Sparkles,
      color: 'text-accent-dark',
      bgColor: 'bg-accent-light',
      placeholder: 'Es:\n- La mia pazienza\n- La mia creatività\n- La mia capacità di ascolto'
    },
    {
      id: 'proud',
      question: 'Fai un elenco delle cose di cui sei orgoglioso oggi',
      icon: Award,
      color: 'text-primary-dark',
      bgColor: 'bg-primary-light',
      placeholder: 'Es:\n- Aver completato quel progetto\n- Essere stato gentile con qualcuno\n- Aver dedicato tempo a me stesso'
    }
  ];

  const currentQuestion = questions[currentStep];
  const Icon = currentQuestion?.icon;

  // Proceed to the next step or finish
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      // pass answers up with date and name
      onComplete({ date, name, answers, timestamp: new Date().toISOString() });
    }
  };

  // Return to the previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update answer for the current question
  const handleAnswerChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  // Reset the diary to start a new entry
  const startNew = () => {
    setCurrentStep(0);
    setAnswers({
      gratitude: '',
      learned: '',
      qualities: '',
      proud: ''
    });
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-primary-light">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-light rounded-full mb-4">
              <Check className="w-10 h-10 text-primary-dark" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Ben fatto, {name}!</h2>
            <p className="text-gray-600">Hai completato il diario della gratitudine per il {date}</p>
          </div>

          <div className="space-y-6">
            {questions.map((q) => {
              const QuestionIcon = q.icon;
              return (
                <div key={q.id} className={`${q.bgColor} rounded-2xl p-6`}>
                  <div className="flex items-start gap-3 mb-3">
                    <QuestionIcon className={`${q.color} w-5 h-5 mt-1 flex-shrink-0`} />
                    <h3 className="font-semibold text-gray-800">{q.question}</h3>
                  </div>
                    <p className="text-gray-700 whitespace-pre-wrap ml-8">{answers[q.id]}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={startNew}
            className="w-full mt-8 bg-primary-dark text-white py-4 rounded-xl font-semibold hover:bg-primary transition-all duration-200"
          >
            Compila un nuovo diario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary-light">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-primary-dark" />
            {/* Display the diary name with the user's name italicised */}
            <h1 className="text-4xl font-bold text-gray-800 italic">Diario di {name}</h1>
          </div>
          <p className="text-gray-600">Rispondi alle domande riflettendo sulla tua giornata del {date}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-500">
              Domanda {currentStep + 1} di {questions.length}
            </span>
            {/* Progress indicators */}
            <div className="flex gap-2">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? 'bg-primary-dark w-8'
                      : idx < currentStep
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className={`${currentQuestion.bgColor} rounded-2xl p-6 mb-6`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`${currentQuestion.bgColor} p-3 rounded-xl`}>
                <Icon className={`${currentQuestion.color} w-8 h-8`} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>
            </div>
          </div>

          <textarea
            value={answers[currentQuestion.id]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full h-56 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-dark focus:outline-none resize-none text-gray-700 leading-relaxed"
          />

          <div className="flex gap-4 mt-6">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Indietro
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id].trim()}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                answers[currentQuestion.id].trim()
                  ? 'bg-primary-dark text-white hover:bg-primary'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? 'Completa' : 'Avanti'}
              {currentStep < questions.length - 1 && <ArrowRight className="w-5 h-5" />}
              {currentStep === questions.length - 1 && <Check className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}