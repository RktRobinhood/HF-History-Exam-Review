import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES } from './data/index.js';
import { playSound, shuffle } from './utils.js';

// Component Modules
import { Sidebar } from './Sidebar.js';
import { FlashcardSession } from './FlashcardSession.js';
import { QuizSession } from './QuizSession.js';
import { TimelineQuest } from './TimelineQuest.js';
import { SourceAnalysis } from './SourceAnalysis.js';
import { ExamMaster } from './ExamMaster.js';
import { NoteViewer } from './NoteViewer.js';

const STORAGE_KEY = 'HF_HISTORY_APP_DATA_PERSISTENT';

const App = () => {
  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"completedExams": [], "masteryPoints": 0, "bestTimeline": 0}');
    } catch (e) {
      return { completedExams: [], masteryPoints: 0, bestTimeline: 0 };
    }
  });
  
  const [gameSelIds, setGameSelIds] = useState(() => TOPICS.map(t => t.id));
  const [noteSelId, setNoteSelId] = useState('1'); 
  const [view, setView] = useState('menu');
  const [menuTab, setMenuTab] = useState<'games' | 'notes'>('games');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hearts, setHearts] = useState(3);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const filtered = useMemo(() => ({
    entries: HISTORY_ENTRIES.filter(e => gameSelIds.includes(e.topicId)),
    sources: PRIMARY_SOURCES.filter(e => gameSelIds.includes(e.topicId))
  }), [gameSelIds]);

  const recordStat = (id: string, ok: boolean) => {
    setStats((prev: any) => {
      const s = prev[id] || { count: 0, correct: 0 };
      return { 
        ...prev, 
        [id]: { count: s.count + 1, correct: s.correct + (ok ? 1 : 0) },
        masteryPoints: (prev.masteryPoints || 0) + (ok ? 1 : 0)
      };
    });
  };

  const renderViewContent = () => {
    switch (view) {
      case 'flashcards': 
        return <FlashcardSession 
          entries={shuffle([...filtered.entries])} 
          onExit={() => setView('menu')} 
          onRecord={recordStat} 
          playSound={playSound} 
        />;
      case 'quiz': 
        return <QuizSession 
          entries={filtered.entries} 
          title="Videns Quiz" 
          onExit={() => setView('menu')} 
          onRecord={recordStat} 
          playSound={playSound}
        />;
      case 'timeline':
        return <TimelineQuest 
          entries={filtered.entries} 
          hearts={hearts} 
          setHearts={setHearts} 
          onExit={() => setView('menu')} 
          onRecord={recordStat} 
          playSound={playSound}
          stats={stats}
          setStats={setStats}
        />;
      case 'sources':
        return <SourceAnalysis 
          sources={filtered.sources} 
          onExit={() => setView('menu')} 
          onRecord={recordStat} 
          playSound={playSound}
        />;
      case 'exam':
        return <ExamMaster 
          stats={stats} 
          setStats={setStats} 
          onExit={() => setView('menu')} 
          onRecord={recordStat} 
          playSound={playSound}
        />;
      default:
        return (
          <div className="flex flex-col h-full animate-pop max-w-6xl mx-auto w-full">
            <div className="mb-12 flex justify-start items-center border-b-8 border-slate-900 pb-8 gap-6">
              <button onClick={() => setMenuTab('games')} className={`px-12 py-4 border-4 border-slate-900 text-2xl font-black italic tracking-tighter transition-all ${menuTab === 'games' ? 'bg-slate-900 text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[6px_6px_0px_black]'}`}>🕹️ TRÆNING</button>
              <button onClick={() => setMenuTab('notes')} className={`px-12 py-4 border-4 border-slate-900 text-2xl font-black italic tracking-tighter transition-all ${menuTab === 'notes' ? 'bg-slate-900 text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[6px_6px_0px_black]'}`}>📖 PENSUM</button>
            </div>

            {menuTab === 'games' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24 auto-rows-fr">
                <button onClick={() => setView('flashcards')} className="bg-white border-4 border-slate-900 p-8 text-left hover:bg-slate-50 transition-all hover:-translate-y-2 shadow-[12px_12px_0px_black] group flex flex-col h-full">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🗂️</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter text-slate-900 underline decoration-4 decoration-blue-200">Flashcards</h3>
                    <p className="text-[11px] font-bold text-slate-500 mb-8 uppercase leading-relaxed">Hurtig drill af kernebegreber og årstal.</p>
                  </div>
                  <div className="bg-blue-300 border-4 border-slate-900 px-6 py-4 text-center font-black text-lg shadow-[4px_4px_0px_black] text-slate-900 mt-auto">START DRILL</div>
                </button>
                
                <button onClick={() => setView('quiz')} className="bg-white border-4 border-slate-900 p-8 text-left hover:bg-slate-50 transition-all hover:-translate-y-2 shadow-[12px_12px_0px_black] group flex flex-col h-full">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🎯</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter text-slate-900 underline decoration-4 decoration-yellow-200">Videns Quiz</h3>
                    <p className="text-[11px] font-bold text-slate-500 mb-8 uppercase leading-relaxed">Test din hukommelse på tværs af facts.</p>
                  </div>
                  <div className="bg-yellow-300 border-4 border-slate-900 px-6 py-4 text-center font-black text-lg shadow-[4px_4px_0px_black] text-slate-900 mt-auto">TAG QUIZ</div>
                </button>

                <button onClick={() => setView('timeline')} className="bg-white border-4 border-slate-900 p-10 text-left md:col-span-2 flex items-center gap-10 hover:bg-slate-50 transition-all hover:-translate-y-2 shadow-[16px_16px_0px_black] group h-full">
                  <div className="text-8xl group-hover:rotate-12 transition-transform shrink-0">⚔️</div>
                  <div className="flex-1">
                    <h3 className="text-4xl font-black mb-3 uppercase italic tracking-tighter text-slate-900 underline decoration-8 decoration-green-200 leading-none">Timeline Quest</h3>
                    <p className="text-sm font-bold mb-8 text-slate-500 uppercase">Træn hændelsernes rækkefølge. Best: {stats.bestTimeline || 0}</p>
                    <div className="bg-green-300 border-4 border-slate-900 px-10 py-5 text-center font-black text-xl shadow-[8px_8px_0px_black] inline-block text-slate-900">START MISSION</div>
                  </div>
                </button>

                <button onClick={() => setView('sources')} className="bg-white border-4 border-slate-900 p-8 text-left hover:bg-slate-50 transition-all hover:-translate-y-2 shadow-[12px_12px_0px_black] group flex flex-col h-full">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📜</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter text-slate-900 underline decoration-4 decoration-slate-400">Kilde Kritik</h3>
                    <p className="text-[11px] font-bold text-slate-500 mb-8 uppercase leading-relaxed">Gå i dybden med de primære kilder.</p>
                  </div>
                  <div className="bg-slate-100 border-4 border-slate-900 px-6 py-4 text-center font-black text-lg shadow-[4px_4px_0px_black] text-slate-900 mt-auto">ANALYSÉR</div>
                </button>

                <button onClick={() => setView('exam')} className="bg-slate-900 border-4 border-slate-900 p-8 text-left hover:bg-slate-800 transition-all hover:-translate-y-2 shadow-[12px_12px_0px_#3b82f6] group flex flex-col h-full">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter text-white underline decoration-4 decoration-blue-500">Eksamenstræner</h3>
                    <p className="text-[11px] font-bold text-white mb-8 uppercase leading-relaxed">Simulering af mundtlig eksamen med karakter.</p>
                  </div>
                  <div className="bg-blue-400 text-slate-900 border-4 border-slate-900 px-6 py-4 text-center font-black text-lg shadow-[4px_4px_0px_white] mt-auto">GÅ TIL EKSAMEN</div>
                </button>
              </div>
            ) : <div className="h-full flex flex-col pb-24"><NoteViewer selectedTopicId={noteSelId} /></div>}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative font-sans text-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        menuTab={menuTab as any} 
        gameSelIds={gameSelIds} 
        setGameSelIds={setGameSelIds} 
        noteSelId={noteSelId} 
        setNoteSelId={setNoteSelId} 
        stats={stats} 
      />
      <main className="flex-1 p-4 md:p-12 bg-slate-100 overflow-y-auto no-scrollbar">
        {renderViewContent()}
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { createRoot(rootElement).render(<App />); }