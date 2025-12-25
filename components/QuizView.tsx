
import React, { useState, useMemo } from 'react';
import { HistoryEntry, Question } from '../types';

interface QuizViewProps {
  entries: HistoryEntry[];
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ entries, onExit }) => {
  const allQuestions = useMemo(() => {
    return entries.flatMap(e => e.questions.map(q => ({ ...q, entryTitle: e.title })));
  }, [entries]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (allQuestions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 italic">Der er ingen spørgsmål tilknyttet de valgte emner endnu.</p>
        <button onClick={onExit} className="mt-4 text-indigo-600 font-bold hover:underline">Gå tilbage</button>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-indigo-600 flex items-center justify-center text-3xl font-bold text-indigo-700">
            {Math.round((score / allQuestions.length) * 100)}%
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Gennemført!</h2>
        <p className="text-slate-500 mb-8">Du fik {score} ud af {allQuestions.length} rigtige.</p>
        <button 
          onClick={onExit}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Vend tilbage til menuen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Afslut
        </button>
        <div className="flex items-center gap-4">
           <span className="text-xs font-bold text-slate-400 uppercase">Spørgsmål {currentIndex + 1} af {allQuestions.length}</span>
           <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
             <div 
               className="h-full bg-indigo-600 transition-all duration-300" 
               style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
             ></div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <p className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-widest">{currentQuestion.entryTitle}</p>
        <h2 className="text-2xl font-bold text-slate-800 mb-8">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let statusClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
            if (isAnswered) {
              if (option === currentQuestion.correctAnswer) {
                statusClass = "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200";
              } else if (option === selectedOption) {
                statusClass = "border-rose-500 bg-rose-50 ring-2 ring-rose-200";
              } else {
                statusClass = "border-slate-100 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={`w-full p-5 text-left rounded-xl border-2 transition-all flex items-center gap-4 ${statusClass}`}
              >
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium text-slate-700">{option}</span>
                {isAnswered && option === currentQuestion.correctAnswer && (
                   <svg className="w-6 h-6 ml-auto text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {currentQuestion.explanation && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800 text-sm italic">
              <strong>Info:</strong> {currentQuestion.explanation}
            </div>
          )}
          <button 
            onClick={handleNext}
            className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            {currentIndex === allQuestions.length - 1 ? 'Se Resultat' : 'Næste Spørgsmål'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
