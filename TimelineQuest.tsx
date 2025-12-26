import React, { useState, useEffect, useCallback } from 'react';
import { shuffle } from './utils.ts';

export const TimelineQuest = ({ entries, onExit, hearts, setHearts, onRecord, playSound, stats, setStats }: any) => {
  const [placed, setPlaced] = useState<any[]>([]);
  const [pool, setPool] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [currentStreak, setCurrentStreak] = useState(0);

  const setupLevel = useCallback(() => {
    const dated = shuffle(entries.filter((e: any) => e.date));
    if (dated.length < 4) { alert("Vælg flere emner!"); onExit(); return; }
    const levelCards = dated.slice(0, 4);
    setPlaced([levelCards[0]]);
    setPool(levelCards.slice(1));
    setSelected(null);
    playSound('start');
  }, [entries, onExit, playSound]);

  useEffect(() => { if (placed.length === 0) setupLevel(); }, [setupLevel, placed.length]);

  const handlePlace = (index: number) => {
    if (!selected) return;
    const getYear = (d: string) => parseInt(d.match(/\d{4}/)?.[0] || '0');
    const targetYear = getYear(selected.date);
    const prevYear = index === 0 ? -Infinity : getYear(placed[index - 1].date);
    const nextYear = index === placed.length ? Infinity : getYear(placed[index].date);
    if (targetYear >= prevYear && targetYear <= nextYear) {
      playSound('success'); onRecord(selected.id, true);
      const newPlaced = [...placed]; newPlaced.splice(index, 0, selected);
      setPlaced(newPlaced); setPool(pool.filter(p => p.id !== selected.id));
      setSelected(null);
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > (stats.bestTimeline || 0)) setStats((p: any) => ({ ...p, bestTimeline: nextStreak }));
    } else {
      playSound('damage'); onRecord(selected.id, false);
      setHearts((p: number) => Math.max(0, p - 1));
      setSelected(null); setCurrentStreak(0);
    }
  };

  if (hearts === 0) return <div className="text-center p-20"><h2 className="text-4xl font-black">GAME OVER</h2><button onClick={() => { setHearts(3); setupLevel(); }} className="bg-red-300 p-6 border-4 border-slate-900">PRØV IGEN</button></div>;
  if (pool.length === 0 && placed.length > 1) return <div className="text-center p-20"><button onClick={() => setupLevel()} className="bg-green-300 p-8 border-4 border-slate-900">NÆSTE LEVEL</button></div>;

  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col h-full">
      <div className="flex justify-between mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs">LUK</button>
        <div className="flex gap-2 font-black uppercase text-xs">STREAK: {currentStreak} | HEARTS: {hearts}</div>
      </div>
      <div className="flex-1 bg-slate-50 border-4 border-slate-900 p-12 flex items-center overflow-x-auto mb-10 shadow-inner rounded-xl">
        <div className="flex items-center gap-2 min-w-max px-20">
          {placed.map((p, i) => (
            <React.Fragment key={p.id}>
              <button disabled={!selected} onClick={() => handlePlace(i)} className={`w-14 h-14 border-4 border-dashed rounded-full ${selected ? 'bg-blue-300 border-slate-900' : 'opacity-20 border-slate-300'}`}>+</button>
              <div className="bg-white border-4 border-slate-900 p-5 w-52 text-center shadow-[6px_6px_0px_black]">
                <span className="block text-blue-600 font-black text-sm italic">{p.date}</span>
                <span className="text-[11px] font-black uppercase text-slate-900 leading-tight block whitespace-normal">{p.title}</span>
              </div>
              {i === placed.length - 1 && <button disabled={!selected} onClick={() => handlePlace(i + 1)} className={`w-14 h-14 border-4 border-dashed rounded-full ${selected ? 'bg-blue-300 border-slate-900' : 'opacity-20 border-slate-300'}`}>+</button>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-8 bg-white border-4 border-slate-900 flex flex-wrap justify-center gap-6 shadow-[8px_8px_0px_black]">
        {pool.map(p => <button key={p.id} onClick={() => setSelected(p)} className={`px-8 py-5 border-4 font-black uppercase text-sm ${selected?.id === p.id ? 'bg-blue-300' : 'bg-slate-50'}`}>{p.title}</button>)}
      </div>
    </div>
  );
};