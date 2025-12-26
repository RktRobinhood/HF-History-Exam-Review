import React, { useState, useEffect, useCallback } from 'react';
import { shuffle } from './utils.ts';

export const TimelineQuest = ({ entries, onExit, hearts, setHearts, onRecord, playSound, stats, setStats }: any) => {
  const [placed, setPlaced] = useState<any[]>([]);
  const [pool, setPool] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'victory' | 'gameover'>('playing');

  const setupLevel = useCallback(() => {
    const dated = shuffle(entries.filter((e: any) => e.date));
    if (dated.length < 5) { 
      alert("Vælg flere emner for at spille Timeline!"); 
      onExit(); 
      return; 
    }
    const levelCards = dated.slice(0, 5);
    setPlaced([levelCards[0]]);
    setPool(levelCards.slice(1));
    setSelected(null);
    setGameState('playing');
    playSound('start');
  }, [entries, onExit, playSound]);

  useEffect(() => { if (placed.length === 0 && gameState === 'playing') setupLevel(); }, [setupLevel, placed.length, gameState]);

  const handlePlace = (index: number) => {
    if (!selected) return;
    const getYear = (d: string) => {
      const match = d.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
    };
    const targetYear = getYear(selected.date);
    const prevYear = index === 0 ? -Infinity : getYear(placed[index - 1].date);
    const nextYear = index === placed.length ? Infinity : getYear(placed[index].date);

    if (targetYear >= prevYear && targetYear <= nextYear) {
      playSound('success'); 
      onRecord(selected.id, true);
      const newPlaced = [...placed]; 
      newPlaced.splice(index, 0, selected);
      setPlaced(newPlaced); 
      const newPool = pool.filter(p => p.id !== selected.id);
      setPool(newPool);
      setSelected(null);
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > (stats.bestTimeline || 0)) setStats((p: any) => ({ ...p, bestTimeline: nextStreak }));
      
      if (newPool.length === 0) {
        setGameState('victory');
        playSound('victory');
      }
    } else {
      playSound('damage'); 
      onRecord(selected.id, false);
      const nextHearts = Math.max(0, hearts - 1);
      setHearts(nextHearts);
      setSelected(null); 
      setCurrentStreak(0);
      if (nextHearts === 0) setGameState('gameover');
    }
  };

  if (gameState === 'gameover') return (
    <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-[200] p-6 animate-pop">
      <div className="bg-white border-8 border-slate-900 p-12 max-w-lg w-full text-center shadow-[30px_30px_0px_black] transform -rotate-2">
        <div className="text-9xl mb-6">📉</div>
        <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4 leading-none text-slate-900">HISTORIEN ER BRUDT</h2>
        <p className="text-xl font-bold mb-10 text-slate-500 uppercase tracking-widest leading-tight">Du forårsagede et kronologisk paradoks. Tidslinjen overlevede ikke dine fejl.</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => { setHearts(3); setupLevel(); }} className="bg-slate-900 text-white p-6 text-2xl font-black uppercase italic shadow-[6px_6px_0px_#ef4444] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">REPARÉR TIDSLINJEN</button>
          <button onClick={onExit} className="border-4 border-slate-900 p-4 font-black uppercase text-sm hover:bg-slate-50 transition-all">GIV OP / MENUEN</button>
        </div>
      </div>
    </div>
  );

  if (gameState === 'victory') return (
    <div className="fixed inset-0 bg-blue-500 flex items-center justify-center z-[200] p-6 animate-pop">
      <div className="bg-white border-8 border-slate-900 p-16 max-w-2xl w-full text-center shadow-[40px_40px_0px_black] transform rotate-2">
        <div className="text-9xl mb-6">⏳</div>
        <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none text-slate-900">TIDENS MESTER</h2>
        <p className="text-2xl font-bold mb-4 uppercase text-slate-600">Kronologien er sikret!</p>
        <div className="bg-blue-50 border-4 border-slate-900 p-6 mb-12">
            <span className="block text-sm font-black text-slate-400 uppercase mb-2">Placerede hændelser i træk</span>
            <span className="text-5xl font-black italic">{placed.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setupLevel()} className="bg-yellow-300 border-4 border-slate-900 p-6 text-xl font-black uppercase italic shadow-[6px_6px_0px_black] hover:bg-yellow-400 transition-all">NÆSTE EPOKE</button>
          <button onClick={onExit} className="border-4 border-slate-900 p-6 text-xl font-black uppercase italic hover:bg-slate-50 transition-all">HOVEDMENU</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col h-full">
      {/* STATUS BAR */}
      <div className="flex justify-between items-center mb-8 bg-slate-900 border-4 border-slate-900 p-6 shadow-[8px_8px_0px_#3b82f6] rounded-xl">
        <button onClick={onExit} className="bg-white border-4 border-slate-900 px-6 py-2 font-black uppercase text-xs hover:-translate-y-1 transition-all">← TILBAGE</button>
        
        <div className="flex items-center gap-12">
          <div className="text-right">
            <span className="block text-[10px] font-black text-blue-400 uppercase tracking-widest">Placerings-Streak</span>
            <span className="text-4xl font-black italic text-white leading-none">{currentStreak}</span>
          </div>
          
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`text-4xl transition-all duration-500 transform ${i < hearts ? 'grayscale-0 scale-110 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'grayscale opacity-20 scale-75'}`}>❤️</div>
            ))}
          </div>
        </div>
      </div>

      {/* GAME BOARD */}
      <div className="flex-1 bg-white border-4 border-slate-900 p-12 flex items-center overflow-x-auto mb-10 shadow-[20px_20px_0px_rgba(0,0,0,0.1)] rounded-3xl relative no-scrollbar">
        <div className="absolute top-4 left-6 text-[10px] font-black text-slate-200 uppercase tracking-widest">Kronologisk Tidslinje</div>
        <div className="flex items-center gap-6 min-w-max px-20">
          {placed.map((p, i) => (
            <React.Fragment key={p.id}>
              <button 
                disabled={!selected} 
                onClick={() => handlePlace(i)} 
                className={`w-20 h-20 border-4 border-dashed rounded-full flex items-center justify-center transition-all ${selected ? 'bg-yellow-300 border-slate-900 animate-pulse scale-110' : 'opacity-10 border-slate-300'}`}
              >
                <span className="text-3xl font-black">+</span>
              </button>
              
              <div className="bg-white border-4 border-slate-900 p-8 w-64 text-center shadow-[10px_10px_0px_#3b82f6] transform transition-transform hover:-rotate-1">
                <span className="block text-blue-600 font-black text-2xl italic mb-3 tracking-tighter border-b-2 border-blue-50 pb-2">{p.date}</span>
                <span className="text-sm font-black uppercase text-slate-900 leading-tight block whitespace-normal min-h-[3rem] flex items-center justify-center italic">{p.title}</span>
              </div>

              {i === placed.length - 1 && (
                <button 
                  disabled={!selected} 
                  onClick={() => handlePlace(i + 1)} 
                  className={`w-20 h-20 border-4 border-dashed rounded-full flex items-center justify-center transition-all ${selected ? 'bg-yellow-300 border-slate-900 animate-pulse scale-110' : 'opacity-10 border-slate-300'}`}
                >
                  <span className="text-3xl font-black">+</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* POOL AREA */}
      <div className="p-10 bg-slate-100 border-8 border-slate-900 shadow-[15px_15px_0px_black] rounded-3xl">
        <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Vælg den hændelse du vil placere</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {pool.map(p => (
            <button 
              key={p.id} 
              onClick={() => { setSelected(p); playSound('start'); }} 
              className={`group relative px-8 py-6 border-4 font-black uppercase text-sm transition-all ${selected?.id === p.id ? 'bg-blue-600 text-white border-slate-900 -translate-y-4 shadow-[0_15px_0_black]' : 'bg-white border-slate-900 hover:-translate-y-2 hover:bg-slate-50 shadow-[6px_6px_0px_black]'}`}
            >
              {p.title}
              {selected?.id === p.id && <div className="absolute -top-3 -right-3 text-2xl">📍</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
