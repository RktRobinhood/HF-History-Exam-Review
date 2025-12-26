
import React, { useState, useMemo } from 'react';
import { shuffle } from './utils.js';

export const SourceAnalysis = ({ sources, onExit, onRecord, playSound }: any) => {
  // Shuffle list once to keep a stable session order
  const sessionSources = useMemo(() => shuffle([...sources]), [sources]);
  const [curr, setCurr] = useState(0);
  
  // Track answers specifically for the active source to prevent leakage
  const [activeAnswers, setActiveAnswers] = useState<Record<string, string>>({});
  
  const currentSource = sessionSources[curr];

  // Memoize question data for the current source instance only
  const currentQuestions = useMemo(() => {
    if (!currentSource?.questions) return [];
    return currentSource.questions.map((q: any, i: number) => ({
      ...q,
      uniqueId: `${currentSource.id}-q${i}`,
      localIndex: i,
      shuffledOptions: shuffle([...q.options])
    }));
  }, [currentSource?.id]);

  const handleAnswer = (localIndex: number, selected: string) => {
    if (activeAnswers[localIndex] !== undefined) return;
    
    const q = currentSource.questions[localIndex];
    // Use a more robust check to handle potential tiny typos in data (though data should be fixed)
    const ok = selected.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    
    if (ok) playSound('success'); else playSound('damage');
    
    setActiveAnswers(prev => ({ ...prev, [localIndex]: selected }));
    onRecord(currentSource.id, ok);
  };

  const isComplete = useMemo(() => {
    if (!currentSource?.questions) return false;
    return currentSource.questions.every((_: any, i: number) => activeAnswers[i] !== undefined);
  }, [activeAnswers, currentSource]);

  const handleNext = () => {
    if (curr < sessionSources.length - 1) {
      setCurr(prev => prev + 1);
      setActiveAnswers({}); // Hard reset state for the next source
    } else {
      onExit();
    }
  };

  if (!currentSource) return (
    <div className="p-20 text-center animate-pop">
      <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tighter">Vælg emner i menuen for at starte.</h2>
      <button onClick={onExit} className="bg-slate-900 text-white border-4 border-slate-900 px-8 py-4 font-black shadow-[4px_4px_0px_black]">TIL MENUEN</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 pb-48 h-full overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900">✕ AFSLUT ANALYSE</button>
        <span className="font-black text-slate-900 border-4 border-slate-900 px-6 py-2 uppercase text-xs bg-yellow-300 shadow-[4px_4px_0px_black]">KILDE {curr + 1} / {sessionSources.length}</span>
      </div>

      <div className="bg-white border-4 border-slate-900 p-8 md:p-12 mb-10 shadow-[20px_20px_0px_black] rounded-3xl relative">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter underline decoration-blue-400 decoration-8 leading-tight">📜 {currentSource.title}</h2>
        
        <div className="bg-slate-50 border-4 border-slate-900 p-8 md:p-12 mb-12 text-slate-900 font-serif italic text-xl md:text-2xl leading-relaxed whitespace-pre-wrap border-l-[16px] border-l-slate-900 shadow-inner">
          "{currentSource.text}"
        </div>

        <div className="space-y-20">
          {currentQuestions.map((q: any) => {
            const selectedValue = activeAnswers[q.localIndex];
            return (
              <div key={q.uniqueId} className="border-t-8 border-slate-900 pt-16 animate-pop">
                <p className="font-black text-xl md:text-2xl text-slate-900 mb-10 uppercase tracking-tight flex gap-4">
                  <span className="bg-slate-900 text-white w-12 h-12 flex items-center justify-center text-lg shrink-0 shadow-[4px_4px_0px_blue]">{q.localIndex + 1}</span>
                  <span>{q.question}</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {q.shuffledOptions.map((o: string) => (
                    <button 
                      key={o} 
                      disabled={selectedValue !== undefined} 
                      onClick={() => handleAnswer(q.localIndex, o)} 
                      className={`p-6 border-4 text-left text-sm font-black transition-all shadow-[6px_6px_0px_black] flex items-center justify-between ${
                        selectedValue !== undefined 
                          ? (o.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() 
                              ? 'bg-green-400 border-slate-900 text-slate-900 shadow-[2px_2px_0px_black]' 
                              : (o === selectedValue ? 'bg-red-400 border-slate-900 text-white shadow-none' : 'bg-slate-50 opacity-60 border-slate-200 text-slate-600 shadow-none grayscale')) 
                          : 'bg-white text-slate-900 border-slate-900 hover:bg-blue-50 hover:translate-x-2'
                      }`}
                    >
                      <span>{o}</span>
                      {selectedValue !== undefined && o.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() && <span className="text-2xl">✔️</span>}
                    </button>
                  ))}
                </div>
                {selectedValue !== undefined && q.explanation && (
                  <div className="mt-8 p-8 bg-yellow-50 border-4 border-slate-900 font-bold italic text-base text-slate-900 animate-pop shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                    <span className="block text-[10px] font-black uppercase mb-3 text-blue-600 tracking-widest">Kildekritisk Vinkel:</span>
                    "{q.explanation}"
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-24 pt-12 border-t-8 border-slate-900 flex flex-col md:flex-row justify-between items-center gap-10">
          <button 
            disabled={curr === 0} 
            onClick={() => { setCurr(curr - 1); setActiveAnswers({}); }} 
            className="font-black text-slate-400 uppercase disabled:opacity-0 hover:text-slate-900 flex items-center gap-2 border-4 border-transparent px-6 py-3"
          >
            ← Forrige Kilde
          </button>
          
          <button 
            onClick={handleNext} 
            disabled={!isComplete}
            className={`px-16 py-8 border-4 border-slate-900 font-black shadow-[12px_12px_0px_black] uppercase italic text-xl transition-all ${isComplete ? 'bg-blue-400 text-slate-900 hover:scale-105 active:translate-y-2 active:shadow-none' : 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed grayscale'}`}
          >
            {curr < sessionSources.length - 1 ? 'NÆSTE KILDE →' : 'FÆRDIG MED SESSION'}
          </button>
        </div>
      </div>
    </div>
  );
};
