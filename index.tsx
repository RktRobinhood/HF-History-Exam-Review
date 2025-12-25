
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES, EXAM_INTERPRETATIONS } from './data/index.js';

// --- UTILS ---
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const STORAGE_KEY = 'hf_master_solid_final_v2';

const getYear = (dateStr) => {
  if (!dateStr) return 0;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
};

// --- SHARED UI CLASSES (Strict High Contrast, No White Text) ---
const UI = {
  btn: "px-4 py-2 font-black text-sm border-2 border-slate-900 transition-all active:translate-y-0.5",
  primary: "bg-blue-300 text-slate-900 hover:bg-blue-400",
  secondary: "bg-white text-slate-900 border-slate-900 hover:bg-slate-100",
  danger: "bg-red-300 text-slate-900 hover:bg-red-400",
  success: "bg-green-300 text-slate-900 hover:bg-green-400",
  warning: "bg-yellow-300 text-slate-900 hover:bg-yellow-400",
  card: "bg-white border-2 border-slate-900 p-6 mb-4",
  header: "bg-slate-100 text-slate-900 p-6 border-b-4 border-slate-900",
  sidebar: "w-64 border-r-2 border-slate-900 bg-slate-50 p-6 shrink-0",
  main: "flex-1 p-8 bg-white overflow-y-auto"
};

// --- COMPONENTS ---

const FlashcardSession = ({ entries, onExit, onRecord }) => {
  const [queue, setQueue] = useState(() => shuffle([...entries]));
  const [revealed, setRevealed] = useState(false);
  const current = queue[0];

  if (!current) return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Session Færdig!</h2>
      <button onClick={onExit} className={`${UI.btn} ${UI.primary} px-10 py-4 text-lg`}>TILBAGE TIL MENU</button>
    </div>
  );

  const handleRating = (rating) => {
    // 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
    onRecord(current.id, rating >= 2);
    
    if (rating === 0) {
      // Show SAME card again (flip back to front)
      setRevealed(false);
    } else {
      // Move to next card
      setRevealed(false);
      const nextQueue = [...queue];
      nextQueue.shift();
      setQueue(nextQueue);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-bold text-slate-900 uppercase text-xs">Kort tilbage: {queue.length}</span>
      </div>

      <div className={`${UI.card} min-h-[400px] flex flex-col justify-center text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
        {!revealed ? (
          <div>
            <span className="block text-xs font-black text-blue-900 uppercase tracking-widest mb-4">Begreb</span>
            <h2 className="text-4xl font-black text-slate-900 mb-12 leading-tight px-4">{current.title}</h2>
            <button onClick={() => setRevealed(true)} className={`${UI.btn} ${UI.primary} w-full py-6 text-xl uppercase tracking-widest`}>Vis Svar</button>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-pop">
            <div className="flex-1 px-4 py-6">
              <span className="block text-xs font-black text-blue-900 uppercase tracking-widest mb-4">Svar</span>
              <p className="text-2xl text-slate-900 leading-relaxed font-bold mb-8 italic">"{current.description}"</p>
              {current.date && <p className="text-2xl font-black text-blue-900 bg-blue-50 inline-block px-4 py-1 border-2 border-blue-900">Årstal: {current.date}</p>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-t-2 border-slate-900 pt-6">
              <button onClick={() => handleRating(0)} className={`${UI.btn} ${UI.danger}`}>AGAIN</button>
              <button onClick={() => handleRating(1)} className={`${UI.btn} ${UI.warning}`}>HARD</button>
              <button onClick={() => handleRating(2)} className={`${UI.btn} ${UI.success}`}>GOOD</button>
              <button onClick={() => handleRating(3)} className={`${UI.btn} ${UI.primary}`}>EASY</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuizSession = ({ questions, onExit, title }) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const q = questions[idx];
  const options = useMemo(() => q?.options ? shuffle(q.options) : [], [q]);

  if (!q) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-bold text-slate-900 bg-blue-100 border-2 border-slate-900 px-3 py-1">{idx + 1} / {questions.length}</span>
      </div>

      <div className={`${UI.card} shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
        <p className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">{title}</p>
        <h2 className="text-2xl font-black text-slate-900 mb-10 leading-snug">{q.question}</h2>
        <div className="space-y-3">
          {options.map(o => {
            const isCorrect = o === q.correctAnswer;
            const isSelected = o === selected;
            let style = "bg-white border-slate-900 text-slate-900 hover:bg-slate-100";
            if (isAnswered) {
              if (isCorrect) style = "bg-green-300 border-slate-900 text-slate-900 font-black scale-105 shadow-md";
              else if (isSelected) style = "bg-red-300 border-slate-900 text-slate-900";
              else style = "bg-white border-slate-200 text-slate-300 opacity-40";
            }
            return (
              <button key={o} disabled={isAnswered} onClick={() => { setSelected(o); setIsAnswered(true); }}
                className={`w-full text-left p-5 border-2 transition-all font-bold ${style}`}>{o}</button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="mt-8 animate-pop">
          {q.explanation && <div className="p-6 bg-yellow-50 border-2 border-slate-900 text-slate-900 font-bold italic mb-6 leading-relaxed">💡 {q.explanation}</div>}
          <button onClick={() => { if (idx < questions.length - 1) { setIdx(idx + 1); setSelected(null); setIsAnswered(false); } else onExit(); }}
            className={`${UI.btn} ${UI.primary} w-full py-6 text-xl uppercase tracking-widest`}>Næste Spørgsmål →</button>
        </div>
      )}
    </div>
  );
};

const TimelineSession = ({ entries, onExit }) => {
  const dated = useMemo(() => entries.filter(e => e.date).sort((a, b) => getYear(a.date) - getYear(b.date)), [entries]);
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (dated.length < 3) return;
    const shuffled = shuffle([...dated]);
    setPlaced([shuffled[0], shuffled[1]].sort((a, b) => getYear(a.date) - getYear(b.date)));
    setPool(shuffled.slice(2));
  }, [dated]);

  const handlePlace = (index) => {
    if (!selected) return;
    const year = getYear(selected.date);
    const prevYear = index === 0 ? -Infinity : getYear(placed[index-1].date);
    const nextYear = index === placed.length ? Infinity : getYear(placed[index].date);

    if (year >= prevYear && year <= nextYear) {
      const newPlaced = [...placed];
      newPlaced.splice(index, 0, selected);
      setPlaced(newPlaced);
      setPool(pool.filter(p => p.id !== selected.id));
      setSelected(null);
    } else {
      alert("Forkert! Den hændelse hører ikke til der.");
      setSelected(null);
    }
  };

  if (pool.length === 0 && !selected && placed.length > 0) return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase italic">Tidslinje Komplet!</h2>
      <button onClick={onExit} className={`${UI.btn} ${UI.primary} px-10 py-4 text-xl`}>GÅ TIL MENU</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ LUK</button>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">History Chrono</h2>
        <span className="font-black text-slate-900">Mangler: {pool.length}</span>
      </div>

      <div className="flex-1 bg-slate-50 border-4 border-slate-900 p-8 flex items-center justify-center overflow-x-auto mb-8 shadow-inner">
        <div className="flex items-center gap-2 min-w-max px-20">
          {placed.map((p, i) => (
            <React.Fragment key={p.id}>
              <button disabled={!selected} onClick={() => handlePlace(i)} className={`w-12 h-12 border-4 border-dashed border-slate-900 rounded-full transition-all ${selected ? 'bg-blue-300 hover:scale-125' : 'opacity-20 cursor-not-allowed'}`}>+</button>
              <div className="bg-white border-4 border-slate-900 p-5 w-48 text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <span className="block text-blue-900 font-black text-sm border-b-2 border-slate-100 mb-3">{p.date}</span>
                <span className="text-xs font-black uppercase text-slate-900 leading-tight block">{p.title}</span>
              </div>
              {i === placed.length - 1 && (
                <button disabled={!selected} onClick={() => handlePlace(i+1)} className={`w-12 h-12 border-4 border-dashed border-slate-900 rounded-full transition-all ${selected ? 'bg-blue-300 hover:scale-125' : 'opacity-20 cursor-not-allowed'}`}>+</button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white border-4 border-slate-900 flex flex-wrap gap-3 max-h-56 overflow-y-auto shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        {pool.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} className={`${UI.btn} ${selected?.id === p.id ? 'bg-blue-300 text-slate-900' : 'bg-slate-100 text-slate-900'}`}>{p.title}</button>
        ))}
      </div>
    </div>
  );
};

const SourceSession = ({ sources, onExit }) => {
  const [curr, setCurr] = useState(0);
  const s = sources[curr];
  if (!s) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-black text-slate-900 border-2 border-slate-900 px-4 py-1">{curr + 1} / {sources.length}</span>
      </div>
      <div className={`${UI.card} shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]`}>
        <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">📜 {s.title}</h2>
        <div className="bg-slate-50 border-2 border-slate-200 p-10 mb-10 text-slate-900 font-serif italic text-xl leading-relaxed whitespace-pre-wrap">"{s.text}"</div>
        <div className="space-y-12">
          {s.questions.map((q, i) => (
            <div key={i} className="border-t-4 border-slate-100 pt-10">
              <p className="font-black text-xl text-slate-900 mb-6 uppercase tracking-tight">Analyse: {q.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map(o => (
                  <button key={o} onClick={() => alert(o === q.correctAnswer ? "KORREKT!" : "FORKERT.")} className="p-5 border-2 border-slate-900 text-left text-sm font-black text-slate-900 hover:bg-slate-50">{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t-4 border-slate-100 flex justify-between">
          <button disabled={curr === 0} onClick={() => setCurr(curr - 1)} className="font-black text-slate-400 uppercase disabled:opacity-0 hover:text-slate-900">← Forrige</button>
          <button onClick={() => { if (curr < sources.length - 1) setCurr(curr + 1); else onExit(); }} className={`${UI.btn} ${UI.primary} px-10`}>NÆSTE KILDE →</button>
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
      return { ...prev, [id]: { count: s.count + 1, correct: s.correct + (ok ? 1 : 0) } };
    });
  };

  const filtered = useMemo(() => ({
    entries: HISTORY_ENTRIES.filter(e => selIds.includes(e.topicId)),
    exams: EXAM_INTERPRETATIONS.filter(e => selIds.includes(e.topicId)),
    sources: PRIMARY_SOURCES.filter(e => selIds.includes(e.topicId))
  }), [selIds]);

  const quizQs = useMemo(() => filtered.entries.flatMap(e => (e.questions || []).map(q => ({ ...q, entryId: e.id }))), [filtered]);
  const examQs = useMemo(() => filtered.exams.flatMap(e => (e.subtext || []).map(s => ({ ...s, entryId: e.id }))), [filtered]);

  const mastery = useMemo(() => {
    const relevantStats = Object.entries(stats).filter(([id]) => HISTORY_ENTRIES.map(e => e.id).includes(id));
    if (!relevantStats.length) return 0;
    let attempts = 0; let correct = 0;
    relevantStats.forEach(([_, v]: [any, any]) => { attempts += v.count; correct += v.correct; });
    return attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  }, [stats]);

  if (view !== 'menu') {
    return (
      <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
        {view === 'flashcards' && <FlashcardSession entries={filtered.entries} onExit={() => setView('menu')} onRecord={handleRecord} />}
        {view === 'quiz' && <QuizSession questions={shuffle(quizQs)} title="Begrebs Quiz" onExit={() => setView('menu')} />}
        {view === 'timeline' && <TimelineSession entries={filtered.entries} onExit={() => setView('menu')} />}
        {view === 'sources' && <SourceSession sources={filtered.sources} onExit={() => setView('menu')} />}
        {view === 'exam' && <QuizSession questions={examQs} title="Eksamens Fokus" onExit={() => setView('menu')} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      {/* Sidebar - Solid Borders, High Contrast Text */}
      <aside className={UI.sidebar}>
        <div className="mb-10 pb-6 border-b-4 border-slate-900">
          <h1 className="text-2xl font-black uppercase italic text-slate-900 tracking-tighter leading-none">HF Historie</h1>
          <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mt-2">Master Portal Pro</p>
        </div>
        
        <h2 className="text-xs font-black uppercase text-slate-500 mb-6 tracking-[0.2em]">Vælg Emner</h2>
        <div className="space-y-2 mb-10">
          {TOPICS.map(t => (
            <label key={t.id} className={`flex items-center gap-3 p-3 border-2 transition-all cursor-pointer ${selIds.includes(t.id) ? 'border-slate-900 bg-blue-50' : 'border-slate-100 hover:border-slate-300 opacity-60'}`}>
              <input type="checkbox" className="w-5 h-5 border-2 border-slate-900" checked={selIds.includes(t.id)} onChange={() => setSelIds(s => s.includes(t.id) ? s.filter(x => x !== t.id) : [...s, t.id])} />
              <span className="text-[11px] font-black uppercase text-slate-900 leading-tight">{t.title}</span>
            </label>
          ))}
          <button onClick={() => setSelIds(TOPICS.map(t => t.id))} className="text-[10px] font-black text-blue-900 underline mt-4 block w-full text-center uppercase tracking-widest">Markér Alle</button>
        </div>

        <div className="mt-auto p-6 border-4 border-slate-900 bg-white text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <span className="text-xs font-black uppercase text-slate-500 block mb-2">Mestring</span>
          <span className="text-4xl font-black text-blue-900 italic">{mastery}%</span>
        </div>
      </aside>

      {/* Main Content Area - Visual Block Buttons */}
      <main className={UI.main}>
        <div className="mb-12 pb-6 border-b-8 border-slate-900 flex justify-between items-end">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900">Moduler</h2>
          <span className="text-xs font-black bg-slate-900 text-white px-4 py-1 uppercase">{filtered.entries.length} Kort i pensum</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => setView('flashcards')} className={`${UI.card} text-left hover:bg-slate-50 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group`}>
            <div className="text-5xl mb-6">🗂️</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic text-slate-900">Anki Flashcards</h3>
            <p className="text-sm text-slate-700 mb-10 leading-relaxed font-bold">Spaced-repetition træner. Test din paratviden og husk de vigtigste begreber.</p>
            <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase tracking-widest py-4`}>Start Træning</div>
          </button>

          <button onClick={() => setView('quiz')} className={`${UI.card} text-left hover:bg-slate-50 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group`}>
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic text-slate-900">Videns Quiz</h3>
            <p className="text-sm text-slate-700 mb-10 leading-relaxed font-bold">Standard multiple-choice test i pensum. Få feedback med det samme.</p>
            <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase tracking-widest py-4`}>Tag Quiz</div>
          </button>

          <button onClick={() => setView('timeline')} className={`${UI.card} text-left md:col-span-2 hover:bg-slate-50 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group flex flex-col md:flex-row items-center gap-10`}>
            <div className="text-7xl group-hover:rotate-6 transition-transform">⏳</div>
            <div className="flex-1">
              <h3 className="text-4xl font-black mb-4 uppercase italic text-slate-900">History Chrono</h3>
              <p className="text-md text-slate-700 mb-8 leading-relaxed font-bold max-w-2xl">Sortér begivenheder korrekt i historiens kæde. En visuel træner i kronologi og sammenhæng.</p>
              <div className={`${UI.btn} ${UI.primary} px-16 py-5 inline-block uppercase tracking-widest text-lg`}>Spil Nu</div>
            </div>
          </button>

          <button onClick={() => setView('sources')} className={`${UI.card} text-left hover:bg-slate-50 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group`}>
            <div className="text-5xl mb-6">📜</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic text-slate-900">Kilde Analyse</h3>
            <p className="text-sm text-slate-700 mb-10 leading-relaxed font-bold">Læs de centrale tekster fra pensum og træn dine kildekritiske færdigheder.</p>
            <div className={`${UI.btn} ${UI.success} w-full text-center uppercase tracking-widest py-4`}>Analysér</div>
          </button>

          <button onClick={() => setView('exam')} className={`${UI.card} text-left hover:bg-slate-50 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group bg-slate-50`}>
            <div className="text-5xl mb-6">💡</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic text-slate-900">Eksamenstræner</h3>
            <p className="text-sm text-slate-700 mb-10 leading-relaxed font-bold">Typiske eksamensspørgsmål og coaching der forbereder dig på de faglige krav.</p>
            <div className={`${UI.btn} ${UI.secondary} w-full text-center uppercase tracking-widest py-4`}>Åbn Fokus</div>
          </button>
        </div>
      </main>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
