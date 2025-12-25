
import React, { useState } from 'react';
import { HistoryEntry } from '../types';

interface FlashcardViewProps {
  entries: HistoryEntry[];
  onExit: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ entries, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const entry = entries[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % entries.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + entries.length) % entries.length);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Ingen data tilgængelig for dette emne.</p>
        <button onClick={onExit} className="mt-4 text-indigo-600 font-bold">Gå tilbage</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Afslut
        </button>
        <span className="font-mono text-sm text-slate-400">
          {currentIndex + 1} / {entries.length}
        </span>
      </div>

      <div 
        className="relative perspective-1000 h-96 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase mb-4 ${entry.type === 'event' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {entry.type === 'event' ? 'Begivenhed' : 'Begreb'}
            </span>
            <h2 className="text-3xl font-bold text-slate-800">{entry.title}</h2>
            {entry.date && <p className="mt-4 text-xl text-slate-400">{entry.date}</p>}
            <p className="mt-12 text-slate-300 text-xs">Klik for at se detaljer</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-indigo-600 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center text-white">
            <h3 className="text-lg font-bold mb-4 opacity-70">{entry.title}</h3>
            <p className="text-xl leading-relaxed">{entry.description}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-12">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="p-4 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="p-4 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardView;
