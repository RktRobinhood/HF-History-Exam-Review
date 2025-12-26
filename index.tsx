import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, EXAM_SETS, PRIMARY_SOURCES } from './data/index.js';

// --- UTILITIES ---
const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

const playSound = (type: 'start' | 'damage' | 'success' | 'victory') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'start') { osc.type = 'triangle'; [261, 329, 392].forEach((f, i) => osc.frequency.setValueAtTime(f, now + i * 0.1)); gain.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.4); }
    else if (type === 'damage') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); gain.gain.setValueAtTime(0.2, now); osc.start(now); osc.stop(now + 0.2); }
    else if (type === 'success') { osc.type = 'sine'; osc.frequency.setValueAtTime(880, now); gain.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.1); }
    else if (type === 'victory') { osc.type = 'square'; [440, 554, 659, 880].forEach((f, i) => osc.frequency.setValueAtTime(f, now + i * 0.1)); gain.gain.setValueAtTime(0.1, now); osc.start(now); osc.stop(now + 0.8); }
  } catch (e) {}
};

// --- COMPONENTS ---

const NoteViewer = ({ selectedTopicId }: { selectedTopicId: string }) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(`./notes/emne${selectedTopicId}.html`)
      .then(res => res.ok ? res.text() : Promise.reject())
      .then(html => { setContent(html); setError(false); })
      .catch(() => setError(true));
  }, [selectedTopicId]);
  return (
    <div className="flex-1 bg-white border-8 border-slate-900 h-full relative shadow-[12px_12px_0px_rgba(0,0,0,0.1)]">
      {error ? (
        <div className="p-20 text-center font-black h-full flex items-center justify-center flex-col gap-4">
           <span className="text-6xl">🏜️</span>
           <span className="uppercase text-slate-400 font-bold">NOTER MANGLER FOR DETTE EMNE</span>
        </div>
      ) : <iframe srcDoc={content || ''} className="w-full h-full border-none" title="Notes" />}
    </div>
  );
};

const FlashcardSession = ({ entries, onExit, onRecord }: any) => {
  const [queue, setQueue] = useState(() => shuffle([...entries]));
  const [revealed, setRevealed] = useState(false);
  const current = queue[0];
  if (!current) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-pop">
      <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">Session Færdig!</h2>
      <button onClick={onExit} className="bg-blue-300 border-4 border-slate-900 px-12 py-6 text-xl font-black shadow-[8px_8px_0px_black] uppercase italic text-slate-900">TILBAGE TIL DOCK</button>
    </div>
  );
  const handleResponse = (ok: boolean) => {
    onRecord(current.id, ok);
    if (ok) { setRevealed(false); setQueue((prev: any[]) => prev.slice(1)); } 
    else { setRevealed(false); }
  };
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-full overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900">✕ LUK</button>
        <span className="font-black text-slate-900 uppercase text-xs bg-white px-4 py-2 border-4 border-slate-900 shadow-[4px_4px_0px_black]">Kort tilbage: {queue.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-10 min-h-[400px] flex flex-col justify-center text-center shadow-[12px_12px_0px_black] rounded-xl transform transition-transform">
        {!revealed ? (
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-4 border-b-2 border-slate-50 pb-2">Hvad betyder...?</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-16 px-4 uppercase leading-tight tracking-tighter">{current.title}</h2>
            <button onClick={() => setRevealed(true)} className="bg-blue-300 border-4 border-slate-900 w-full py-8 text-2xl font-black uppercase italic shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-slate-900">Vis Svar</button>
          </div>
        ) : (
          <div className="animate-pop p-4">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 text-left border-l-4 border-blue-300 pl-2">Definition</h3>
            <p className="text-xl md:text-2xl text-slate-900 font-bold mb-12 italic leading-relaxed text-left border-l-8 border-blue-200 pl-6">"{current.description}"</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => handleResponse(false)} className="bg-red-400 text-white border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-red-500">IGEN</button>
              <button onClick={() => handleResponse(false)} className="bg-yellow-300 border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-yellow-400 text-slate-900">SVÆRT</button>
              <button onClick={() => handleResponse(true)} className="bg-green-400 border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-green-500 text-slate-900">OK</button>
              <button onClick={() => handleResponse(true)} className="bg-blue-400 text-white border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-blue-500">LET</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuizSession = ({ entries, onExit, title, onRecord }: any) => {
  const sessionData = useMemo(() => {
    const raw = entries.flatMap((e: any) => (e.questions || []).map((q: any) => ({ ...q, entryId: e.id, options: shuffle([...q.options]) })));
    return shuffle(raw);
  }, [entries]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const currentQ = sessionData[idx];
  if (!currentQ) return <div className="p-20 text-center"><button onClick={onExit} className="bg-slate-900 text-white p-4 border-4">GÅ TIL MENUEN</button></div>;
  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelected(option); setIsAnswered(true);
    const correct = option === currentQ.correctAnswer;
    if (correct) playSound('success'); else playSound('damage');
    onRecord(currentQ.entryId, correct);
  };
  return (
    <div className="max-w-2xl mx-auto py-8 h-full overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900">✕ AFBRYD</button>
        <span className="font-black border-4 border-slate-900 px-6 py-2 uppercase text-xs bg-white shadow-[4px_4px_0px_black] text-slate-900">{idx + 1} / {sessionData.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-10 shadow-[16px_16px_0px_black] rounded-2xl">
        <p className="text-[10px] font-black text-blue-600 uppercase mb-6 tracking-widest border-b-2 border-slate-100 pb-2">{title}</p>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 leading-tight tracking-tight">{currentQ.question}</h2>
        <div className="space-y-4">
          {currentQ.options.map((o: string) => (
            <button key={o} disabled={isAnswered} onClick={() => handleSelect(o)} className={`w-full text-left p-6 border-4 transition-all font-black text-lg shadow-[4px_4px_0px_black] ${isAnswered ? (o === currentQ.correctAnswer ? 'bg-green-400 border-slate-900 text-slate-900' : (o === selected ? 'bg-red-400 text-white' : 'opacity-30 grayscale')) : 'bg-white hover:bg-blue-50 text-slate-900'}`}>
              {o}
            </button>
          ))}
        </div>
        {isAnswered && (
          <div className="mt-8 border-t-8 border-slate-900 pt-10">
            <button onClick={() => idx < sessionData.length - 1 ? (setIdx(idx + 1), setSelected(null), setIsAnswered(false)) : onExit()} className="bg-blue-400 text-slate-900 border-4 border-slate-900 w-full py-8 text-3xl font-black uppercase shadow-[10px_10px_0px_black]">{idx < sessionData.length - 1 ? 'NÆSTE →' : 'AFSLUT'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

const SourceAnalysis = ({ sources, onExit, onRecord }: any) => {
  const sessionSources = useMemo(() => shuffle([...sources]), [sources]);
  const [curr, setCurr] = useState(0);
  const [activeAnswers, setActiveAnswers] = useState<Record<number, string>>({});
  const currentSource = sessionSources[curr];
  
  const currentQuestions = useMemo(() => 
    currentSource?.questions?.map((q: any, i: number) => ({ 
      ...q, 
      id: i, 
      shuffledOptions: shuffle([...q.options]) 
    })) || [], 
  [currentSource?.id]);

  const handleAnswer = (idx: number, opt: string) => {
    if (activeAnswers[idx]) return;
    const ok = opt === currentSource.questions[idx].correctAnswer;
    if (ok) playSound('success'); else playSound('damage');
    setActiveAnswers(p => ({ ...p, [idx]: opt }));
    onRecord(currentSource.id, ok);
  };

  if (!currentSource) return <div className="text-center p-20"><button onClick={onExit} className="border-4 p-4 border-slate-900 font-black uppercase text-slate-900">VÆLG EMNER I SIDEBAREN</button></div>;

  return (
    <div className="max-w-4xl mx-auto py-12 h-full overflow-y-auto no-scrollbar pb-48 px-4">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900">✕ AFBRYD</button>
        <span className="font-black bg-yellow-300 border-4 border-slate-900 px-6 py-2 uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900">KILDE {curr + 1} / {sessionSources.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-12 shadow-[20px_20px_0px_black] rounded-3xl">
        <h2 className="text-4xl font-black mb-8 underline decoration-blue-400 decoration-8 uppercase italic tracking-tighter leading-tight text-slate-900">{currentSource.title}</h2>
        <div className="bg-slate-50 border-4 border-slate-900 p-10 mb-12 italic text-2xl leading-relaxed whitespace-pre-wrap border-l-[16px] border-l-slate-900 rounded-r-2xl shadow-inner text-slate-900">
          "{currentSource.text}"
        </div>
        <div className="space-y-16">
          {currentQuestions.map((q: any) => (
            <div key={q.id} className="border-t-8 border-slate-100 pt-10">
              <p className="font-black text-2xl mb-8 leading-tight italic underline decoration-yellow-300 text-slate-900">"{q.question}"</p>
              <div className="grid grid-cols-1 gap-4">
                {q.shuffledOptions.map((o: string) => (
                  <button 
                    key={o} 
                    disabled={!!activeAnswers[q.id]}
                    onClick={() => handleAnswer(q.id, o)} 
                    className={`p-8 border-4 font-black text-left text-lg transition-all ${
                      activeAnswers[q.id] 
                        ? (o === currentSource.questions[q.id].correctAnswer ? 'bg-green-400 border-slate-900 text-slate-900' : (o === activeAnswers[q.id] ? 'bg-red-400 text-white' : 'opacity-30 grayscale')) 
                        : 'bg-white hover:bg-blue-50 border-slate-900 shadow-[6px_6px_0px_black] active:translate-y-1 active:shadow-none text-slate-900'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {activeAnswers[q.id] && currentSource.questions[q.id].explanation && (
                <div className="mt-6 bg-blue-50 border-4 border-blue-400 p-6 text-sm font-bold text-blue-900 italic animate-pop">
                  INFO: {currentSource.questions[q.id].explanation}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-20 border-t-8 border-slate-900 pt-10">
          <button 
            onClick={() => curr < sessionSources.length - 1 ? (setCurr(curr + 1), setActiveAnswers({})) : onExit()} 
            className="bg-slate-900 text-white border-4 border-slate-900 w-full py-10 text-3xl font-black uppercase italic shadow-[10px_10px_0px_#3b82f6] hover:translate-x-1"
          >
            {curr < sessionSources.length - 1 ? 'NÆSTE KILDE →' : 'AFSLUT ANALYSE'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TimelineQuest = ({ entries, onExit, hearts, setHearts, onRecord, stats, setStats }: any) => {
  const [placed, setPlaced] = useState<any[]>([]);
  const [pool, setPool] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'victory' | 'gameover'>('playing');

  const setupLevel = useCallback(() => {
    const dated = shuffle(entries.filter((e: any) => e.date));
    if (dated.length < 5) { alert("Vælg flere emner!"); onExit(); return; }
    const levelCards = dated.slice(0, 5);
    setPlaced([levelCards[0]]);
    setPool(levelCards.slice(1));
    setSelected(null);
    setGameState('playing');
    playSound('start');
  }, [entries, onExit]);

  useEffect(() => { if (placed.length === 0 && gameState === 'playing') setupLevel(); }, [setupLevel, placed.length, gameState]);

  const handlePlace = (index: number) => {
    if (!selected) return;
    const getYear = (d: string) => parseInt(d.match(/\d{4}/)?.[0] || '0');
    const targetYear = getYear(selected.date);
    const prevYear = index === 0 ? -Infinity : getYear(placed[index - 1].date);
    const nextYear = index === placed.length ? Infinity : getYear(placed[index].date);
    if (targetYear >= prevYear && targetYear <= nextYear) {
      playSound('success'); onRecord(selected.id, true);
      const newPlaced = [...placed]; newPlaced.splice(index, 0, selected);
      setPlaced(newPlaced); 
      setPool(pool.filter(p => p.id !== selected.id));
      setSelected(null);
      setCurrentStreak(s => {
        const ns = s + 1;
        if (ns > (stats.bestTimeline || 0)) setStats((p: any) => ({ ...p, bestTimeline: ns }));
        return ns;
      });
      if (pool.length === 1) { setGameState('victory'); playSound('victory'); }
    } else {
      playSound('damage'); onRecord(selected.id, false);
      const nextHearts = Math.max(0, hearts - 1);
      setHearts(nextHearts);
      setSelected(null); setCurrentStreak(0);
      if (nextHearts === 0) setGameState('gameover');
    }
  };

  if (gameState === 'gameover') return (
    <div className="fixed inset-0 bg-red-600/90 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-pop overflow-y-auto">
      <div className="bg-white border-8 border-slate-900 p-8 text-center shadow-[20px_20px_0px_black] transform -rotate-2 max-w-lg mx-auto my-12">
        <h2 className="text-5xl font-black uppercase italic mb-4 text-slate-900">HISTORIEN ER BRUDT</h2>
        <p className="text-lg font-bold mb-8 uppercase text-slate-500 italic">Du forårsagede et kronologisk paradoks.</p>
        <button onClick={() => { setHearts(3); setupLevel(); }} className="bg-slate-900 text-white p-6 text-2xl font-black uppercase shadow-[6px_6px_0px_#ef4444] w-full">REPARÉR TIDSLINJE</button>
      </div>
    </div>
  );

  if (gameState === 'victory') return (
    <div className="fixed inset-0 bg-blue-500/90 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-pop overflow-y-auto">
      <div className="bg-white border-8 border-slate-900 p-12 text-center shadow-[30px_30px_0px_black] transform rotate-2 max-w-xl mx-auto my-12">
        <h2 className="text-6xl font-black uppercase italic mb-6 leading-none text-slate-900">TIDENS MESTER</h2>
        <p className="text-xl font-bold mb-8 uppercase text-slate-500 italic">Du har sikret kronologien i denne epoke!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setupLevel()} className="bg-yellow-300 border-4 border-slate-900 p-6 text-xl font-black uppercase shadow-[6px_6px_0px_black] hover:bg-yellow-400 text-slate-900">SPIL IGEN</button>
            <button onClick={onExit} className="bg-slate-900 text-white p-6 text-xl font-black uppercase shadow-[6px_6px_0px_#3b82f6]">HOVEDMENU</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8 bg-slate-900 border-4 border-slate-900 p-6 shadow-[8px_8px_0px_#3b82f6] rounded-xl">
        <button onClick={onExit} className="bg-white border-4 border-slate-900 px-6 py-2 font-black uppercase text-xs text-slate-900">← TILBAGE</button>
        <div className="flex items-center gap-12">
          <div className="text-right">
            <span className="block text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Streak</span>
            <span className="text-4xl font-black italic text-white leading-none">{currentStreak}</span>
          </div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`text-4xl transition-all duration-500 transform ${i < hearts ? 'scale-110 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'grayscale opacity-20 scale-75'}`}>❤️</div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white border-4 border-slate-900 p-12 flex items-center overflow-x-auto mb-10 shadow-inner rounded-3xl relative no-scrollbar">
        <div className="flex items-center gap-6 min-w-max px-20">
          {placed.map((p, i) => (
            <React.Fragment key={p.id}>
              <button disabled={!selected} onClick={() => handlePlace(i)} className={`w-20 h-20 border-4 border-dashed rounded-full flex items-center justify-center transition-all ${selected ? 'bg-yellow-300 border-slate-900 animate-pulse scale-110' : 'opacity-10 border-slate-300'}`}>
                <span className="text-3xl font-black text-slate-900">+</span>
              </button>
              <div className="bg-white border-4 border-slate-900 p-8 w-64 text-center shadow-[10px_10px_0px_#3b82f6] transform">
                <span className="block text-blue-600 font-black text-2xl italic mb-3 tracking-tighter border-b-2 border-blue-50 pb-2">{p.date}</span>
                <span className="text-sm font-black uppercase text-slate-900 leading-tight block whitespace-normal italic">{p.title}</span>
              </div>
              {i === placed.length - 1 && (
                <button disabled={!selected} onClick={() => handlePlace(i + 1)} className={`w-20 h-20 border-4 border-dashed rounded-full flex items-center justify-center transition-all ${selected ? 'bg-yellow-300 border-slate-900 animate-pulse scale-110' : 'opacity-10 border-slate-300'}`}>
                  <span className="text-3xl font-black text-slate-900">+</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="p-10 bg-slate-100 border-8 border-slate-900 shadow-[15px_15px_0px_black] rounded-3xl">
        <div className="flex flex-wrap justify-center gap-6">
          {pool.map(p => (
            <button key={p.id} onClick={() => { setSelected(p); playSound('start'); }} className={`px-8 py-6 border-4 font-black uppercase text-sm transition-all text-slate-900 ${selected?.id === p.id ? 'bg-blue-600 text-white border-slate-900 -translate-y-4 shadow-[0_15px_0_black]' : 'bg-white border-slate-900 shadow-[6px_6px_0px_black]'}`}>
              {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExamMaster = ({ stats, setStats, onExit, onRecord }: any) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'prep' | 'exam' | 'result'>('select');
  const [activeSourceIdx, setActiveSourceIdx] = useState(0);
  const [examStep, setExamStep] = useState(0);
  const [points, setPoints] = useState(0);
  const [matchingState, setMatchingState] = useState<Record<number, string>>({});

  const currentSet = useMemo(() => EXAM_SETS.find(s => s.id === selectedId), [selectedId]);
  
  const shuffledQuestions = useMemo(() => {
    if (!currentSet) return [];
    // Shuffle the questions array and shuffle MCQ options inside each question
    return shuffle(currentSet.questions.map(q => ({
      ...q,
      options: q.type === 'mcq' ? shuffle([...q.options]) : q.options,
      // For matching, we pre-shuffle the right column for the UI
      shuffledMatches: q.type === 'matching' ? shuffle(q.pairs.map((p:any) => p.match)) : []
    })));
  }, [currentSet]);

  const currentQuestion = shuffledQuestions[examStep];

  const handleGrade = () => {
    if (!currentSet) return "00";
    const total = currentSet.questions.length;
    const ratio = points / total;
    // Strict Danish 7-point scale mapping
    if (ratio >= 0.95) return "12";
    if (ratio >= 0.85) return "10";
    if (ratio >= 0.70) return "7";
    if (ratio >= 0.55) return "4";
    if (ratio >= 0.40) return "02";
    if (ratio >= 0.15) return "00";
    return "-3";
  };

  const handleNext = (correct: boolean) => {
    if (correct) { setPoints(p => p + 1); }
    if (examStep < shuffledQuestions.length - 1) { 
      setExamStep(s => s + 1); 
      setMatchingState({}); 
    } else { 
      setPhase('result'); 
    }
  };

  if (phase === 'select') return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-pop">
      <header className="flex justify-between items-center mb-12 border-b-8 border-slate-900 pb-8">
        <h2 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900 underline decoration-blue-500">MUNDTLIG EKSAMEN</h2>
        <button onClick={onExit} className="bg-white border-4 border-slate-900 px-6 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900">✕ AFSLUT</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {EXAM_SETS.map(set => (
          <button key={set.id} onClick={() => { setSelectedId(set.id); setPhase('prep'); }} className="group bg-white border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_black] flex flex-col h-full hover:-translate-y-2 transition-all hover:bg-blue-50">
            <div className="bg-slate-900 text-white inline-block px-3 py-1 font-black text-[10px] uppercase mb-4 w-fit">Emne {set.topicId}</div>
            <h3 className="text-3xl font-black mb-4 uppercase leading-tight group-hover:text-blue-600 text-slate-900" style={{ color: '#0f172a' }}>{set.title}</h3>
            <p className="text-sm font-bold text-slate-600 mb-8 italic flex-1" style={{ color: '#475569' }}>"{set.description}"</p>
            <div className="mt-auto bg-slate-900 text-white py-4 text-center font-black uppercase text-sm shadow-[4px_4px_0px_#3b82f6] group-hover:bg-blue-600">LÆS KILDER OG FORBERED DIG</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (phase === 'prep' && currentSet) return (
    <div className="max-w-6xl mx-auto py-6 flex flex-col h-full px-4 animate-pop overflow-hidden">
      <header className="flex justify-between items-center mb-8 border-b-8 border-slate-900 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setPhase('select')} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs text-slate-900">← TILBAGE</button>
          <h2 className="text-3xl font-black italic uppercase text-slate-400">FASE 1: FORBEREDELSE</h2>
        </div>
        <button onClick={() => { setPhase('exam'); }} className="bg-green-400 border-4 border-slate-900 px-10 py-5 font-black uppercase shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-slate-900">START EKSAMINATION →</button>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden pb-12">
        <div className="w-full lg:w-80 flex flex-col gap-3">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 italic underline">Kildemateriale</span>
          {currentSet.sources.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSourceIdx(i)} className={`p-6 border-4 font-black text-left uppercase text-xs transition-all ${activeSourceIdx === i ? 'bg-slate-900 text-white shadow-[4px_4px_0px_#3b82f6] -translate-x-1' : 'bg-white border-slate-300 text-slate-400 hover:border-slate-900'}`}>KILDE {i+1}: {s.title.substring(0, 30)}...</button>
          ))}
          <div className="mt-auto bg-blue-50 border-4 border-dashed border-blue-400 p-6 text-[11px] font-bold text-blue-800 uppercase italic leading-relaxed">Husk: Under selve eksamen kan du ikke se kildeteksterne. Brug tiden på at forstå kildernes tendens og perspektiv nu.</div>
        </div>
        <div className="flex-1 bg-white border-4 border-slate-900 p-12 overflow-y-auto shadow-inner rounded-3xl relative no-scrollbar">
          <h3 className="text-4xl font-black mb-8 underline decoration-blue-200 decoration-8 leading-tight text-slate-900">{currentSet.sources[activeSourceIdx].title}</h3>
          <div className="bg-slate-50 border-l-[16px] border-slate-900 p-10 mb-10 shadow-sm rounded-r-xl">
             <p className="font-serif italic text-2xl leading-relaxed text-slate-800 whitespace-pre-wrap">"{currentSet.sources[activeSourceIdx].text}"</p>
          </div>
          <div className="border-t-8 border-slate-900 pt-8 mt-12 bg-yellow-50 p-8 rounded-xl shadow-inner">
            <h4 className="font-black text-slate-900 uppercase text-lg mb-3 tracking-widest flex items-center gap-2">🔍 METODISK ANALYSE</h4>
            <p className="text-slate-700 font-bold italic leading-relaxed text-lg">{currentSet.sources[activeSourceIdx].analysis}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === 'exam' && currentSet && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 h-full animate-pop">
        <header className="flex justify-between items-center mb-12 border-b-8 border-slate-900 pb-8">
          <button onClick={() => setPhase('prep')} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs shadow-[2px_2px_0px_black] text-slate-900">← SE KILDER IGEN</button>
          <div className="text-right">
            <h2 className="text-4xl font-black italic uppercase" style={{ color: '#1d4ed8' }}>PROGNOSE: {handleGrade()}</h2>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#475569' }}>KATEGORI: {currentQuestion.category || 'OPGAVE'} | {examStep + 1} / {shuffledQuestions.length}</span>
          </div>
        </header>
        <div className="bg-white border-8 border-slate-900 p-12 shadow-[25px_25px_0px_black] rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 border-l-8 border-b-8 border-slate-900 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900">DET GRØNNE BORD</div>
          <h2 className="text-4xl font-black mb-12 leading-tight uppercase italic tracking-tighter underline decoration-yellow-300 decoration-8 text-slate-900">"{currentQuestion.question}"</h2>
          {currentQuestion.type === 'mcq' ? (
            <div className="space-y-4">
              {currentQuestion.options.map((o: string) => (
                <button key={o} onClick={() => handleNext(o === currentQuestion.correctAnswer)} className="w-full text-left p-8 border-4 border-slate-900 font-black text-xl hover:bg-blue-50 transition-all shadow-[8px_8px_0px_black] active:translate-y-1 active:shadow-none text-slate-900">{o}</button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 bg-slate-50 p-8 border-4 border-slate-900 rounded-xl shadow-inner">
               {currentQuestion.pairs.map((p: any, i: number) => (
                 <div key={i} className="flex flex-col md:flex-row items-stretch gap-4 mb-4">
                    <div className="bg-slate-100 text-slate-900 p-4 font-black uppercase text-sm flex-[1.5] text-center md:text-left min-h-[60px] flex items-center justify-center md:justify-start border-4 border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                      {p.item}
                    </div>
                    <div className="text-2xl font-black text-slate-400 self-center hidden md:block">↔</div>
                    <select 
                      value={matchingState[i] || ""} 
                      onChange={(e) => {
                        const newMatching = {...matchingState, [i]: e.target.value};
                        setMatchingState(newMatching);
                        if (Object.keys(newMatching).length === currentQuestion.pairs.length) {
                           const isAllCorrect = currentQuestion.pairs.every((pair: any, idx: number) => newMatching[idx] === pair.match);
                           setTimeout(() => handleNext(isAllCorrect), 800);
                        }
                      }} 
                      className="p-4 border-4 border-slate-900 font-black text-xs bg-white text-slate-900 flex-[2.5] outline-none h-[60px] focus:ring-4 ring-blue-200"
                    >
                      <option value="">VÆLG MATCH...</option>
                      {currentQuestion.shuffledMatches.map((m: string) => <option key={m} value={m}>{m}</option>)}
                    </select>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'result') return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6 animate-pop overflow-y-auto">
      <div className="bg-white border-[16px] border-slate-900 p-16 rounded-[4rem] shadow-[40px_40px_0px_#3b82f6] text-center max-w-2xl w-full transform -rotate-1 my-12">
        <h2 className="text-4xl font-black mb-8 uppercase text-slate-400 italic leading-none">CENSORENS DOM</h2>
        <div className="text-[14rem] font-black text-slate-900 mb-10 leading-none drop-shadow-[15px_15px_0_#fde047]">{handleGrade()}</div>
        <button onClick={() => { setStats((p: any) => ({ ...p, completedExams: [...(p.completedExams || []), selectedId] })); onExit(); }} className="bg-slate-900 text-white px-16 py-8 text-4xl font-black uppercase italic border-8 border-slate-900 shadow-[10px_10px_0px_#3b82f6] hover:translate-x-1 transition-all">GEM OG AFSLUT</button>
      </div>
    </div>
  );
  return null;
};

const Sidebar = ({ isOpen, setIsOpen, menuTab, gameSelIds, setGameSelIds, noteSelId, setNoteSelId, stats }: any) => {
  const toggleTopic = (id: string) => {
    if (menuTab === 'games') setGameSelIds((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    else setNoteSelId(id);
  };
  return (
    <aside className={`border-r-4 border-slate-900 bg-slate-50 transition-all duration-300 flex flex-col h-full overflow-hidden z-30 shadow-[4px_0px_20px_rgba(0,0,0,0.1)] relative ${isOpen ? 'w-80' : 'w-20'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="absolute -right-5 top-12 bg-white border-4 border-slate-900 w-10 h-10 rounded-full flex items-center justify-center z-40 shadow-[2px_2px_0px_black]">
        <span className="text-sm font-black text-slate-900">{isOpen ? '←' : '→'}</span>
      </button>
      <div className={`p-8 border-b-4 border-slate-900 bg-white ${!isOpen && 'flex justify-center p-4'}`}>
        <h1 className={`font-black uppercase italic tracking-tighter leading-none text-slate-900 transition-all ${isOpen ? 'text-3xl' : 'text-[10px]'}`}>{isOpen ? 'HF HISTORIE' : 'HF'}</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-8 no-scrollbar">
        {TOPICS.map(t => {
          const isSelected = menuTab === 'games' ? gameSelIds.includes(t.id) : noteSelId === t.id;
          return (
            <label key={t.id} className={`flex items-start gap-4 p-4 border-4 transition-all cursor-pointer ${isSelected ? 'border-slate-900 bg-yellow-300 shadow-[4px_4px_0px_black] translate-x-1 -translate-y-1' : 'border-slate-300 bg-white hover:border-slate-500'}`}>
              <input type={menuTab === 'games' ? "checkbox" : "radio"} className={isOpen ? 'mt-1 w-5 h-5 accent-slate-900' : 'hidden'} checked={isSelected} onChange={() => toggleTopic(t.id)} />
              {isOpen ? <span className={`text-[11px] uppercase leading-tight font-black ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>{t.title}</span> : <span className={`font-black text-center w-full ${isSelected ? 'text-slate-900' : 'text-slate-300'}`}>{t.id}</span>}
            </label>
          );
        })}
      </div>
    </aside>
  );
};

const App = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('HF_STATS_PERSISTENT');
    return saved ? JSON.parse(saved) : { completedExams: [], masteryPoints: 0, bestTimeline: 0 };
  });
  const [gameSelIds, setGameSelIds] = useState<string[]>(() => TOPICS.map(t => t.id));
  const [noteSelId, setNoteSelId] = useState('1'); 
  const [view, setView] = useState('menu');
  const [menuTab, setMenuTab] = useState<'games' | 'notes'>('games');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hearts, setHearts] = useState(3);

  useEffect(() => { localStorage.setItem('HF_STATS_PERSISTENT', JSON.stringify(stats)); }, [stats]);

  const filteredEntries = useMemo(() => HISTORY_ENTRIES.filter(e => gameSelIds.includes(e.topicId.toString())), [gameSelIds]);
  const filteredSources = useMemo(() => PRIMARY_SOURCES.filter(s => gameSelIds.includes(s.topicId.toString())), [gameSelIds]);

  const recordStat = (id: string, ok: boolean) => {
    setStats((prev: any) => ({ ...prev, masteryPoints: (prev.masteryPoints || 0) + (ok ? 1 : 0) }));
  };

  const renderContent = () => {
    switch (view) {
      case 'flashcards': return <FlashcardSession entries={filteredEntries} onExit={() => setView('menu')} onRecord={recordStat} />;
      case 'quiz': return <QuizSession entries={filteredEntries} title="Videns Quiz" onExit={() => setView('menu')} onRecord={recordStat} />;
      case 'timeline': return <TimelineQuest entries={filteredEntries} hearts={hearts} setHearts={setHearts} onExit={() => setView('menu')} onRecord={recordStat} stats={stats} setStats={setStats} />;
      case 'exam': return <ExamMaster stats={stats} setStats={setStats} onExit={() => setView('menu')} onRecord={recordStat} />;
      case 'source_analysis': return <SourceAnalysis sources={filteredSources} onExit={() => setView('menu')} onRecord={recordStat} />;
      default: return (
          <div className="flex flex-col h-full animate-pop max-w-6xl mx-auto w-full">
            <header className="mb-12 border-b-8 border-slate-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900 leading-none mb-2">HF REPETITION</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm italic">Eksamens-træner</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setMenuTab('games')} className={`px-10 py-3 border-4 border-slate-900 text-xl font-black italic transition-all text-slate-900 ${menuTab === 'games' ? 'bg-slate-900 text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white shadow-[6px_6px_0px_black]'}`}>🕹️ TRÆNING</button>
                <button onClick={() => setMenuTab('notes')} className={`px-10 py-3 border-4 border-slate-900 text-xl font-black italic transition-all text-slate-900 ${menuTab === 'notes' ? 'bg-slate-900 text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white shadow-[6px_6px_0px_black]'}`}>📖 PENSUM</button>
              </div>
            </header>
            {menuTab === 'games' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24 auto-rows-fr">
                <button onClick={() => setView('flashcards')} className="bg-white border-4 border-slate-900 p-8 text-left hover:bg-slate-50 shadow-[12px_12px_0px_black] group flex flex-col h-full aspect-square">
                  <div className="text-5xl mb-6">🗂️</div>
                  <h3 className="text-2xl font-black mb-3 uppercase italic underline decoration-blue-200 text-slate-900">Begrebs-Drill</h3>
                  <p className="text-[11px] font-bold text-slate-500 mb-8 uppercase tracking-widest flex-1">Træn kernebegreber og definitioner fra pensum.</p>
                  <div className="bg-blue-300 border-4 border-slate-900 px-6 py-4 text-center font-black mt-auto text-slate-900">START DRILL</div>
                </button>
                <button onClick={() => setView('quiz')} className="bg-white border-4 border-slate-900 p-8 text-left hover:bg-slate-50 shadow-[12px_12px_0px_black] group flex flex-col h-full aspect-square">
                  <div className="text-5xl mb-6">🎯</div>
                  <h3 className="text-2xl font-black mb-3 uppercase italic underline decoration-yellow-200 text-slate-900">Videns Quiz</h3>
                  <p className="text-[11px] font-bold text-slate-500 mb-8 uppercase tracking-widest flex-1">Test din viden på tværs af emnerne.</p>
                  <div className="bg-yellow-300 border-4 border-slate-900 px-6 py-4 text-center font-black mt-auto text-slate-900">TAG QUIZ</div>
                </button>
                <button onClick={() => setView('source_analysis')} className="bg-white border-4 border-slate-900 p-8 text-left hover:bg-slate-50 shadow-[12px_12px_0px_black] group flex flex-col h-full aspect-square">
                  <div className="text-5xl mb-6">📜</div>
                  <h3 className="text-2xl font-black mb-3 uppercase italic underline decoration-purple-300 text-slate-900">Kildeanalyse</h3>
                  <p className="text-[11px] font-bold text-slate-500 mb-8 uppercase tracking-widest flex-1">Dyk ned i primærkilder og træn den historiske metode.</p>
                  <div className="bg-purple-300 border-4 border-slate-900 px-6 py-4 text-center font-black mt-auto text-slate-900">ANALYSER KILDER</div>
                </button>
                <button onClick={() => setView('timeline')} className="bg-white border-4 border-slate-900 p-8 text-left hover:bg-slate-50 shadow-[12px_12px_0px_black] group flex flex-col h-full aspect-square">
                  <div className="text-5xl mb-6">⚔️</div>
                  <h3 className="text-2xl font-black mb-3 uppercase italic underline decoration-green-200 text-slate-900">Timeline Quest</h3>
                  <p className="text-[11px] font-bold text-slate-500 mb-8 uppercase tracking-widest flex-1">Placér hændelser kronologisk. Rekord: {stats.bestTimeline || 0}.</p>
                  <div className="bg-green-300 border-4 border-slate-900 px-6 py-4 text-center font-black mt-auto text-slate-900 text-slate-900">START MISSION</div>
                </button>
                <button onClick={() => setView('exam')} className="bg-white border-8 border-slate-900 p-8 text-left hover:bg-slate-50 shadow-[12px_12px_0px_#3b82f6] group flex flex-col h-full md:col-span-2 aspect-auto lg:aspect-[2.1/1]">
                  <div className="flex items-center gap-10 h-full">
                    <div className="text-7xl shrink-0">🎓</div>
                    <div className="flex-1 flex flex-col h-full">
                      <h3 className="text-3xl font-black mb-3 uppercase italic text-slate-900 underline decoration-blue-500">Mundtlig Eksamen (HF)</h3>
                      <p className="text-sm font-bold text-slate-500 mb-8 uppercase italic tracking-widest leading-relaxed flex-1">Fuld simulering med kildemateriale og karakterbedømmelse.</p>
                      <div className="bg-blue-400 text-slate-900 border-4 border-slate-900 px-10 py-5 text-center font-black text-xl shadow-[6px_6px_0px_black] inline-block mt-auto w-fit">GÅ TIL DET GRØNNE BORD</div>
                    </div>
                  </div>
                </button>
              </div>
            ) : <div className="h-full flex flex-col pb-24"><NoteViewer selectedTopicId={noteSelId} /></div>}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative font-sans text-slate-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} menuTab={menuTab} gameSelIds={gameSelIds} setGameSelIds={setGameSelIds} noteSelId={noteSelId} setNoteSelId={setNoteSelId} stats={stats} />
      <main className="flex-1 p-4 md:p-12 bg-slate-100 overflow-y-auto no-scrollbar">{renderContent()}</main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) { createRoot(rootElement).render(<App />); }
