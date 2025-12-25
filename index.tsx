import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES, EXAM_INTERPRETATIONS } from './data/index.js';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const STORAGE_KEY = 'hf_historie_master_v10_final';

// Helper to clean titles for the timeline game (removes dates like 1888 or (1700-1800))
const sanitizeTitle = (title) => {
  return title.replace(/\s*\(?\d{4}(?:-\d{2,4})?\)?/g, '').trim();
};

const getYearFromDate = (dateStr) => {
  if (!dateStr) return 0;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
};

// --- SUB-COMPONENTS ---

const AnkiFlashcards = ({ entries, onExit, onRecord }) => {
  const [curr, setCurr] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const entry = entries[curr];
  
  if (!entry) return <div className="p-20 text-center font-black text-slate-400">Ingen kort fundet.</div>;

  const handleLevel = (isOk) => {
    onRecord(entry.id, isOk);
    setFlipped(false);
    if (curr < entries.length - 1) setCurr(curr + 1);
    else onExit();
  };

  return (
    <div className="max-w-3xl mx-auto py-4 animate-pop min-h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className="text-slate-600 font-black text-xs uppercase hover:text-indigo-600 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 transition-all">✕ Afslut</button>
        <span className="text-xs font-black text-indigo-600 bg-white px-6 py-3 rounded-2xl shadow-sm tracking-widest">{curr + 1} / {entries.length}</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div 
          className="relative perspective-1000 w-full max-w-2xl h-[500px] cursor-pointer mb-12" 
          onClick={() => setFlipped(!flipped)}
        >
          <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[4rem] shadow-2xl border-4 border-slate-50 flex flex-col items-center justify-center p-16 text-center">
              <span className="text-xs font-black uppercase text-indigo-500 mb-8 tracking-[0.3em]">{entry.type === 'event' ? 'Historisk Begivenhed' : 'Begreb'}</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight italic tracking-tighter">{entry.title}</h2>
              <div className="mt-16 flex items-center gap-3 text-slate-300">
                <span className="w-8 h-[2px] bg-slate-100"></span>
                <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Klik for svar</p>
                <span className="w-8 h-[2px] bg-slate-100"></span>
              </div>
            </div>
            {/* Back */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-[4rem] shadow-2xl p-16 flex flex-col items-center justify-center text-center text-white">
               <div className="overflow-y-auto max-h-full py-4 w-full">
                  <p className="text-2xl md:text-3xl leading-relaxed font-medium mb-12 text-slate-100">{entry.description}</p>
                  {entry.date && <div className="inline-block px-10 py-4 bg-indigo-600 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-xl">Tidspunkt: {entry.date}</div>}
               </div>
            </div>
          </div>
        </div>

        {flipped && (
          <div className="grid grid-cols-2 gap-8 w-full max-w-2xl animate-pop">
            <button onClick={() => handleLevel(false)} className="py-8 bg-white text-rose-600 rounded-[2.5rem] font-black border-2 border-rose-100 hover:bg-rose-50 transition-all text-sm uppercase shadow-lg flex flex-col items-center">
                <span className="text-2xl mb-1">🔄</span>
                Igen (Svært)
            </button>
            <button onClick={() => handleLevel(true)} className="py-8 bg-white text-emerald-600 rounded-[2.5rem] font-black border-2 border-emerald-100 hover:bg-emerald-50 transition-all text-sm uppercase shadow-lg flex flex-col items-center">
                <span className="text-2xl mb-1">✅</span>
                Nemt (Forstået)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Quiz = ({ questions, onExit, onRecord, title }) => {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  const opts = useMemo(() => q?.options ? shuffle(q.options) : [], [q]);

  if (!q) return <div className="p-20 text-center font-black text-slate-400">Quiz færdig!</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 animate-pop">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="text-slate-600 font-black text-xs uppercase hover:text-indigo-600 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">✕ Luk</button>
        <span className="text-xs font-black text-indigo-600 bg-white px-5 py-3 rounded-2xl shadow-sm">{idx + 1} / {questions.length}</span>
      </div>
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">{title}</p>
        <h2 className="text-2xl md:text-3xl font-black mb-10 text-slate-800 leading-snug italic tracking-tight">{q.question}</h2>
        <div className="space-y-4">
          {opts.map((o) => {
            const isCorrect = o === q.correctAnswer;
            const isSelected = o === sel;
            let btnClass = "border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/20 text-slate-700";
            
            if (done) {
              if (isCorrect) btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md ring-2 ring-emerald-100";
              else if (isSelected) btnClass = "border-rose-500 bg-rose-50 text-rose-700 opacity-100";
              else btnClass = "border-slate-50 opacity-30 grayscale pointer-events-none";
            }

            return (
              <button 
                key={o} 
                disabled={done}
                onClick={() => { setSel(o); setDone(true); onRecord(q.entryId || 'q', isCorrect); }} 
                className={`w-full p-6 text-left rounded-[2rem] border-2 transition-all font-bold text-lg flex items-center gap-4 ${btnClass}`}
              >
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black ${done && isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {done && isCorrect ? '✓' : (isSelected ? '🎯' : '•')}
                </span>
                <span className="text-sm md:text-base">{o}</span>
              </button>
            );
          })}
        </div>
      </div>
      {done && (
        <div className="mt-8 animate-pop">
          {q.explanation && <div className="p-8 bg-amber-50 rounded-[2.5rem] mb-6 text-amber-900 text-xs font-bold border border-amber-100 leading-relaxed">💡 Vidste du: {q.explanation}</div>}
          <button 
            onClick={() => { if (idx < questions.length - 1) { setIdx(idx + 1); setSel(null); setDone(false); } else onExit(); }} 
            className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-black shadow-2xl transition-all border-b-8 border-slate-700 active:border-b-0 active:translate-y-1"
          >
            Næste Spørgsmål →
          </button>
        </div>
      )}
    </div>
  );
};

const TimelineGame = ({ entries, onExit }) => {
  const dated = useMemo(() => 
    entries.filter(e => e.date)
           .sort((a, b) => getYearFromDate(a.date) - getYearFromDate(b.date)), 
    [entries]
  );
  
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [message, setMessage] = useState('Vælg en brik fra puljen');

  // Initialization: Pick 2 random anchors from the pool
  useEffect(() => {
    if (dated.length >= 4) {
      const shuffled = shuffle([...dated]);
      const anchor1 = shuffled[0];
      const anchor2 = shuffled[1];
      
      // Sort anchors so timeline starts correctly
      const initialPlaced = [anchor1, anchor2].sort((a, b) => getYearFromDate(a.date) - getYearFromDate(b.date));
      
      setPlaced(initialPlaced);
      setPool(shuffle(dated.filter(d => d.id !== anchor1.id && d.id !== anchor2.id)));
    } else {
      setPool(shuffle(dated));
    }
  }, [dated]);

  const handlePlace = (index) => {
    if (!selectedPiece) return;
    
    const correctYear = getYearFromDate(selectedPiece.date);
    const beforeYear = index === 0 ? -Infinity : getYearFromDate(placed[index - 1].date);
    const afterYear = index === placed.length ? Infinity : getYearFromDate(placed[index].date);

    if (correctYear >= beforeYear && correctYear <= afterYear) {
      const newPlaced = [...placed];
      newPlaced.splice(index, 0, selectedPiece);
      setPlaced(newPlaced);
      setPool(pool.filter(p => p.id !== selectedPiece.id));
      setSelectedPiece(null);
      setMessage('🎯 Flot! Placeret korrekt.');
    } else {
      setPool(pool.filter(p => p.id !== selectedPiece.id));
      setSelectedPiece(null);
      setMessage('❌ Forkert rækkefølge! Brikken er kasseret.');
    }
  };

  const resetGame = () => {
    const shuffled = shuffle([...dated]);
    const initialPlaced = [shuffled[0], shuffled[1]].sort((a, b) => getYearFromDate(a.date) - getYearFromDate(b.date));
    setPlaced(initialPlaced);
    setPool(shuffle(dated.filter(d => d.id !== initialPlaced[0].id && d.id !== initialPlaced[1].id)));
    setSelectedPiece(null);
    setMessage('Nyt spil startet.');
  };

  if (placed.length >= 8 || (pool.length === 0 && selectedPiece === null)) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-pop">
         <div className="bg-indigo-600 p-20 rounded-[4rem] text-white shadow-2xl">
            <div className="text-8xl mb-8">🏆</div>
            <h3 className="text-5xl font-black mb-6 italic tracking-tight">Spillet er Slut!</h3>
            <p className="text-indigo-100 text-xl font-medium mb-12 opacity-90">Du fik placeret {placed.length - 2} brikker korrekt på tidslinjen.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={resetGame} className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black uppercase tracking-widest hover:scale-105 shadow-xl transition-all">Prøv Igen</button>
              <button onClick={onExit} className="px-12 py-6 bg-indigo-900 text-white rounded-3xl font-black uppercase tracking-widest hover:scale-105 shadow-xl transition-all">Menu</button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center mb-10">
            <button onClick={onExit} className="text-slate-600 font-black text-xs uppercase hover:text-indigo-600 bg-white px-5 py-3 rounded-2xl shadow-md border border-slate-100">✕ Luk</button>
            <div className="text-center">
              <h2 className="text-3xl font-black italic text-slate-900 tracking-tight">Tidslinje Brættet</h2>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 h-4 ${message.includes('❌') ? 'text-rose-500' : 'text-indigo-600'}`}>{message}</p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl shadow-md border-2 border-indigo-50">
               <span className="text-xs font-black text-indigo-600">Nye korrekte: {placed.length - 2} / 6</span>
            </div>
        </div>

        <div className="mb-16 bg-white/60 p-10 rounded-[4rem] border-4 border-dashed border-slate-200">
            <div className="flex flex-wrap gap-y-12 items-center justify-center">
                {placed.map((p, i) => (
                    <React.Fragment key={p.id}>
                        <button 
                          onClick={() => handlePlace(i)}
                          disabled={!selectedPiece}
                          className={`w-12 h-12 rounded-full border-4 border-dashed mx-2 transition-all flex items-center justify-center text-xl font-black ${selectedPiece ? 'border-indigo-400 bg-indigo-50 text-indigo-400 hover:scale-110 hover:border-indigo-600 hover:bg-white animate-pulse' : 'border-slate-200 text-transparent opacity-0 pointer-events-none'}`}
                        >
                          +
                        </button>
                        
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-4 border-indigo-500 text-center text-white min-w-[200px] animate-pop relative">
                            <span className="block text-indigo-400 font-black text-xs mb-2 tracking-widest">{p.date}</span>
                            <span className="text-[11px] font-black leading-relaxed block uppercase tracking-tight italic">{sanitizeTitle(p.title)}</span>
                        </div>

                        {i === placed.length - 1 && (
                            <button 
                              onClick={() => handlePlace(i + 1)}
                              disabled={!selectedPiece}
                              className={`w-12 h-12 rounded-full border-4 border-dashed mx-2 transition-all flex items-center justify-center text-xl font-black ${selectedPiece ? 'border-indigo-400 bg-indigo-50 text-indigo-400 hover:scale-110 hover:border-indigo-600 hover:bg-white animate-pulse' : 'border-slate-200 text-transparent opacity-0 pointer-events-none'}`}
                        >
                          +
                        </button>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {pool.length > 0 && (
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100">
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10">Dine Brikker (Hvad skete hvornår?)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {pool.map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => { setSelectedPiece(item); setMessage(`Placér "${sanitizeTitle(item.title)}" på linjen`); }} 
                          className={`p-8 rounded-[2rem] border-2 transition-all text-center group shadow-sm flex flex-col items-center justify-center min-h-[140px] ${selectedPiece?.id === item.id ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-xl ring-4 ring-indigo-100' : 'border-slate-100 bg-white hover:border-indigo-300'}`}
                        >
                            <div className="w-10 h-1 bg-slate-100 mb-6 rounded-full group-hover:bg-indigo-200"></div>
                            <span className="font-black text-slate-800 text-[11px] leading-tight block uppercase tracking-tight">{sanitizeTitle(item.title)}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

const SourceStudy = ({ sources, onExit }) => {
    const [idx, setIdx] = useState(0);
    const [feedback, setFeedback] = useState({});
    const s = sources[idx];
    if (!s) return <div className="p-20 text-center font-black text-slate-400">Ingen kilder fundet.</div>;

    const handleSourceAnswer = (qId, option, correct) => {
        if (feedback[qId]) return;
        setFeedback(prev => ({...prev, [qId]: option === correct ? 'correct' : 'wrong'}));
    };

    return (
        <div className="max-w-4xl mx-auto py-8 animate-pop">
            <div className="flex justify-between items-center mb-8">
                <button onClick={onExit} className="text-slate-600 font-black text-xs uppercase hover:text-indigo-600 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">✕ Luk</button>
                <span className="bg-white px-5 py-3 rounded-2xl text-xs font-black text-indigo-600 shadow-sm border-2 border-indigo-50">{idx + 1} / {sources.length}</span>
            </div>
            <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100">
                <h2 className="text-4xl font-black text-slate-900 mb-10 italic tracking-tight">📜 {s.title}</h2>
                <div className="bg-indigo-50/50 p-10 rounded-[3rem] border-l-8 border-indigo-500 mb-12 shadow-sm">
                    <p className="text-2xl text-slate-800 italic leading-relaxed font-medium">"{s.text}"</p>
                </div>
                <div className="space-y-16">
                    {s.questions.map((q, qIdx) => {
                        const qId = `${idx}-${qIdx}`;
                        const status = feedback[qId];
                        return (
                            <div key={qIdx} className="border-t border-slate-100 pt-12">
                                <p className="font-black text-slate-900 mb-10 text-2xl leading-tight">Analyse: <br/><span className="text-indigo-600">{q.question}</span></p>
                                <div className="grid grid-cols-1 gap-5">
                                    {q.options.map(o => {
                                        let btnClass = "border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/20 text-slate-800";
                                        if (status === 'correct' && o === q.correctAnswer) btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg ring-2 ring-emerald-100";
                                        else if (status === 'wrong' && o !== q.correctAnswer) btnClass = "border-slate-50 opacity-30 grayscale pointer-events-none";
                                        else if (status === 'wrong' && o === q.correctAnswer) btnClass = "border-emerald-200 bg-emerald-50/50 text-emerald-800";
                                        
                                        return (
                                            <button 
                                                key={o} 
                                                disabled={!!status}
                                                onClick={() => handleSourceAnswer(qId, o, q.correctAnswer)} 
                                                className={`p-8 text-left border-2 rounded-[2.5rem] transition-all font-bold text-xl shadow-sm ${btnClass}`}
                                            >
                                                {o}
                                            </button>
                                        );
                                    })}
                                </div>
                                {status === 'correct' && <p className="mt-6 text-emerald-600 font-black text-sm uppercase tracking-widest animate-pop">🎯 Korrekt analyse!</p>}
                            </div>
                        )
                    })}
                </div>
                <div className="mt-20 pt-12 border-t flex justify-between items-center">
                    <button disabled={idx === 0} onClick={() => { setIdx(idx - 1); setFeedback({}); }} className="text-slate-400 font-black uppercase text-sm disabled:opacity-0 hover:text-indigo-600 transition-all">← Forrige</button>
                    <button onClick={() => { if(idx < sources.length -1) { setIdx(idx+1); setFeedback({}); } else onExit(); }} className="bg-slate-900 text-white px-16 py-6 rounded-3xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-indigo-600 transition-all">{idx < sources.length -1 ? 'Næste Kilde →' : 'Afslut'}</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  const [selIds, setSelIds] = useState(['1', '2']);
  const [view, setView] = useState('menu');

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)), [stats]);

  const handleRecord = (id, ok) => {
    setStats(prev => {
      const s = prev[id] || { count: 0, correct: 0 };
      return { ...prev, [id]: { count: (s.count || 0) + 1, correct: (s.correct || 0) + (ok ? 1 : 0) } };
    });
  };

  const filtered = useMemo(() => ({
    entries: HISTORY_ENTRIES.filter(e => selIds.includes(e.topicId)),
    exams: EXAM_INTERPRETATIONS.filter(e => selIds.includes(e.topicId)),
    sources: PRIMARY_SOURCES.filter(e => selIds.includes(e.topicId))
  }), [selIds]);

  const quizQs = useMemo(() => filtered.entries.flatMap(e => (e.questions || []).map(q => ({ ...q, entryId: e.id }))), [filtered]);
  const examQs = useMemo(() => filtered.exams.flatMap(e => (e.subtext || []).map(s => ({ ...s, entryId: e.id }))), [filtered]);

  const calculateMastery = (ids) => {
    const relevantEntries = Object.entries(stats).filter(([id]) => ids.includes(id));
    if (!relevantEntries.length) return 0;
    
    let totalAttempts = 0;
    let totalCorrect = 0;
    
    // Fix: Explicitly type the entry in the loop to avoid unknown type errors on line 381 and 382
    relevantEntries.forEach(([_, val]: [string, any]) => {
      totalAttempts += (val.count || 0);
      totalCorrect += (val.correct || 0);
    });
    
    return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col relative overflow-hidden">
      <header className="bg-white border-b py-8 px-10 flex justify-between items-center relative z-20 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl">H</div>
          <div>
            <h1 className="text-3xl font-black italic text-slate-900 tracking-tighter leading-none">HF <span className="text-indigo-600">Historie</span> Master</h1>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mt-3 tracking-widest uppercase">Eksamens-forberedelse</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-right hidden sm:block">
                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Mastery</span>
                <span className="text-3xl font-black text-indigo-600">{calculateMastery(HISTORY_ENTRIES.map(e => e.id))}%</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl shadow-inner">🎓</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 sm:p-12 flex-1 w-full relative z-10">
        {view === 'menu' ? (
          <div className="animate-pop">
            <section className="mb-16">
                <div className="flex justify-between items-end mb-10 border-b-2 border-slate-200 pb-6">
                    <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.5em]">01. Pensum Områder</h2>
                    <button onClick={() => setSelIds(TOPICS.map(t => t.id))} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Vælg alle</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    {TOPICS.map(t => {
                        const active = selIds.includes(t.id);
                        const qCount = HISTORY_ENTRIES.filter(e => e.topicId === t.id).length;
                        return (
                            <button key={t.id} onClick={() => setSelIds(s => s.includes(t.id) ? s.filter(x => x !== t.id) : [...s, t.id])} 
                                    className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative group shadow-sm flex flex-col justify-between ${active ? 'border-indigo-600 bg-white shadow-xl scale-[1.02]' : 'border-slate-200 bg-slate-100/50 opacity-60 hover:opacity-100'}`}>
                                <h3 className={`font-black text-xs leading-tight mb-4 min-h-[3rem] uppercase tracking-tight ${active ? 'text-indigo-600' : 'text-slate-600'}`}>{t.title}</h3>
                                <div className={`inline-block px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest self-start ${active ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>{qCount} elementer</div>
                            </button>
                        )
                    })}
                </div>
            </section>

            <section>
                <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.5em] mb-12 border-b-2 border-slate-200 pb-6">02. Trænings Moduler</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    
                    <button onClick={() => setView('flashcards')} className="bg-indigo-600 p-12 rounded-[4rem] text-white text-left shadow-2xl hover:translate-y-[-10px] transition-transform border-b-[12px] border-indigo-800 group relative">
                        <div className="text-6xl mb-12 group-hover:rotate-12 transition-transform">🗂️</div>
                        <h3 className="text-4xl font-black mb-3 italic tracking-tight text-white">Anki Recall</h3>
                        <p className="text-indigo-100 text-sm mb-16 font-medium opacity-80 leading-relaxed">Begreber og teorier udenad.</p>
                        <div className="flex justify-between items-center bg-indigo-700/50 p-8 rounded-[2.5rem] border border-indigo-400/30">
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-200">{filtered.entries.length} Kort</span>
                            <span className="bg-white text-indigo-900 px-10 py-3 rounded-2xl text-xs font-black uppercase shadow-xl hover:bg-slate-100">Start →</span>
                        </div>
                    </button>

                    <button onClick={() => setView('quiz')} className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 text-slate-900 text-left shadow-2xl hover:translate-y-[-10px] transition-transform border-b-[12px] border-slate-200 group">
                        <div className="text-6xl mb-12 group-hover:scale-110 transition-transform">🎯</div>
                        <h3 className="text-4xl font-black mb-3 italic text-slate-900 tracking-tight">Koncept Quiz</h3>
                        <p className="text-slate-500 text-sm mb-16 font-medium leading-relaxed">Test din viden med multiple choice.</p>
                        <div className="flex justify-between items-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-900">{quizQs.length} Spørgsmål</span>
                            <span className="bg-indigo-600 text-white px-10 py-3 rounded-2xl text-xs font-black uppercase shadow-lg">Start →</span>
                        </div>
                    </button>

                    <button onClick={() => setView('interpretation')} className="bg-slate-800 p-12 rounded-[4rem] text-white text-left shadow-2xl hover:translate-y-[-10px] transition-transform border-b-[12px] border-slate-900 group">
                        <div className="text-6xl mb-12 group-hover:rotate-[-12deg] transition-transform">💡</div>
                        <h3 className="text-4xl font-black mb-3 italic tracking-tight text-white">Eksamens Focus</h3>
                        <p className="text-slate-300 text-sm mb-16 font-medium leading-relaxed">Lær at svare strategisk til eksamen.</p>
                        <div className="flex justify-between items-center bg-slate-700/50 p-8 rounded-[2.5rem] border border-slate-600">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-100">{examQs.length} Sæt</span>
                            <span className="bg-white text-slate-900 px-10 py-3 rounded-2xl text-xs font-black uppercase shadow-lg hover:bg-slate-100">Træn →</span>
                        </div>
                    </button>

                    <button onClick={() => setView('timeline')} className="bg-white p-16 rounded-[5rem] text-slate-900 text-left shadow-2xl hover:translate-y-[-10px] transition-transform relative overflow-hidden group border-2 border-slate-100 border-b-[12px] border-indigo-100 md:col-span-2">
                        <div className="flex justify-between items-start mb-12">
                            <div className="max-w-lg">
                                <h3 className="text-5xl font-black mb-6 italic tracking-tighter text-slate-900">Tidslinje Brættet</h3>
                                <p className="text-slate-600 text-xl font-medium leading-relaxed">Kan du bygge kæden uden at se årstallene? Pas på - forkerte brikker ryger ud!</p>
                            </div>
                            <div className="text-9xl opacity-10 grayscale group-hover:grayscale-0 transition-all group-hover:rotate-12 duration-700">⏳</div>
                        </div>
                        <div className="flex items-center gap-12">
                            <div className="bg-indigo-600 text-white px-16 py-6 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-700">Spil Nu</div>
                            <span className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">{filtered.entries.filter(e => e.date).length} Begivenheder</span>
                        </div>
                    </button>

                    <button onClick={() => setView('sources')} className="bg-emerald-500 p-12 rounded-[4rem] text-white text-left shadow-2xl hover:translate-y-[-10px] transition-transform border-b-[12px] border-emerald-800 group">
                        <div className="text-6xl mb-12 group-hover:scale-110 transition-transform">📜</div>
                        <h3 className="text-4xl font-black mb-3 italic text-white tracking-tight">Kilde Værkstedet</h3>
                        <p className="text-emerald-50 text-sm mb-16 font-medium leading-relaxed opacity-90">Analysér originale tekster fra pensum.</p>
                        <div className="flex justify-between items-center bg-emerald-700/40 p-8 rounded-[2.5rem] border border-white/20">
                            <span className="text-xs font-black uppercase tracking-widest text-white">{filtered.sources.length} Kilder</span>
                            <span className="bg-white text-emerald-900 px-10 py-3 rounded-2xl text-xs font-black uppercase shadow-lg hover:bg-slate-100">Analyse →</span>
                        </div>
                    </button>

                </div>
            </section>
          </div>
        ) : (
          <div className="animate-pop h-full pb-32">
            {view === 'flashcards' && <AnkiFlashcards entries={filtered.entries} onExit={() => setView('menu')} onRecord={handleRecord} />}
            {view === 'quiz' && <Quiz questions={quizQs} title="Begrebs-Quiz" onExit={() => setView('menu')} onRecord={handleRecord} />}
            {view === 'interpretation' && <Quiz questions={examQs} title="Eksamens-Focus" onExit={() => setView('menu')} onRecord={handleRecord} />}
            {view === 'timeline' && <TimelineGame entries={filtered.entries} onExit={() => setView('menu')} />}
            {view === 'sources' && <SourceStudy sources={filtered.sources} onExit={() => setView('menu')} />}
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-16 px-10 text-center relative z-20">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">HF Historie Master • Powered by AI Education</p>
      </footer>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
