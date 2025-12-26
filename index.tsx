
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES, EXAM_INTERPRETATIONS } from './data/index.js';

// --- UTILS ---
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const STORAGE_KEY = 'hf_master_quest_final_v16';

const getYear = (dateStr) => {
  if (!dateStr) return 0;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
};

const scrubDate = (text) => text.replace(/\d{4}/g, '').trim();

// --- AUDIO ENGINE ---
const playSound = (type) => {
  try {
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
  sidebar: "border-r-2 border-slate-900 bg-slate-50 transition-all duration-300 flex flex-col h-full overflow-hidden",
  main: "flex-1 p-4 md:p-8 bg-white overflow-y-auto"
};

// --- SUB-COMPONENTS ---

const FlashcardSession = ({ entries, onExit, onRecord }) => {
  const [queue, setQueue] = useState(entries);
  const [revealed, setRevealed] = useState(false);
  const current = queue[0];

  if (!current) return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase">Session Færdig!</h2>
      <button onClick={onExit} className={`${UI.btn} ${UI.primary} px-10 py-4 text-lg`}>TILBAGE TIL MENU</button>
    </div>
  );

  const handleIgen = () => {
    onRecord(current.id, false);
    setRevealed(false);
    playSound('damage');
  };

  const handleResponse = (ok) => {
    onRecord(current.id, ok);
    setRevealed(false);
    if (ok) playSound('success');
    setQueue(prev => prev.slice(1));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-bold text-slate-900 uppercase text-xs">Kort tilbage: {queue.length}</span>
      </div>
      <div className={`${UI.card} min-h-[300px] md:min-h-[400px] flex flex-col justify-center text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
        {!revealed ? (
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 leading-tight px-4">{current.title}</h2>
            <button onClick={() => setRevealed(true)} className={`${UI.btn} ${UI.primary} w-full py-6 text-xl uppercase`}>Vis Svar</button>
          </div>
        ) : (
          <div className="animate-pop">
            <p className="text-lg md:text-2xl text-slate-900 leading-relaxed font-bold mb-8 italic">"{current.description}"</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button onClick={handleIgen} className={`${UI.btn} ${UI.danger}`}>IGEN</button>
              <button onClick={() => handleResponse(false)} className={`${UI.btn} ${UI.warning}`}>SVÆRT</button>
              <button onClick={() => handleResponse(true)} className={`${UI.btn} ${UI.success}`}>OK</button>
              <button onClick={() => handleResponse(true)} className={`${UI.btn} ${UI.primary}`}>LET</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineQuest = ({ entries, onExit, streak, setStreak, hearts, setHearts, highScore, setHighScore, onRecord }) => {
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState([]);
  const [selected, setSelected] = useState(null);
  const [shake, setShake] = useState(false);

  const setupLevel = useCallback(() => {
    // Collect all valid entries with dates from the passed entries pool
    const dated = entries.filter(e => e.date).sort((a, b) => getYear(a.date) - getYear(b.date));
    if (dated.length < 2) {
      alert("Ikke nok tidslinje-data for dette emne.");
      onExit();
      return;
    }
    
    // Shuffle the entire dated pool to ensure total randomness and variety
    const randomPool = shuffle([...dated]);
    setPlaced([randomPool[0]]);
    // Take the next 5 as the playable pool for this level for more diversity
    setPool(randomPool.slice(1, 6));
    playSound('start');
  }, [entries, onExit]);

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
      onRecord(selected.id, true);
      const newPlaced = [...placed];
      newPlaced.splice(index, 0, selected);
      setPlaced(newPlaced);
      setPool(pool.filter(p => p.id !== selected.id));
      setSelected(null);
    } else {
      playSound('damage');
      onRecord(selected.id, false);
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
    <div className="max-w-xl mx-auto py-20 text-center animate-pop px-4">
      <div className="text-8xl mb-8">⚔️</div>
      <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase">Level Fuldført!</h2>
      <p className="text-2xl font-black text-blue-900 mb-10 italic">Hjerter tilbage: {hearts} / 3</p>
      <button onClick={() => { 
        playSound('victory');
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        if (nextStreak > highScore) setHighScore(nextStreak);
        setupLevel();
      }} className={`${UI.btn} ${UI.primary} px-16 py-6 text-2xl uppercase w-full md:w-auto`}>NÆSTE OPGAVE →</button>
    </div>
  );

  return (
    <div className={`max-w-6xl mx-auto py-4 px-4 h-full flex flex-col ${shake ? 'animate-bounce' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ LUK</button>
        <div className="flex gap-1 md:gap-2">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-2xl md:text-4xl">{i < hearts ? '❤️' : '🖤'}</span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-[8px] md:text-xs font-black uppercase text-slate-400">Streak: {streak}</p>
          <p className="text-[8px] md:text-xs font-black uppercase text-blue-900">High: {highScore}</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 border-4 border-slate-900 p-4 md:p-8 flex items-center justify-center overflow-auto mb-6 shadow-inner">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-2 min-w-max px-4 md:px-20">
          {placed.map((p, i) => (
            <React.Fragment key={p.id}>
              <button 
                disabled={!selected} 
                onClick={() => handlePlace(i)} 
                className={`w-10 h-10 md:w-12 md:h-12 border-4 border-dashed border-slate-900 rounded-full transition-all flex items-center justify-center font-black ${selected ? 'bg-blue-300 hover:scale-125' : 'opacity-20 cursor-not-allowed'}`}
              >
                +
              </button>
              <div className="bg-white border-4 border-slate-900 p-3 md:p-5 w-40 md:w-48 text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <span className="block text-blue-900 font-black text-[10px] md:text-xs border-b-2 border-slate-100 mb-2 md:mb-3">{p.date}</span>
                <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-900 leading-tight block">{p.title}</span>
              </div>
              {i === placed.length - 1 && (
                <button 
                  disabled={!selected} 
                  onClick={() => handlePlace(i + 1)} 
                  className={`w-10 h-10 md:w-12 md:h-12 border-4 border-dashed border-slate-900 rounded-full transition-all flex items-center justify-center font-black ${selected ? 'bg-blue-300 hover:scale-125' : 'opacity-20 cursor-not-allowed'}`}
                >
                  +
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-white border-4 border-slate-900 flex flex-wrap justify-center gap-2 md:gap-3 max-h-48 overflow-y-auto shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        {pool.map(p => (
          <button 
            key={p.id} 
            onClick={() => setSelected(p)} 
            className={`${UI.btn} ${selected?.id === p.id ? 'bg-blue-300 scale-105 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-100'}`}
          >
            {scrubDate(p.title)}
          </button>
        ))}
      </div>
    </div>
  );
};

const QuizSession = ({ questions, onExit, title, onRecord }) => {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const q = questions[idx];
  const options = useMemo(() => q?.options ? shuffle(q.options) : [], [q]);

  if (!q) return <div className="p-20 text-center"><button onClick={onExit} className={UI.btn}>TILBAGE</button></div>;

  const handleSelect = (o) => {
    if (isAnswered) return;
    setSelected(o);
    setIsAnswered(true);
    const isCorrect = o === q.correctAnswer;
    if (isCorrect) playSound('success'); else playSound('damage');
    if (q.entryId) {
      onRecord(q.entryId, isCorrect);
    }
  };

  const handleNext = () => {
    if (idx < questions.length - 1) {
      setIdx(prev => prev + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-bold text-slate-900 border-2 border-slate-900 px-4 py-1">{idx + 1} / {questions.length}</span>
      </div>
      <div className={`${UI.card} shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
        <p className="text-xs font-black text-slate-500 uppercase mb-4">{title}</p>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-10 leading-snug">{q.question}</h2>
        <div className="space-y-3">
          {options.map(o => (
            <button 
              key={o} 
              disabled={isAnswered} 
              onClick={(e) => { e.preventDefault(); handleSelect(o); }}
              className={`w-full text-left p-4 md:p-5 border-2 transition-all font-bold text-sm md:text-base ${
                isAnswered 
                  ? (o === q.correctAnswer 
                      ? 'bg-green-300 border-slate-900' 
                      : (o === selected ? 'bg-red-300 border-slate-900' : 'opacity-30 border-slate-200')) 
                  : 'bg-white hover:bg-slate-50 border-slate-900'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
        {isAnswered && (
          <div className="mt-8 animate-pop">
            <button 
              onClick={handleNext}
              className={`${UI.btn} ${UI.primary} w-full py-6 text-xl uppercase`}
            >
              Næste Spørgsmål →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SourceAnalysis = ({ sources, onExit, onRecord }) => {
  const [curr, setCurr] = useState(0);
  const [answeredMap, setAnsweredMap] = useState<Record<number, string>>({});
  
  const s = sources[curr];

  const shuffledOptionsPerQuestion = useMemo(() => {
    if (!s) return [];
    return s.questions.map(q => shuffle(q.options));
  }, [s]);

  if (!s) return <div className="p-20 text-center"><button onClick={onExit} className={UI.btn}>TILBAGE</button></div>;

  const handleSourceAnswer = (qIdx: number, selected: string) => {
    if (answeredMap[qIdx]) return;
    const q = s.questions[qIdx];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) playSound('success'); else playSound('damage');
    setAnsweredMap(prev => ({ ...prev, [qIdx]: selected }));
    onRecord(s.id, isCorrect);
  };

  const handleNextSource = () => {
    if (curr < sources.length - 1) {
      setCurr(prev => prev + 1);
      setAnsweredMap({});
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onExit} className={`${UI.btn} ${UI.secondary}`}>✕ AFSLUT</button>
        <span className="font-black text-slate-900 border-2 border-slate-900 px-4 py-1 uppercase text-xs">{curr + 1} / {sources.length}</span>
      </div>
      <div className={`${UI.card} shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]`}>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter">📜 {s.title}</h2>
        <div className="bg-slate-50 border-2 border-slate-200 p-4 md:p-8 mb-10 text-slate-900 font-serif italic text-base md:text-lg leading-relaxed whitespace-pre-wrap border-l-8 border-l-blue-900">
          "{s.text}"
        </div>
        <div className="space-y-8 md:space-y-12">
          {s.questions.map((q, qIdx) => {
            const selected = answeredMap[qIdx];
            const isAnswered = !!selected;

            return (
              <div key={qIdx} className="border-t-4 border-slate-100 pt-8 md:pt-10">
                <p className="font-black text-lg md:text-xl text-slate-900 mb-6 uppercase tracking-tight">Analyse: {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shuffledOptionsPerQuestion[qIdx].map(o => (
                    <button 
                      key={o} 
                      disabled={isAnswered}
                      onClick={() => handleSourceAnswer(qIdx, o)}
                      className={`p-4 md:p-5 border-2 text-left text-xs md:text-sm font-black transition-all ${
                        isAnswered
                          ? (o === q.correctAnswer 
                              ? 'bg-green-300 border-slate-900' 
                              : (o === selected ? 'bg-red-300 border-slate-900' : 'opacity-30 border-slate-200'))
                          : 'bg-white border-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-16 pt-8 border-t-4 border-slate-100 flex justify-between items-center">
          <button 
            disabled={curr === 0} 
            onClick={() => { setCurr(curr - 1); setAnsweredMap({}); }} 
            className="font-black text-slate-400 uppercase disabled:opacity-0 hover:text-slate-900 text-xs"
          >
            ← Forrige
          </button>
          <button 
            onClick={handleNextSource} 
            className={`${UI.btn} ${UI.primary} px-10`}
          >
            {curr < sources.length - 1 ? 'NÆSTE KILDE →' : 'AFSLUT →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NOTES VIEWER COMPONENT ---

const NoteViewer = ({ selectedTopicId }) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedTopicId === null) return;
    setLoading(true);
    setError(null);
    const noteUrl = `./notes/emne${selectedTopicId}.html`;
    
    fetch(noteUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}: Noter ikke fundet.`);
        return res.text();
      })
      .then(html => setContent(html))
      .catch(err => {
        console.error(err);
        setError("Kunne ikke indlæse noter for dette emne. Sørg for at filen findes i /notes/ folderen.");
      })
      .finally(() => setLoading(false));
  }, [selectedTopicId]);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 bg-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative flex flex-col overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-900 border-t-blue-400 rounded-full animate-spin"></div>
                <span className="font-black uppercase text-xs">Henter Pensum...</span>
             </div>
          </div>
        )}
        {error ? (
          <div className="p-20 text-center h-full flex flex-col justify-center items-center bg-slate-50">
             <span className="text-6xl mb-6">🏜️</span>
             <h3 className="text-xl font-black uppercase text-slate-900 mb-2">Noter Mangler</h3>
             <p className="text-sm font-bold text-slate-500 max-w-xs">{error}</p>
          </div>
        ) : content ? (
          <iframe 
            srcDoc={content} 
            className="w-full h-full border-none"
            title="Curriculum Noter"
          />
        ) : null}
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY + '_stats') || '{}'));
  
  const [gameSelIds, setGameSelIds] = useState(() => TOPICS.map(t => t.id));
  const [noteSelId, setNoteSelId] = useState('1'); 
  
  const [view, setView] = useState('menu');
  const [menuTab, setMenuTab] = useState<'games' | 'notes'>('games');
  const [shuffledContent, setShuffledContent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(STORAGE_KEY + '_hs') || '0'));

  useEffect(() => localStorage.setItem(STORAGE_KEY + '_stats', JSON.stringify(stats)), [stats]);
  useEffect(() => localStorage.setItem(STORAGE_KEY + '_hs', highScore.toString()), [highScore]);

  const filtered = useMemo(() => ({
    entries: HISTORY_ENTRIES.filter(e => gameSelIds.includes(e.topicId)),
    exams: EXAM_INTERPRETATIONS.filter(e => gameSelIds.includes(e.topicId)),
    sources: PRIMARY_SOURCES.filter(e => gameSelIds.includes(e.topicId))
  }), [gameSelIds]);

  const { masteryData, topicDetails } = useMemo(() => {
    const allContentInScope = [
      ...HISTORY_ENTRIES.filter(e => gameSelIds.includes(e.topicId)),
      ...PRIMARY_SOURCES.filter(e => gameSelIds.includes(e.topicId)),
      ...EXAM_INTERPRETATIONS.filter(e => gameSelIds.includes(e.topicId))
    ];
    const totalContentIds = allContentInScope.map(c => c.id);
    
    let masteredCount = 0;
    Object.entries(stats).forEach(([id, val]) => {
      if (totalContentIds.includes(id) && (val as any).correct > 0) {
        masteredCount++;
      }
    });

    const masteryPercent = totalContentIds.length > 0 ? Math.round((masteredCount / totalContentIds.length) * 100) : 0;

    const topicResults = TOPICS.map(t => {
      const topicIds = [
        ...HISTORY_ENTRIES.filter(e => e.topicId === t.id),
        ...PRIMARY_SOURCES.filter(e => e.topicId === t.id),
        ...EXAM_INTERPRETATIONS.filter(e => e.topicId === t.id)
      ].map(c => c.id);
      
      let masteredInTopic = 0;
      Object.entries(stats).forEach(([id, val]) => {
        if (topicIds.includes(id) && (val as any).correct > 0) {
          masteredInTopic++;
        }
      });
      const tPercent = topicIds.length > 0 ? Math.round((masteredInTopic / topicIds.length) * 100) : 0;
      return { id: t.id, title: t.title, percent: tPercent, count: masteredInTopic, total: topicIds.length };
    });

    return { 
      masteryData: { percent: masteryPercent, masteredCount, total: totalContentIds.length },
      topicDetails: topicResults.filter(t => gameSelIds.includes(t.id))
    };
  }, [stats, gameSelIds]);

  const recordStat = (id: string, ok: boolean) => {
    setStats(p => {
      const s = p[id] || { count: 0, correct: 0 };
      return { ...p, [id]: { count: s.count + 1, correct: s.correct + (ok ? 1 : 0) } };
    });
  };

  const startModule = (targetView) => {
    if (targetView === 'flashcards') setShuffledContent(shuffle(filtered.entries));
    if (targetView === 'quiz') setShuffledContent(shuffle(filtered.entries.flatMap(e => (e.questions || []).map(q => ({ ...q, entryId: e.id })))));
    if (targetView === 'exam') setShuffledContent(shuffle(filtered.exams.flatMap(e => (e.subtext || []).map(s => ({ ...s, entryId: e.id })))));
    if (targetView === 'sources') setShuffledContent(shuffle(filtered.sources));
    if (targetView === 'timeline') {
      setStreak(0);
      setHearts(3);
    }
    setView(targetView);
  };

  if (view !== 'menu') {
    return (
      <div className="bg-slate-50 min-h-screen overflow-y-auto">
        {view === 'flashcards' && <FlashcardSession entries={shuffledContent} onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'quiz' && <QuizSession questions={shuffledContent} title="Begrebs Quiz" onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'timeline' && <TimelineQuest entries={filtered.entries} streak={streak} setStreak={setStreak} hearts={hearts} setHearts={setHearts} highScore={highScore} setHighScore={setHighScore} onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'sources' && <SourceAnalysis sources={shuffledContent} onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'exam' && <QuizSession questions={shuffledContent} title="Eksamenstræner" onExit={() => setView('menu')} onRecord={recordStat} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      
      {/* SIDEBAR DOCK */}
      <aside className={`${UI.sidebar} ${isSidebarOpen ? 'w-80' : 'w-16'} relative z-30`}>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border-2 border-slate-900 w-6 h-6 rounded-full flex items-center justify-center z-40 hover:bg-slate-50 shadow-sm"
        >
          <span className="text-[10px] font-black">{isSidebarOpen ? '←' : '→'}</span>
        </button>

        <div className={`p-4 md:p-6 border-b-2 border-slate-900 flex-shrink-0 ${!isSidebarOpen && 'items-center'}`}>
          <h1 className={`font-black uppercase italic tracking-tighter leading-none ${isSidebarOpen ? 'text-xl' : 'text-[10px] text-center'}`}>
            {isSidebarOpen ? 'HF Historie' : 'HF-H'}
          </h1>
          {isSidebarOpen && <p className="text-[9px] font-black text-blue-900 uppercase mt-1">Dansk Eksamen Mastery</p>}
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 md:p-6 min-h-0">
          {isSidebarOpen && (
            <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest px-2">
              {menuTab === 'games' ? 'Vælg Træning' : 'Vælg Læsning'}
            </p>
          )}
          
          <div className="space-y-2">
            {TOPICS.map(t => {
              const isMetode = t.id === '0';
              const isDisabled = menuTab === 'notes' && isMetode;
              const isSelected = menuTab === 'games' ? gameSelIds.includes(t.id) : noteSelId === t.id;

              return (
                <label 
                  key={t.id} 
                  className={`transition-all ${
                    isSidebarOpen 
                      ? `flex items-start gap-3 p-2 md:p-3 border-2 ${isDisabled ? 'opacity-30 cursor-not-allowed bg-slate-200 grayscale' : isSelected ? 'border-slate-900 bg-blue-50' : 'border-slate-100'} ${!isDisabled && 'cursor-pointer hover:border-slate-400'}`
                      : (isSelected ? 'flex justify-center p-0 mb-4' : 'hidden')
                  }`}
                  title={t.title}
                >
                  <input 
                    type={menuTab === 'games' ? "checkbox" : "radio"} 
                    className={`${isSidebarOpen ? 'mt-1' : 'hidden'}`} 
                    disabled={isDisabled}
                    checked={isSelected} 
                    onChange={() => {
                      if (menuTab === 'games') {
                        setGameSelIds(s => s.includes(t.id) ? s.filter(x => x !== t.id) : [...s, t.id]);
                      } else {
                        setNoteSelId(t.id);
                      }
                    }} 
                  />
                  {!isSidebarOpen && isSelected && (
                    <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 animate-pop">
                      {t.id}
                    </div>
                  )}
                  {isSidebarOpen && (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase leading-snug">{t.title}</span>
                      {isDisabled && <span className="text-[8px] font-bold text-red-500 uppercase italic">Ingen noter</span>}
                    </div>
                  )}
                </label>
              );
            })}
          </div>
          {menuTab === 'games' && isSidebarOpen && (
            <div className="pt-4 px-2 flex gap-4">
              <button onClick={() => setGameSelIds(TOPICS.map(t => t.id))} className="text-[9px] font-black text-blue-900 underline uppercase hover:text-blue-500">Alt</button>
              <button onClick={() => setGameSelIds([])} className="text-[9px] font-black text-red-900 underline uppercase hover:text-red-500">Ingen</button>
            </div>
          )}
        </div>

        <div className={`flex-shrink-0 mt-auto p-4 border-t-2 border-slate-200 ${!isSidebarOpen && 'items-center px-2'}`}>
          {isSidebarOpen ? (
            <>
              <div className="flex items-center justify-between mb-4 bg-white p-3 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <span className="text-[10px] font-black uppercase text-slate-500">Mestring</span>
                <span className="text-2xl font-black text-blue-900 italic">{masteryData.percent}%</span>
              </div>
              
              <div className="bg-white border-2 border-slate-900 p-3">
                <h4 className="font-black text-[9px] uppercase mb-3 border-b border-slate-100 pb-1 flex justify-between">
                  <span>Fremgang</span>
                  <span className="text-blue-900">{masteryData.masteredCount}/{masteryData.total}</span>
                </h4>
                
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1 text-[9px]">
                  {topicDetails.map(td => (
                    <div key={td.id} className="space-y-1">
                      <div className="flex justify-between font-black uppercase">
                        <span className="truncate w-3/4">{td.title}</span>
                        <span className={td.percent > 70 ? "text-green-600" : td.percent > 30 ? "text-yellow-600" : "text-red-600"}>{td.percent}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 transition-all duration-700" style={{ width: `${td.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 border-2 border-slate-900 flex items-center justify-center font-black text-xs italic bg-blue-50">
                  {masteryData.percent}%
                </div>
             </div>
          )}
        </div>
      </aside>

      <main className={UI.main}>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b-8 border-slate-900 pb-4 gap-4">
          <div className="flex gap-1 md:gap-2">
            <button 
              onClick={() => setMenuTab('games')} 
              className={`px-4 md:px-8 py-2 md:py-3 font-black uppercase text-[10px] md:text-sm border-2 md:border-4 border-slate-900 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] md:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${menuTab === 'games' ? 'bg-slate-900 text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
            >
              🎮 Spil
            </button>
            <button 
              onClick={() => setMenuTab('notes')} 
              className={`px-4 md:px-8 py-2 md:py-3 font-black uppercase text-[10px] md:text-sm border-2 md:border-4 border-slate-900 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] md:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${menuTab === 'notes' ? 'bg-slate-900 text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
            >
              📝 Noter
            </button>
          </div>
          <div className="text-left md:text-right w-full md:w-auto overflow-hidden">
             <h2 className="text-[10px] font-black uppercase text-slate-400">HF Historie Mastery</h2>
             <p className="text-sm md:text-lg font-black uppercase italic text-slate-900 truncate">
               {menuTab === 'games' ? 'Vælg Træning' : `${TOPICS.find(t => t.id === noteSelId)?.title}`}
             </p>
          </div>
        </div>

        {menuTab === 'games' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 animate-pop pb-10">
            <button onClick={() => startModule('flashcards')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-1`}>
              <div className="text-3xl md:text-5xl mb-4 md:mb-6">🗂️</div>
              <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-4 uppercase italic">Flashcards</h3>
              <p className="text-xs md:text-sm text-slate-700 font-bold mb-6 md:mb-8">Paratviden fra feudaltiden til det senmoderne.</p>
              <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase py-3 md:py-4`}>Start</div>
            </button>
            <button onClick={() => startModule('quiz')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-1`}>
              <div className="text-3xl md:text-5xl mb-4 md:mb-6">🎯</div>
              <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-4 uppercase italic">Videns Quiz</h3>
              <p className="text-xs md:text-sm text-slate-700 font-bold mb-6 md:mb-8">Feedback på dine historiske fakta.</p>
              <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase py-3 md:py-4`}>Tag Quiz</div>
            </button>
            <button onClick={() => startModule('timeline')} className={`${UI.card} text-left md:col-span-2 hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-yellow-50 flex flex-col md:flex-row items-center gap-4 md:gap-10 transition-transform hover:-translate-y-1`}>
              <div className="text-5xl md:text-7xl">⚔️</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-4xl font-black mb-2 md:mb-4 uppercase italic">Timeline Quest</h3>
                <p className="text-xs md:text-md text-slate-700 font-bold max-w-2xl mb-6 md:mb-8">Placer kortene korrekt. Beskyt dine liv!</p>
                <div className={`${UI.btn} ${UI.primary} px-8 md:px-16 py-3 md:py-5 uppercase text-base md:text-lg w-full md:w-auto`}>Start Quest</div>
              </div>
            </button>
            <button onClick={() => startModule('sources')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-1`}>
              <div className="text-3xl md:text-5xl mb-4 md:mb-6">📜</div>
              <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-4 uppercase italic">Kilde Analyse</h3>
              <p className="text-xs md:text-sm text-slate-700 font-bold mb-6 md:mb-8">Dyk ned i kilder og træn din kildekritik.</p>
              <div className={`${UI.btn} ${UI.success} w-full text-center uppercase py-3 md:py-4`}>Analysér</div>
            </button>
            <button onClick={() => startModule('exam')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-slate-100 transition-transform hover:-translate-y-1`}>
              <div className="text-3xl md:text-5xl mb-4 md:mb-6">💡</div>
              <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-4 uppercase italic">Eksamenstræner</h3>
              <p className="text-xs md:text-sm text-slate-700 font-bold mb-6 md:mb-8">Forstå censorernes forventninger.</p>
              <div className={`${UI.btn} ${UI.secondary} w-full text-center uppercase py-3 md:py-4`}>Åbn</div>
            </button>
          </div>
        ) : (
          <div className="animate-pop h-full flex flex-col min-h-0 pb-10">
             <NoteViewer selectedTopicId={noteSelId} />
          </div>
        )}
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
