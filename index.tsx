
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES, EXAM_INTERPRETATIONS } from './data/index.js';

// --- UTILS ---
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const STORAGE_KEY = 'hf_master_quest_final_v4';

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
  sidebar: "w-72 border-r-2 border-slate-900 bg-slate-50 p-6 shrink-0 flex flex-col h-full overflow-y-auto",
  main: "flex-1 p-8 bg-white overflow-y-auto"
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
    // We stay on the current card (index 0)
  };

  const handleResponse = (ok) => {
    onRecord(current.id, ok);
    setRevealed(false);
    if (ok) playSound('success');
    setQueue(prev => prev.slice(1));
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
            <h2 className="text-4xl font-black text-slate-900 mb-12 leading-tight px-4">{current.title}</h2>
            <button onClick={() => setRevealed(true)} className={`${UI.btn} ${UI.primary} w-full py-6 text-xl uppercase`}>Vis Svar</button>
          </div>
        ) : (
          <div className="animate-pop">
            <p className="text-2xl text-slate-900 leading-relaxed font-bold mb-8 italic">"{current.description}"</p>
            <div className="grid grid-cols-4 gap-2">
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
    const dated = entries.filter(e => e.date).sort((a, b) => getYear(a.date) - getYear(b.date));
    const shuffled = shuffle([...dated]);
    setPlaced([shuffled[0]]);
    setPool(shuffled.slice(1, 6));
    playSound('start');
  }, [entries]);

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
            <button 
              key={o} 
              disabled={isAnswered} 
              onClick={(e) => { e.preventDefault(); handleSelect(o); }}
              className={`w-full text-left p-5 border-2 transition-all font-bold ${
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
          {s.questions.map((q, qIdx) => {
            const selected = answeredMap[qIdx];
            const isAnswered = !!selected;

            return (
              <div key={qIdx} className="border-t-4 border-slate-100 pt-10">
                <p className="font-black text-xl text-slate-900 mb-6 uppercase tracking-tight">Analyse: {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shuffledOptionsPerQuestion[qIdx].map(o => (
                    <button 
                      key={o} 
                      disabled={isAnswered}
                      onClick={() => handleSourceAnswer(qIdx, o)}
                      className={`p-5 border-2 text-left text-sm font-black transition-all ${
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
        <div className="mt-16 pt-8 border-t-4 border-slate-100 flex justify-between">
          <button 
            disabled={curr === 0} 
            onClick={() => { setCurr(curr - 1); setAnsweredMap({}); }} 
            className="font-black text-slate-400 uppercase disabled:opacity-0 hover:text-slate-900"
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

// --- MAIN APP ---

const App = () => {
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY + '_stats') || '{}'));
  const [selIds, setSelIds] = useState(() => TOPICS.map(t => t.id));
  const [view, setView] = useState('menu');
  const [shuffledContent, setShuffledContent] = useState(null);

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

  // Robust Mastery Logic: Includes Entries, Sources, and Exams for total calculation
  const { masteryData, recommendation, topicDetails } = useMemo(() => {
    const allContentInScope = [
      ...HISTORY_ENTRIES.filter(e => selIds.includes(e.topicId)),
      ...PRIMARY_SOURCES.filter(e => selIds.includes(e.topicId)),
      ...EXAM_INTERPRETATIONS.filter(e => selIds.includes(e.topicId))
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

    const lowestTopic = [...topicResults].filter(t => selIds.includes(t.id)).sort((a, b) => a.percent - b.percent)[0];

    return { 
      masteryData: { percent: masteryPercent, masteredCount, total: totalContentIds.length },
      topicDetails: topicResults.filter(t => selIds.includes(t.id)),
      recommendation: lowestTopic ? lowestTopic.title : "Ingen data endnu"
    };
  }, [stats, selIds]);

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
      <div className="bg-slate-50 min-h-screen">
        {view === 'flashcards' && <FlashcardSession entries={shuffledContent} onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'quiz' && <QuizSession questions={shuffledContent} title="Begrebs Quiz" onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'timeline' && <TimelineQuest entries={filtered.entries} streak={streak} setStreak={setStreak} hearts={hearts} setHearts={setHearts} highScore={highScore} setHighScore={setHighScore} onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'sources' && <SourceAnalysis sources={shuffledContent} onExit={() => setView('menu')} onRecord={recordStat} />}
        {view === 'exam' && <QuizSession questions={shuffledContent} title="Eksamenstræner" onExit={() => setView('menu')} onRecord={recordStat} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <aside className={UI.sidebar}>
        <div className="mb-10 pb-6 border-b-4 border-slate-900 flex-shrink-0">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">HF Historie</h1>
          <p className="text-[10px] font-black text-blue-900 uppercase mt-2">Dansk Eksamen Mastery</p>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Vælg Emner i Pensum</p>
          {TOPICS.map(t => (
            <label key={t.id} className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-all ${selIds.includes(t.id) ? 'border-slate-900 bg-blue-50' : 'border-slate-100 opacity-60'}`}>
              <input type="checkbox" checked={selIds.includes(t.id)} onChange={() => setSelIds(s => s.includes(t.id) ? s.filter(x => x !== t.id) : [...s, t.id])} />
              <span className="text-[11px] font-black uppercase leading-tight">{t.title}</span>
            </label>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <button onClick={() => setSelIds(TOPICS.map(t => t.id))} className="text-[10px] font-black text-blue-900 underline uppercase text-left hover:text-blue-500">Markér Alle</button>
            <button onClick={() => setSelIds([])} className="text-[10px] font-black text-red-900 underline uppercase text-left hover:text-red-500">Fravælg Alle</button>
          </div>
        </div>

        <div className="flex-shrink-0 mt-auto pt-6 border-t-4 border-slate-900 bg-slate-100 -mx-6 px-6 pb-6">
          <div className="p-4 border-4 border-slate-900 bg-white text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-6">
            <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Total Mestring</span>
            <span className="text-5xl font-black text-blue-900 italic leading-none">{masteryData.percent}%</span>
          </div>
          
          <div className="bg-white border-2 border-slate-900 p-4 shadow-[4px_4px_0px_0px_rgba(203,213,225,1)]">
            <h4 className="font-black text-[10px] uppercase mb-4 border-b border-slate-200 pb-2 flex justify-between">
              <span>Fremgang per emne</span>
              <span className="text-blue-900">{masteryData.masteredCount}/{masteryData.total}</span>
            </h4>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {topicDetails.map(td => (
                <div key={td.id} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="truncate w-3/4">{td.title}</span>
                    <span className={td.percent > 70 ? "text-green-600" : td.percent > 30 ? "text-yellow-600" : "text-red-600"}>{td.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-blue-400 transition-all duration-700" style={{ width: `${td.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-slate-100">
              <span className="text-slate-400 font-bold uppercase text-[8px] block mb-1 italic">Anbefalet fokus nu:</span>
              <span className="font-black text-blue-900 uppercase text-[10px] leading-tight block">{recommendation}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className={UI.main}>
        <div className="mb-12 pb-6 border-b-8 border-slate-900 flex justify-between items-end">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Vælg Modul</h2>
          <span className="text-xs font-black bg-slate-900 text-white px-4 py-1 uppercase">{filtered.entries.length} Emner valgt</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => startModule('flashcards')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
            <div className="text-5xl mb-6">🗂️</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Flashcards</h3>
            <p className="text-sm text-slate-700 font-bold mb-8">Test din paratviden og husk de vigtigste begreber fra det feudale til det senmoderne.</p>
            <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase py-4`}>Start Træning</div>
          </button>
          <button onClick={() => startModule('quiz')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Videns Quiz</h3>
            <p className="text-sm text-slate-700 font-bold mb-8">Multiple-choice test i pensum. Få umiddelbar feedback på dine historiske fakta.</p>
            <div className={`${UI.btn} ${UI.primary} w-full text-center uppercase py-4`}>Tag Quiz</div>
          </button>
          <button onClick={() => startModule('timeline')} className={`${UI.card} text-left md:col-span-2 hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-yellow-50 flex items-center gap-10`}>
            <div className="text-7xl">⚔️</div>
            <div className="flex-1">
              <h3 className="text-4xl font-black mb-4 uppercase italic">Timeline Quest</h3>
              <p className="text-md text-slate-700 font-bold max-w-2xl mb-8">Beskyt dine hjerter! Sortér begivenheder korrekt for at opnå den højeste streak. 3 liv pr. quest.</p>
              <div className={`${UI.btn} ${UI.primary} px-16 py-5 uppercase text-lg`}>Start Quest</div>
            </div>
          </button>
          <button onClick={() => startModule('sources')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`}>
            <div className="text-5xl mb-6">📜</div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Kilde Analyse</h3>
            <p className="text-sm text-slate-700 font-bold mb-8">Dyk ned i lange uddrag og træn din kildekritik med specifikke analyseopgaver.</p>
            <div className={`${UI.btn} ${UI.success} w-full text-center uppercase py-4`}>Analysér</div>
          </button>
          <button onClick={() => startModule('exam')} className={`${UI.card} text-left hover:bg-slate-50 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] bg-slate-100`}>
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

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
