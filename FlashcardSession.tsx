
import React, { useState } from 'react';

export const FlashcardSession = ({ entries, onExit, onRecord }: any) => {
  const [queue, setQueue] = useState([...entries]);
  const [revealed, setRevealed] = useState(false);
  const current = queue[0];
  if (!current) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-pop">
      <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">Session Færdig!</h2>
      <button onClick={onExit} className="bg-blue-300 border-4 border-slate-900 px-12 py-6 text-xl font-black shadow-[8px_8px_0px_black] uppercase italic">TILBAGE TIL DOCK</button>
    </div>
  );
  const handleResponse = (ok: boolean) => {
    onRecord(current.id, ok);
    if (ok) { setRevealed(false); setQueue((prev: any[]) => prev.slice(1)); } 
    else { setRevealed(false); }
  };
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black]">✕ LUK</button>
        <span className="font-black text-slate-900 uppercase text-xs bg-white px-4 py-2 border-4 border-slate-900 shadow-[4px_4px_0px_black]">Kort tilbage: {queue.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-10 min-h-[400px] flex flex-col justify-center text-center shadow-[12px_12px_0px_black] rounded-xl transform transition-transform">
        {!revealed ? (
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-4 border-b-2 border-slate-50 pb-2">Hvad betyder...?</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-16 px-4 uppercase leading-tight tracking-tighter">{current.title}</h2>
            <button onClick={() => setRevealed(true)} className="bg-blue-300 border-4 border-slate-900 w-full py-8 text-2xl font-black uppercase italic shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Vis Svar</button>
          </div>
        ) : (
          <div className="animate-pop p-4">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 text-left border-l-4 border-blue-300 pl-2">Definition</h3>
            <p className="text-xl md:text-2xl text-slate-900 font-bold mb-12 italic leading-relaxed text-left border-l-8 border-blue-200 pl-6">"{current.description}"</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => handleResponse(false)} className="bg-red-400 text-white border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-red-500">IGEN</button>
              <button onClick={() => handleResponse(false)} className="bg-yellow-300 border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-yellow-400">SVÆRT</button>
              <button onClick={() => handleResponse(true)} className="bg-green-400 border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-green-500">OK</button>
              <button onClick={() => handleResponse(true)} className="bg-blue-400 text-white border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-blue-500">LET</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
