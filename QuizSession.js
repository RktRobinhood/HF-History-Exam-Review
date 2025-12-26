import React, { useState, useMemo } from 'react';
import { shuffle } from './utils.js';

export const QuizSession = ({ entries, onExit, title, onRecord, playSound }) => {
  const sessionData = useMemo(() => {
    const raw = entries.flatMap((e) => (e.questions || []).map((q) => ({ ...q, entryId: e.id, options: shuffle([...q.options]) })));
    return shuffle(raw);
  }, [entries]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const currentQ = sessionData[idx];
  if (!currentQ) return <div className="p-20 text-center"><button onClick={onExit} className="bg-slate-900 text-white p-4 border-4">GÅ TIL MENUEN</button></div>;
  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelected(option); setIsAnswered(true);
    const correct = option === currentQ.correctAnswer;
    if (correct) playSound('success'); else playSound('damage');
    onRecord(currentQ.entryId, correct);
  };
  return (
    <div className="max-w-2xl mx-auto py-8 h-full overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black]">✕ AFBRYD</button>
        <span className="font-black border-4 border-slate-900 px-6 py-2 uppercase text-xs bg-white shadow-[4px_4px_0px_black]">{idx + 1} / {sessionData.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-10 shadow-[16px_16px_0px_black] rounded-2xl">
        <p className="text-[10px] font-black text-blue-600 uppercase mb-6 tracking-widest border-b-2 border-slate-100 pb-2">{title}</p>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 leading-tight tracking-tight">{currentQ.question}</h2>
        <div className="space-y-4">
          {currentQ.options.map((o) => (
            <button key={o} disabled={isAnswered} onClick={() => handleSelect(o)} className={`w-full text-left p-6 border-4 transition-all font-black text-lg shadow-[4px_4px_0px_black] ${isAnswered ? (o === currentQ.correctAnswer ? 'bg-green-400 border-slate-900' : (o === selected ? 'bg-red-400 text-white' : 'opacity-30 grayscale')) : 'bg-white hover:bg-blue-50'}`}>
              {o}
            </button>
          ))}
        </div>
        {isAnswered && (
          <div className="mt-8 border-t-8 border-slate-900 pt-10">
            <button onClick={() => idx < sessionData.length - 1 ? (setIdx(idx + 1), setSelected(null), setIsAnswered(false)) : onExit()} className="bg-blue-400 text-slate-900 border-4 border-slate-900 w-full py-8 text-3xl font-black uppercase shadow-[10px_10px_0px_black]">{idx < sessionData.length - 1 ? 'NÆSTE →' : 'AFSLUT'}</button>
          </div>
        )}
      </div>
    </div>
  );
};