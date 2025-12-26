
import React, { useState, useEffect, useCallback } from 'react';
import { shuffle } from './utils.js';

export const TimelineQuest = ({ entries, onExit, hearts, setHearts, onRecord, playSound, stats, setStats }: any) => {
  const [placed, setPlaced] = useState<any[]>([]);
  const [pool, setPool] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [shake, setShake] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const setupLevel = useCallback(() => {
    // Freshly shuffle dated entries to ensure randomness every time
    const dated = shuffle(entries.filter((e: any) => e.date));
    
    if (dated.length < 4) {
      alert("Ikke nok tidslinje-data for de valgte emner. Vælg flere emner i menuen.");
      onExit();
      return;
    }

    // 1 base card + 3 pool cards = 4 cards total
    const levelCards = dated.slice(0, 4);
    setPlaced([levelCards[0]]);
    setPool(levelCards.slice(1));
    setSelected(null);
    playSound('start');
  }, [entries, onExit, playSound]);

  useEffect(() => { 
    if (placed.length === 0) setupLevel(); 
  }, [setupLevel, placed.length]);

  const handlePlace = (index: number) => {
    if (!selected) return;
    
    const getYear = (d: string) => parseInt(d.match(/\d{4}/)?.[0] || '0');
    const targetYear = getYear(selected.date);
    const prevYear = index === 0 ? -Infinity : getYear(placed[index - 1].date);
    const nextYear = index === placed.length ? Infinity : getYear(placed[index].date);

    if (targetYear >= prevYear && targetYear <= nextYear) {
      playSound('success');
      onRecord(selected.id, true);
      
      const newPlaced = [...placed];
      newPlaced.splice(index, 0, selected);
      setPlaced(newPlaced);
      setPool(pool.filter(p => p.id !== selected.id));
      setSelected(null);
      
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > (stats.bestTimeline || 0)) {
        setStats((prev: any) => ({ ...prev, bestTimeline: nextStreak }));
      }
    } else {
      playSound('damage');
      onRecord(selected.id, false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setHearts((prev: number) => Math.max(0, prev - 1));
      setSelected(null);
      setCurrentStreak(0); // Reset streak on error
    }
  };

  if (hearts === 0) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-pop">
      <div className="text-9xl mb-8">💔</div>
      <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase italic">Game Over</h2>
      <p className="font-bold text-slate-500 mb-8 uppercase">Din streak endte på {currentStreak}</p>
      <button onClick={() => { setHearts(3); setupLevel(); }} className="bg-red-300 px-12 py-6 text-2xl border-4 border-slate-900 font-black shadow-[8px_8px_0px_black] uppercase italic">PRØV IGEN</button>
      <button onClick={onExit} className="block w-full mt-6 text-slate-400 font-black uppercase text-xs">Menu</button>
    </div>
  );

  if (pool.length === 0 && placed.length > 1) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-pop">
      <div className="text-8xl mb-8">🛡️</div>
      <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase italic">Level Klaret!</h2>
      <p className="text-2xl font-black text-blue-600 mb-10">STREAK: {currentStreak} 🔥</p>
      <div className="flex flex-col gap-4">
        <button onClick={() => setupLevel()} className="bg-green-300 px-16 py-8 text-2xl border-4 border-slate-900 font-black shadow-[12px_12px_0px_black] uppercase italic">NÆSTE LEVEL →</button>
        <button onClick={onExit} className="text-slate-400 font-black uppercase text-xs mt-4">Afslut</button>
      </div>
    </div>
  );

  return (
    <div className={`max-w-6xl mx-auto py-8 px-4 h-full flex flex-col ${shake ? 'animate-bounce' : ''}`}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <button onClick={onExit} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black]">✕ LUK</button>
          <div className="mt-4 flex gap-4">
            <div className="bg-blue-600 text-white px-3 py-1 text-xs font-black italic shadow-[2px_2px_0px_black]">BEST: {stats.bestTimeline || 0}</div>
            <div className="bg-orange-500 text-white px-3 py-1 text-xs font-black italic shadow-[2px_2px_0px_black]">STREAK: {currentStreak}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => <span key={i} className="text-3xl filter drop-shadow-sm">{i < hearts ? '❤️' : '🖤'}</span>)}
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 border-4 border-slate-900 p-12 flex items-center justify-center overflow-x-auto mb-10 shadow-inner rounded-xl relative">
        <div className="flex items-center gap-2 min-w-max px-20">
          {placed.map((p, i) => (
            <React.Fragment key={p.id}>
              <button 
                disabled={!selected} 
                onClick={() => handlePlace(i)} 
                className={`w-14 h-14 border-4 border-dashed rounded-full transition-all flex items-center justify-center font-black text-xl ${selected ? 'bg-blue-300 border-slate-900 hover:scale-125 shadow-md' : 'opacity-20 border-slate-300'}`}
              >
                +
              </button>
              <div className="bg-white border-4 border-slate-900 p-5 w-52 text-center shadow-[6px_6px_0px_black] transform transition-transform hover:rotate-1">
                <span className="block text-blue-600 font-black text-sm border-b-2 border-slate-100 mb-3 italic">{p.date}</span>
                <span className="text-[11px] font-black uppercase text-slate-900 leading-tight block whitespace-normal">{p.title}</span>
              </div>
              {i === placed.length - 1 && (
                <button 
                  disabled={!selected} 
                  onClick={() => handlePlace(i + 1)} 
                  className={`w-14 h-14 border-4 border-dashed rounded-full transition-all flex items-center justify-center font-black text-xl ${selected ? 'bg-blue-300 border-slate-900 hover:scale-125 shadow-md' : 'opacity-20 border-slate-300'}`}
                >
                  +
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-8 bg-white border-4 border-slate-900 flex flex-wrap justify-center gap-6 shadow-[12px_12px_0px_black] rounded-xl">
        <p className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vælg begivenhed og placer på tidslinjen</p>
        {pool.map(p => (
          <button 
            key={p.id} 
            onClick={() => setSelected(p)} 
            className={`px-8 py-5 border-4 font-black uppercase text-sm transition-all ${selected?.id === p.id ? 'bg-blue-300 border-slate-900 scale-110 shadow-[6px_6px_0px_black]' : 'bg-slate-50 border-slate-300 hover:border-slate-900'}`}
          >
            {p.title.replace(/\d{4}/g, '').trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
