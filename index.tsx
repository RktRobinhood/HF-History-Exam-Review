
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES, EXAM_INTERPRETATIONS } from './data/index.js';

// --- UTILS ---
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const STORAGE_KEY = 'hf_master_quest_final';

const getYear = (dateStr) => {
  if (!dateStr) return 0;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
};

const scrubDate = (text) => text.replace(/\d{4}/g, '').trim();

// --- AUDIO ENGINE ---
const playSound = (type) => {
  try {
    // Fix: Cast window to any to access webkitAudioContext for broader browser support in TypeScript
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'start') {
      osc.type = 'triangle';
      [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
      });
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now); osc.stop(now + 0.6);
    } else if (type === 'damage') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now); osc.stop(now + 0.2);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'victory') {
      osc.type = 'square';
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
      });
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.start(now); osc.stop(now + 0.8);
    }
  } catch (e) { console.warn("Audio Context failed", e); }
};

// --- STYLES ---
const UI = {
  btn: "px-4 py-2 font-black text-sm border-2 border-slate-900 transition-all active:translate-y-0.5",
  primary: "bg-blue-300 text-slate-900 hover:bg-blue-400",
  secondary: "bg-white text-slate-900 border-slate-900 hover:bg-slate-100",
  danger: "bg-red-300 text-slate-900 hover:bg-red-400",
  success: "bg-green-300 text-slate-900 hover:bg-green-400",
  warning: "bg-yellow-300 text-slate-900 hover:bg-yellow-400",
  card: "bg-white border-2 border-slate-900 p-6 mb-4",
  sidebar: "w-64 border-r-2 border-slate-900 bg-slate-50 p-6 shrink-0",
  main: "flex-1 p-8 bg-white overflow-y-auto"
};

// --- SUB-COMPONENTS ---

const FlashcardSession = ({ entries, onExit, onRecord }) => {
  const [queue, setQueue] = useState(() => shuffle([...entries]));
  const [revealed, setRevealed] = useState(false);
  const current = queue[0];

  if (!current) return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase">Session Færdig!</h2>
      <button onClick={onExit} className={`${UI.btn} ${UI.primary} px-10 py-4 text-lg`}>TILBAGE TIL MENU</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-bold text-slate-900 uppercase text-xs">Kort tilbage: {queue.length}</span>
      </div>
      <div className={`${UI.card} min-h-[400px] flex flex-col justify-center text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
        {!revealed ? (
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-12 leading-tight px-4">{current.title}</h2>
            <button onClick={() => setRevealed(true)} className={`${UI.btn} ${UI.primary} w-full py-6 text-xl uppercase`}>Vis Svar</button>
          </div>
        ) : (
          <div className="animate-pop">
            <p className="text-2xl text-slate-900 leading-relaxed font-bold mb-8 italic">"{current.description}"</p>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => { onRecord(current.id, false); setRevealed(false); setQueue(queue.slice(1)); }} className={`${UI.btn} ${UI.danger}`}>IGEN</button>
              <button onClick={() => { onRecord(current.id, false); setRevealed(false); setQueue(queue.slice(1)); }} className={`${UI.btn} ${UI.warning}`}>SVÆRT</button>
              <button onClick={() => { onRecord(current.id, true); setRevealed(false); setQueue(queue.slice(1)); }} className={`${UI.btn} ${UI.success}`}>OK</button>
              <button onClick={() => { onRecord(current.id, true); setRevealed(false); setQueue(queue.slice(1)); }} className={`${UI.btn} ${UI.primary}`}>LET</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineQuest = ({ entries, onExit, streak, setStreak, hearts, setHearts, highScore, setHighScore }) => {
  const dated = useMemo(() => entries.filter(e => e.date).sort((a, b) => getYear(a.date) - getYear(b.date)), [entries]);
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState([]);
  const [selected, setSelected] = useState(null);
  const [shake, setShake] = useState(false);

  const setupLevel = useCallback(() => {
    const shuffled = shuffle([...dated]);
    setPlaced([shuffled[0]]);
    setPool(shuffled.slice(1, 6));
    playSound('start');
  }, [dated]);

  useEffect(() => {
    if (placed.length === 0) setupLevel();
  }, [setupLevel, placed.length]);

  const handlePlace = (index) => {
    if (!selected) return;
    const year = getYear(selected.date);
    const prevYear = index === 0 ? -Infinity : getYear(placed[index - 1].date);
    const nextYear = index === placed.length ? Infinity : getYear(placed[index].date);

    if (year >= prevYear && year <= nextYear) {
      playSound('success');
      const newPlaced = [...placed];
      newPlaced.splice(index, 0, selected);
      setPlaced(newPlaced);
      setPool(pool.filter(p => p.id !== selected.id));
      setSelected(null);
    } else {
      playSound('damage');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setHearts(prev => Math.max(0, prev - 1));
      setSelected(null);
    }
  };

  if (hearts === 0) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-pop">
      <div className="text-9xl mb-8">💔</div>
      <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase">Game Over</h2>
      <p className="text-xl font-bold text-slate-500 mb-8 uppercase tracking-widest">Din Streak blev på {streak}</p>
      <button onClick={() => { setStreak(0); setHearts(3); onExit(); }} className={`${UI.btn} ${UI.danger} px-10 py-4 text-xl`}>PRØV IGEN</button>
    </div>
  );

  if (pool.length === 0 && placed.length > 1) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-pop">
      <div className="text-8xl mb-8">⚔️</div>
      <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase">Level Fuldført!</h2>
      <p className="text-2xl font-black text-blue-900 mb-10 italic">Hjerter tilbage: {hearts} / 3</p>
      <button onClick={() => { 
        playSound('victory');
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak > highScore) setHighScore(nextStreak);
        setupLevel();
      }} className={`${UI.btn} ${UI.primary} px-16 py-6 text-2xl uppercase`}>NÆSTE OPGAVE →</button>
    </div>
  );

  return (
    <div className={`max-w-6xl mx-auto py-8 px-4 h-screen flex flex-col ${shake ? 'animate-bounce' : ''}`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ LUK</button>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-4xl">{i < hearts ? '❤️' : '🖤'}</span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase text-slate-400">Streak: {streak}</p>
          <p className="text-xs font-black uppercase text-blue-900">High: {highScore}</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 border-4 border-slate-900 p-8 flex items-center justify-center overflow-x-auto mb-8 shadow-inner">
        <div className="flex items-center gap-2 min-w-max px-20">
          {placed.map((p, i) => (
            <React.Fragment key={p.id}>
              <button disabled={!selected} onClick={() => handlePlace(i)} className={`w-12 h-12 border-4 border-dashed border-slate-900 rounded-full transition-all ${selected ? 'bg-blue-300 hover:scale-125' : 'opacity-20 cursor-not-allowed'}`}>+</button>
              <div className="bg-white border-4 border-slate-900 p-5 w-48 text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <span className="block text-blue-900 font-black text-xs border-b-2 border-slate-100 mb-3">{p.date}</span>
                <span className="text-[10px] font-black uppercase text-slate-900 leading-tight block">{p.title}</span>
              </div>
              {i === placed.length - 1 && (
                <button disabled={!selected} onClick={() => handlePlace(i + 1)} className={`w-12 h-12 border-4 border-dashed border-slate-900 rounded-full transition-all ${selected ? 'bg-blue-300 hover:scale-125' : 'opacity-20 cursor-not-allowed'}`}>+</button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white border-4 border-slate-900 flex flex-wrap gap-3 max-h-56 overflow-y-auto shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        {pool.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} className={`${UI.btn} ${selected?.id === p.id ? 'bg-blue-300 scale-105' : 'bg-slate-100'}`}>
            {scrubDate(p.title)}
          </button>
        ))}
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

  if (!q) return <div className="p-20 text-center"><button onClick={onExit} className={UI.btn}>TILBAGE</button></div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-bold text-slate-900 border-2 border-slate-900 px-4 py-1">{idx + 1} / {questions.length}</span>
      </div>
      <div className={`${UI.card} shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
        <p className="text-xs font-black text-slate-500 uppercase mb-4">{title}</p>
        <h2 className="text-2xl font-black text-slate-900 mb-10 leading-snug">{q.question}</h2>
        <div className="space-y-3">
          {options.map(o => (
            <button key={o} disabled={isAnswered} onClick={() => { setSelected(o); setIsAnswered(true); }}
              className={`w-full text-left p-5 border-2 transition-all font-bold ${isAnswered ? (o === q.correctAnswer ? 'bg-green-300' : (o === selected ? 'bg-red-300' : 'opacity-30')) : 'bg-white hover:bg-slate-50 border-slate-900'}`}>{o}</button>
          ))}
        </div>
        {isAnswered && (
          <div className="mt-8 animate-pop">
            <button onClick={() => { if (idx < questions.length - 1) { setIdx(idx + 1); setSelected(null); setIsAnswered(false); } else onExit(); }}
              className={`${UI.btn} ${UI.primary} w-full py-6 text-xl uppercase`}>Næste Spørgsmål →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SourceAnalysis = ({ sources, onExit }) => {
  const [curr, setCurr] = useState(0);
  const s = sources[curr];
  if (!s) return <div className="p-20 text-center"><button onClick={onExit} className={UI.btn}>TILBAGE</button></div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-black text-slate-900 border-2 border-slate-900 px-4 py-1">{curr + 1} / {sources.length}</span>
      </div>
      <div className={`${UI.card} shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]`}>
        <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">📜 {s.title}</h2>
        <div className="bg-slate-50 border-2 border-slate-200 p-8 mb-10 text-slate-900 font-serif italic text-lg leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto border-l-8 border-l-blue-900">
          "{s.text}"
        </div>
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
  // Fix: Add explicit typing for stats to prevent 'unknown' errors during mastery calculation
  const [stats, setStats] = useState<Record<string, {count: number, correct: number}>>(() => JSON.parse(localStorage.getItem(STORAGE_KEY + '_stats') || '{}'));
  const [selIds, setSelIds] = useState(() => TOPICS.map(t => t.id));
  const [view, setView] = useState('menu');

  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY + '_hs') || '0'));

  useEffect(() => localStorage.setItem(STORAGE_KEY + '_stats', JSON.stringify(stats)), [stats]);
  useEffect(() => localStorage.setItem(STORAGE_KEY + '_hs', highScore.toString()), [highScore]);

  const filtered = useMemo(() => ({
    entries: HISTORY_ENTRIES.filter(e => selIds.includes(e.topicId)),
    exams: EXAM_INTERPRETATIONS.filter(e => selIds.includes(e.topicId)),
    sources: PRIMARY_SOURCES.filter(e => selIds.includes(e.topicId))
  }), [selIds]);

  const quizQs = useMemo(() => filtered.entries.flatMap(e => (e.questions || []).map(q => ({ ...q, entryId: e.id }))), [filtered]);
  const examQs = useMemo(() => filtered.exams.flatMap(e => (e.subtext || []).map(s => ({ ...s, entryId: e.id }))), [filtered]);

  const masteryData = useMemo(() => {
    const relevantStats = Object.entries(stats).filter(([id]) => HISTORY_ENTRIES.map(e => e.id).includes(id));
    if (!relevantStats.length) return { percent: 0, attempts: 0, correct: 0 };
    let att = 0; let corr = 0;
    // Fix: Using properly typed stats ensures count and correct are recognized
    relevantStats.forEach(([_, v]) => { att += v.count; corr += v.correct; });
    return { 
      percent: att > 0 ? Math.round((corr / att) * 100) : 0,
      attempts: att,
      correct: corr
    };
  }, [stats]);

  if (view !== 'menu') {
    return (
      <div className="bg-slate-50 min-h-screen">
        {view === 'flashcards' && <FlashcardSession entries={filtered.entries} onExit={() => setView('menu')} onRecord={(id, ok) => {
          setStats(p => { const s = p[id] || {count:0,correct:0}; return {...p, [id]: {count:s.count+1,correct:s.correct+(ok?1:0)}}; });
        }} />}
        {view === 'quiz' && <QuizSession questions={shuffle(quizQs)} title="Begrebs Quiz" onExit={() => setView('menu')} />}
        {view === 'timeline' && <TimelineQuest entries={filtered.entries} streak={streak} setStreak={setStreak} hearts={hearts} setHearts={setHearts} highScore={highScore} setHighScore={setHighScore} onExit={() => setView('menu')} />}
        {view === 'sources' && <SourceAnalysis sources={filtered.sources} onExit={() => setView('menu')} />}
        {view === 'exam' && <QuizSession questions={examQs} title="Eksamenstræner" onExit={() => setView('menu')} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <aside className={UI.sidebar}>
        <div className="mb-10 pb-6 border-b-4 border-slate-900">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">HF Historie</h1>
          <p className="text-[10px] font-black text-blue-900 uppercase mt-2">Dansk Eksamen Mastery</p>
        </div>
        <div className="space-y-2 mb-10">
          {TOPICS.map(t => (
            <label key={t.id} className={`flex items-center gap-3 p-3 border-2 cursor-pointer ${selIds.includes(t.id) ? 'border-slate-900 bg-blue-50' : 'border-slate-100 opacity-60'}`}>
              <input type="checkbox" checked={selIds.includes(t.id)} onChange={() => setSelIds(s => s.includes(t.id) ? s.filter(x => x !== t.id) : [...s, t.id])} />
              <span className="text-[11px] font-black uppercase">{t.title}</span>
            </label>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <button onClick={() => setSelIds(TOPICS.map(t => t.id))} className="text-[10px] font-black text-blue-900 underline uppercase text-left hover:text-blue-500">Markér Alle</button>
            <button onClick={() => setSelIds([])} className="text-[10px] font-black text-red-900 underline uppercase text-left hover:text-red-500">Fravælg Alle</button>
          </div>
        </div>
        <div className="mt-auto p-6 border-4 border-slate-900 bg-white text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group relative cursor-help">
          <span className="text-xs font-black uppercase text-slate-500 block mb-2">Total Mestring</span>
          <span className="text-4xl font-black text-blue-900 italic">{masteryData.percent}%</span>
          {/* Tooltip on Hover */}
          <div className="hidden group-hover:block absolute bottom-full left-0 w-full bg-slate-900 text-white p-3 text-[10px] mb-2 font-bold uppercase tracking-wider rounded border-2 border-slate-900 shadow-xl">
             Resultater: {masteryData.correct} / {masteryData.attempts}<br/>
             Bliv ved til 100%!
          </div>
        </div>
      </aside>

      <main className={UI.main}>
        <div className="mb-12 pb-6 border-b-8 border-slate-900 flex justify-between items-end">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Vælg Modul</h2>
          <span className="text-xs font-black bg-slate-900 text-white px-4 py-1 uppercase">{filtered.entries.length} Kort i pensum</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => setView('flashcards')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
            <div className="text-5xl mb-6">🗂️</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Flashcards</h3>
            <p className="text-sm text-slate-700 font-bold mb-8">Test din paratviden og husk de vigtigste begreber fra det feudale til det senmoderne.</p>
            <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase py-4`}>Start Træning</div>
          </button>
          <button onClick={() => setView('quiz')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Videns Quiz</h3>
            <p className="text-sm text-slate-700 font-bold mb-8">Multiple-choice test i pensum. Få umiddelbar feedback på dine historiske fakta.</p>
            <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase py-4`}>Tag Quiz</div>
          </button>
          <button onClick={() => { setStreak(0); setHearts(3); setView('timeline'); }} className={`${UI.card} text-left md:col-span-2 hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-yellow-50 flex items-center gap-10`}>
            <div className="text-7xl">⚔️</div>
            <div className="flex-1">
              <h3 className="text-4xl font-black mb-4 uppercase italic">Timeline Quest</h3>
              <p className="text-md text-slate-700 font-bold max-w-2xl mb-8">Beskyt dine hjerter! Sortér begivenheder korrekt for at opnå den højeste streak. 3 liv pr. quest – hearts carry over!</p>
              <div className={`${UI.btn} ${UI.primary} px-16 py-5 uppercase text-lg`}>Start Quest</div>
            </div>
          </button>
          <button onClick={() => setView('sources')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
            <div className="text-5xl mb-6">📜</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Kilde Analyse</h3>
            <p className="text-sm text-slate-700 font-bold mb-8">Dyk ned i lange uddrag (Wannsee, Suchomel, Hitler Youth) og træn din kildekritik.</p>
            <div className={`${UI.btn} ${UI.success} w-full text-center uppercase py-4`}>Analysér</div>
          </button>
          <button onClick={() => setView('exam')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-slate-100`}>
            <div className="text-5xl mb-6">💡</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Eksamenstræner</h3>
            <p className="text-sm text-slate-700 font-bold mb-8">Typiske eksamensspørgsmål og coaching. Forstå censorernes forventninger.</p>
            <div className={`${UI.btn} ${UI.secondary} w-full text-center uppercase py-4`}>Åbn Fokus</div>
          </button>
        </div>
      </main>
    </div>
  );
};

// Removed '!' to fix Babel in-browser transformation
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
