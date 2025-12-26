
import React, { useMemo } from 'react';
import { TOPICS } from './data/index.js';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  menuTab: 'games' | 'notes';
  gameSelIds: string[];
  setGameSelIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  noteSelId: string;
  setNoteSelId: (id: string) => void;
  stats: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, setIsOpen, menuTab, gameSelIds, setGameSelIds, noteSelId, setNoteSelId, stats 
}) => {
  const toggleTopic = (id: string) => {
    if (menuTab === 'games') {
      setGameSelIds((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setNoteSelId(id);
    }
  };

  const masteryPercent = useMemo(() => {
    const totalExams = 4;
    const completed = stats.completedExams?.length || 0;
    return Math.round((completed / totalExams) * 100);
  }, [stats]);

  return (
    <aside className={`border-r-4 border-slate-900 bg-slate-50 transition-all duration-300 flex flex-col h-full overflow-hidden z-30 shadow-[4px_0px_20px_rgba(0,0,0,0.1)] relative ${isOpen ? 'w-80' : 'w-20'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute -right-5 top-12 bg-white border-4 border-slate-900 w-10 h-10 rounded-full flex items-center justify-center z-40 hover:bg-blue-50 shadow-[2px_2px_0px_black] transition-transform active:translate-y-[2px]"
      >
        <span className="text-sm font-black">{isOpen ? '←' : '→'}</span>
      </button>
      
      <div className={`p-8 border-b-4 border-slate-900 bg-white ${!isOpen && 'flex justify-center p-4'}`}>
        <h1 className={`font-black uppercase italic tracking-tighter leading-none text-slate-900 transition-all ${isOpen ? 'text-3xl' : 'text-[10px]'}`}>
          {isOpen ? 'HF HISTORIE' : 'HF-H'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-8 no-scrollbar">
        <p className={`text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 tracking-widest ${!isOpen && 'hidden'}`}>
          Vælg Pensum Områder
        </p>
        {TOPICS.map(t => {
          const isSelected = menuTab === 'games' ? gameSelIds.includes(t.id) : noteSelId === t.id;
          return (
            <label key={t.id} className={`flex items-start gap-4 p-4 border-4 transition-all cursor-pointer ${isSelected ? 'border-slate-900 bg-yellow-300 shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-x-1 -translate-y-1' : 'border-slate-300 bg-white hover:border-slate-500'}`}>
              <input 
                type={menuTab === 'games' ? "checkbox" : "radio"} 
                className={isOpen ? 'mt-1 w-5 h-5 accent-slate-900' : 'hidden'} 
                checked={isSelected} 
                onChange={() => toggleTopic(t.id)} 
              />
              {isOpen ? (
                <span className={`text-[11px] uppercase leading-tight font-black ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                  {t.title}
                </span>
              ) : (
                <span className={`text-[14px] font-black w-full text-center ${isSelected ? 'text-slate-900' : 'text-slate-300'}`}>
                  {t.id}
                </span>
              )}
            </label>
          );
        })}
      </div>
      
      {isOpen && (
        <div className="p-6 border-t-4 border-slate-900 bg-white">
          <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Total Mestring</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-slate-200 border-2 border-slate-900">
              <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${masteryPercent}%` }}></div>
            </div>
            <span className="text-xs font-black italic">{stats.completedExams?.length || 0}/4</span>
          </div>
        </div>
      )}
    </aside>
  );
};
