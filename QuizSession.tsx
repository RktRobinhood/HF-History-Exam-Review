
import React, { useState, useMemo } from 'react';
import { shuffle } from './utils.js';

export const QuizSession = ({ entries, onExit, title, onRecord, playSound }: any) => {
  // 1. Prepare and shuffle questions and options ONCE on mount
  const sessionData = useMemo(() => {
    const raw = entries.flatMap((e: any) => 
      (e.questions || []).map((q: any) => ({
        ...q,
        entryId: e.id,
        options: shuffle([...q.options])
      }))
    );
    return shuffle(raw);
  }, [entries]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const currentQ = sessionData[idx];

  if (!currentQ) return (
    <div className="p-20 text-center animate-pop">
      <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tighter">Vælg emner for at starte quiz.</h2>
      <button onClick={onExit} className="bg-slate-900 text-white border-4 border-slate-900 px-12 py-6 font-black uppercase shadow-[6px_6px_0px_black]">GÅ TIL MENUEN</button>
    </div>
  );

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelected(option);
    setIsAnswered(true);
    const correct = option === currentQ.correctAnswer;
    if (correct) playSound('success'); else playSound('damage');
    onRecord(currentQ.entryId, correct);
  };

  const handleNext = () => {
    if (idx < sessionData.length - 1) {
      setIdx(prev => prev + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-full overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900">✕ AFBRYD</button>
        <span className="font-black text-slate-900 border-4 border-slate-900 px-6 py-2 uppercase text-xs bg-white shadow-[4px_4px_0px_black]">{idx + 1} / {sessionData.length}</span>
      </div>
      
      <div className="bg-white border-4 border-slate-900 p-10 shadow-[16px_16px_0px_black] rounded-2xl relative overflow-hidden">
        <p className="text-[10px] font-black text-blue-600 uppercase mb-6 tracking-widest border-b-2 border-slate-100 pb-2">{title}</p>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 leading-tight tracking-tight">{currentQ.question}</h2>
        
        <div className="space-y-4 mb-10">
          {currentQ.options.map((o: string) => (
            <button 
              key={o} 
              disabled={isAnswered} 
              onClick={() => handleSelect(o)} 
              className={`w-full text-left p-6 border-4 transition-all font-black text-lg shadow-[4px_4px_0px_black] flex items-center justify-between ${
                isAnswered 
                  ? (o === currentQ.correctAnswer 
                      ? 'bg-green-400 border-slate-900 text-slate-900 shadow-[2px_2px_0px_black]' 
                      : (o === selected ? 'bg-red-400 border-slate-900 text-white shadow-none' : 'bg-slate-50 opacity-30 border-slate-200 text-slate-400 shadow-none')) 
                  : 'bg-white text-slate-900 border-slate-900 hover:bg-blue-50 hover:translate-x-2'
              }`}
            >
              <span>{o}</span>
              {isAnswered && o === currentQ.correctAnswer && <span className="text-2xl">✔️</span>}
              {isAnswered && o === selected && o !== currentQ.correctAnswer && <span className="text-2xl">❌</span>}
            </button>
          ))}
        </div>
        
        {isAnswered && (
          <div className="mt-8 animate-pop border-t-8 border-slate-900 pt-10">
            {currentQ.explanation && (
              <div className="mb-10 p-6 bg-yellow-50 border-4 border-slate-900 font-bold italic text-sm text-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                <span className="block text-[10px] font-black uppercase mb-2 text-blue-600">Lærerens Note:</span>
                "{currentQ.explanation}"
              </div>
            )}
            <button 
              onClick={handleNext} 
              className="bg-blue-400 text-slate-900 border-4 border-slate-900 w-full py-8 text-3xl font-black uppercase italic shadow-[10px_10px_0px_black] hover:scale-[1.02] active:translate-y-2 active:shadow-none transition-all"
            >
              {idx < sessionData.length - 1 ? 'NÆSTE SPØRGSMÅL →' : 'SE DINE RESULTATER'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
