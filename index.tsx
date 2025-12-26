import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES } from './data/index.js';

/** UTILS **/
const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

const playSound = (type: 'start' | 'damage' | 'success' | 'victory') => {
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

/** COMPONENTS **/

const Sidebar = ({ isOpen, setIsOpen, menuTab, gameSelIds, setGameSelIds, noteSelId, setNoteSelId, stats }: any) => {
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
      <button onClick={() => setIsOpen(!isOpen)} className="absolute -right-5 top-12 bg-white border-4 border-slate-900 w-10 h-10 rounded-full flex items-center justify-center z-40 hover:bg-blue-50 shadow-[2px_2px_0px_black] transition-transform active:translate-y-[2px]">
        <span className="text-sm font-black">{isOpen ? '←' : '→'}</span>
      </button>
      <div className={`p-8 border-b-4 border-slate-900 bg-white ${!isOpen && 'flex justify-center p-4'}`}>
        <h1 className={`font-black uppercase italic tracking-tighter leading-none text-slate-900 transition-all ${isOpen ? 'text-3xl' : 'text-[10px]'}`}>
          {isOpen ? 'HF HISTORIE' : 'HF-H'}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-8 no-scrollbar">
        {TOPICS.map(t => {
          const isSelected = menuTab === 'games' ? gameSelIds.includes(t.id) : noteSelId === t.id;
          return (
            <label key={t.id} className={`flex items-start gap-4 p-4 border-4 transition-all cursor-pointer ${isSelected ? 'border-slate-900 bg-yellow-300 shadow-[4px_4px_0px_rgba(0,0,0,1)] translate-x-1 -translate-y-1' : 'border-slate-300 bg-white hover:border-slate-500'}`}>
              <input type={menuTab === 'games' ? "checkbox" : "radio"} className={isOpen ? 'mt-1 w-5 h-5 accent-slate-900' : 'hidden'} checked={isSelected} onChange={() => toggleTopic(t.id)} />
              {isOpen ? <span className={`text-[11px] uppercase leading-tight font-black ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>{t.title}</span> : <span className={`text-[14px] font-black w-full text-center ${isSelected ? 'text-slate-900' : 'text-slate-300'}`}>{t.id}</span>}
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

const FlashcardSession = ({ entries, onExit, onRecord, playSound }: any) => {
  const [queue, setQueue] = useState([...entries]);
  const [revealed, setRevealed] = useState(false);
  const current = queue[0];
  if (!current) return (
    <div className="max-w-xl mx-auto py-20 text-center animate-pop">
      <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">Session Færdig!</h2>
      <button onClick={onExit} className="bg-blue-300 border-4 border-slate-900 px-12 py-6 text-xl font-black shadow-[8px_8px_0px_black] uppercase italic">TILBAGE TIL DOCK</button>
    </div>
  );
  const handleResponse = (ok: boolean) => {
    onRecord(current.id, ok);
    if (ok) { playSound('success'); setRevealed(false); setQueue((prev) => prev.slice(1)); } 
    else { playSound('damage'); setRevealed(false); }
  };
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black]">✕ LUK</button>
        <span className="font-black text-slate-900 uppercase text-xs bg-white px-4 py-2 border-4 border-slate-900 shadow-[4px_4px_0px_black]">Kort tilbage: {queue.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-10 min-h-[400px] flex flex-col justify-center text-center shadow-[12px_12px_0px_black] rounded-xl transform transition-transform">
        {!revealed ? (
          <div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-4 border-b-2 border-slate-50 pb-2">Hvad betyder...?</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-16 px-4 uppercase leading-tight tracking-tighter">{current.title}</h2>
            <button onClick={() => setRevealed(true)} className="bg-blue-300 border-4 border-slate-900 w-full py-8 text-2xl font-black uppercase italic shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Vis Svar</button>
          </div>
        ) : (
          <div className="animate-pop p-4">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4 text-left border-l-4 border-blue-300 pl-2">Definition</h3>
            <p className="text-xl md:text-2xl text-slate-900 font-bold mb-12 italic leading-relaxed text-left border-l-8 border-blue-200 pl-6">"{current.description}"</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => handleResponse(false)} className="bg-red-400 text-white border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-red-500">IGEN</button>
              <button onClick={() => handleResponse(false)} className="bg-yellow-300 border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-yellow-400">SVÆRT</button>
              <button onClick={() => handleResponse(true)} className="bg-green-400 border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-green-500">OK</button>
              <button onClick={() => handleResponse(true)} className="bg-blue-400 text-white border-4 border-slate-900 p-4 font-black text-[10px] shadow-[4px_4px_0px_black] active:shadow-none hover:bg-blue-500">LET</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuizSession = ({ entries, onExit, title, onRecord, playSound }: any) => {
  const sessionData = useMemo(() => {
    const raw = entries.flatMap((e: any) => (e.questions || []).map((q: any) => ({ ...q, entryId: e.id, options: shuffle([...q.options]) })));
    return shuffle(raw);
  }, [entries]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const currentQ = sessionData[idx];
  if (!currentQ) return <div className="p-20 text-center"><button onClick={onExit} className="bg-slate-900 text-white p-4">GÅ TIL MENUEN</button></div>;
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
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black]">✕ AFBRYD</button>
        <span className="font-black border-4 border-slate-900 px-6 py-2 uppercase text-xs bg-white shadow-[4px_4px_0px_black]">{idx + 1} / {sessionData.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-10 shadow-[16px_16px_0px_black] rounded-2xl">
        <p className="text-[10px] font-black text-blue-600 uppercase mb-6 tracking-widest border-b-2 border-slate-100 pb-2">{title}</p>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 leading-tight tracking-tight">{currentQ.question}</h2>
        <div className="space-y-4">
          {currentQ.options.map((o: string) => (
            <button key={o} disabled={isAnswered} onClick={() => handleSelect(o)} className={`w-full text-left p-6 border-4 transition-all font-black text-lg shadow-[4px_4px_0px_black] ${isAnswered ? (o === currentQ.correctAnswer ? 'bg-green-400 border-slate-900' : (o === selected ? 'bg-red-400 text-white' : 'opacity-30 grayscale')) : 'bg-white hover:bg-blue-50'}`}>
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

const TimelineQuest = ({ entries, onExit, hearts, setHearts, onRecord, playSound, stats, setStats }: any) => {
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

  if (hearts === 0) return <div className="text-center p-20"><h2 className="text-4xl font-black">GAME OVER</h2><button onClick={() => { setHearts(3); setupLevel(); }} className="bg-red-300 p-6 border-4">PRØV IGEN</button></div>;
  if (pool.length === 0 && placed.length > 1) return <div className="text-center p-20"><button onClick={() => setupLevel()} className="bg-green-300 p-8 border-4">NÆSTE LEVEL</button></div>;

  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col h-full">
      <div className="flex justify-between mb-8">
        <button onClick={onExit} className="border-4 border-slate-900 px-4 py-2">LUK</button>
        <div className="flex gap-2 font-black">STREAK: {currentStreak} | HEARTS: {hearts}</div>
      </div>
      <div className="flex-1 bg-slate-50 border-4 border-slate-900 p-12 flex items-center overflow-x-auto mb-10 shadow-inner">
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
      <div className="p-8 bg-white border-4 border-slate-900 flex flex-wrap justify-center gap-6">
        {pool.map(p => <button key={p.id} onClick={() => setSelected(p)} className={`px-8 py-5 border-4 font-black uppercase text-sm ${selected?.id === p.id ? 'bg-blue-300' : 'bg-slate-50'}`}>{p.title}</button>)}
      </div>
    </div>
  );
};

const SourceAnalysis = ({ sources, onExit, onRecord, playSound }: any) => {
  const sessionSources = useMemo(() => shuffle([...sources]), [sources]);
  const [curr, setCurr] = useState(0);
  const [activeAnswers, setActiveAnswers] = useState<Record<string, string>>({});
  const currentSource = sessionSources[curr];
  const currentQuestions = useMemo(() => currentSource?.questions.map((q: any, i: number) => ({ ...q, id: i, options: shuffle([...q.options]) })) || [], [currentSource?.id]);
  const handleAnswer = (idx: number, opt: string) => {
    if (activeAnswers[idx]) return;
    const ok = opt === currentSource.questions[idx].correctAnswer;
    if (ok) playSound('success'); else playSound('damage');
    setActiveAnswers(p => ({ ...p, [idx]: opt }));
    onRecord(currentSource.id, ok);
  };
  if (!currentSource) return <div className="text-center p-20"><button onClick={onExit} className="border-4 p-4">VÆLG EMNER</button></div>;
  return (
    <div className="max-w-4xl mx-auto py-12 h-full overflow-y-auto no-scrollbar pb-48">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2">✕ AFSLUT</button>
        <span className="font-black bg-yellow-300 border-4 border-slate-900 px-6 py-2">KILDE {curr + 1} / {sessionSources.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-12 shadow-[20px_20px_0px_black] rounded-3xl">
        <h2 className="text-3xl font-black mb-8 underline decoration-blue-400 decoration-8">{currentSource.title}</h2>
        <div className="bg-slate-50 border-4 border-slate-900 p-8 mb-12 italic text-xl whitespace-pre-wrap">"{currentSource.text}"</div>
        <div className="space-y-12">
          {currentQuestions.map((q: any) => (
            <div key={q.id} className="border-t-4 pt-8">
              <p className="font-black text-xl mb-6">{q.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((o: string) => (
                  <button key={o} onClick={() => handleAnswer(q.id, o)} className={`p-6 border-4 font-black ${activeAnswers[q.id] ? (o === currentSource.questions[q.id].correctAnswer ? 'bg-green-400' : (o === activeAnswers[q.id] ? 'bg-red-400' : 'opacity-30')) : 'bg-white hover:bg-blue-50'}`}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => curr < sessionSources.length - 1 ? (setCurr(curr + 1), setActiveAnswers({})) : onExit()} className="bg-blue-400 border-4 border-slate-900 w-full py-8 mt-12 text-2xl font-black">NÆSTE</button>
      </div>
    </div>
  );
};

const ExamMaster = ({ stats, setStats, onExit, onRecord, playSound }: any) => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'prep' | 'exam' | 'result'>('select');
  const [activeSourceIdx, setActiveSourceIdx] = useState(0);
  const [examStep, setExamStep] = useState(0);
  const [gradePoints, setGradePoints] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);

  const packs = useMemo(() => [
    { id: 'p1', topicId: '1', title: 'Identitet & Tradition', desc: 'Analyse af bondesamfund, køn og familieliv.', sources: PRIMARY_SOURCES.filter(s => s.topicId === '1').slice(0, 3) },
    { id: 'p3', topicId: '3', title: 'Holocaust & Gerningsmænd', desc: 'Den endelige løsning og den almindelige tysker.', sources: PRIMARY_SOURCES.filter(s => s.topicId === '3').slice(0, 3) }
  ], []);

  const currentPack = packs.find(p => p.id === selectedPack);
  const allExamQuestions = useMemo(() => currentPack?.sources.flatMap(s => (s.questions || []).map(q => ({ ...q, sourceTitle: s.title, id: s.id }))) || [], [currentPack]);

  const currentGrade = useMemo(() => {
    const totalPossible = allExamQuestions.length + 4;
    const ratio = gradePoints / Math.max(1, totalPossible);
    if (ratio > 0.88) return "12"; if (ratio > 0.72) return "10"; if (ratio > 0.55) return "7";
    if (ratio > 0.38) return "4"; if (ratio > 0.18) return "02"; return "00";
  }, [gradePoints, allExamQuestions.length]);

  if (phase === 'select') return (
    <div className="max-w-4xl mx-auto py-12">
      <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 mb-12">✕ TILBAGE</button>
      <h2 className="text-5xl font-black uppercase italic mb-12">VÆLG EKSAMENSSÆT</h2>
      <div className="grid grid-cols-2 gap-8">
        {packs.map(p => (
          <button key={p.id} onClick={() => { setSelectedPack(p.id); setPhase('prep'); playSound('start'); }} className="bg-white border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_black] flex flex-col h-full hover:-translate-y-2 transition-all">
            <h3 className="text-2xl font-black mb-4">{p.title}</h3>
            <p className="flex-1 text-sm font-bold text-slate-600 mb-8 italic">"{p.desc}"</p>
            <div className="bg-slate-900 text-white py-4 text-center font-black">TRÆK OPGAVESÆT</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (phase === 'prep') return (
    <div className="max-w-6xl mx-auto py-6 h-full flex flex-col">
      <div className="flex justify-between border-b-8 border-slate-900 pb-6 mb-8">
        <h2 className="text-4xl font-black italic">FORBEREDELSE (24 TIMER)</h2>
        <button onClick={() => setPhase('exam')} className="bg-green-400 border-4 px-8 py-4 font-black">GÅ TIL EKSAMEN →</button>
      </div>
      <div className="flex gap-8 overflow-hidden">
        <div className="w-80 flex flex-col gap-3">
          {currentPack?.sources.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSourceIdx(i)} className={`p-6 border-4 font-black text-left ${activeSourceIdx === i ? 'bg-slate-900 text-white' : 'bg-white'}`}>KILDE {i+1}</button>
          ))}
        </div>
        <div className="flex-1 bg-white border-4 border-slate-900 p-12 overflow-y-auto">
          <h3 className="text-3xl font-black mb-12 underline">{currentPack?.sources[activeSourceIdx]?.title}</h3>
          <p className="font-serif italic text-2xl">"{currentPack?.sources[activeSourceIdx]?.text}"</p>
        </div>
      </div>
    </div>
  );

  if (examStep < allExamQuestions.length) {
    const q = allExamQuestions[examStep];
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="flex justify-between mb-8"><h2 className="font-black text-2xl italic">KARAKTER: {currentGrade}</h2></div>
        <div className="bg-white border-4 border-slate-900 p-12 shadow-[16px_16px_0px_black]">
          <h2 className="text-3xl font-black mb-12">{q.question}</h2>
          <div className="space-y-4">
            {q.options.map((o: string) => (
              <button key={o} onClick={() => { const ok = o === q.correctAnswer; if (ok) setGradePoints(p => p + 1); setExamStep(s => s + 1); }} className="w-full text-left p-8 border-4 border-slate-900 font-black hover:bg-blue-100">
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <div className="bg-white border-[12px] border-slate-900 p-16 rounded-3xl">
        <h2 className="text-6xl font-black mb-10 italic">CENSORENS DOM: {currentGrade}</h2>
        <button onClick={() => { setStats((p: any) => ({ ...p, completedExams: [...(p.completedExams || []), selectedPack] })); onExit(); }} className="bg-slate-900 text-white px-12 py-6 text-2xl font-black">GEM OG AFSLUT</button>
      </div>
    </div>
  );
};

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
    <div className="flex-1 bg-white border-8 border-slate-900 h-full relative">
      {error ? <div className="p-20 text-center font-black">NOTER MANGLER</div> : <iframe srcDoc={content || ''} className="w-full h-full border-none" title="Notes" />}
    </div>
  );
};

/** MAIN APP **/

const App = () => {
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('HF_HISTORY_PERSISTENT_V2') || '{"completedExams": [], "masteryPoints": 0, "bestTimeline": 0}'));
  const [gameSelIds, setGameSelIds] = useState(TOPICS.map(t => t.id));
  const [noteSelId, setNoteSelId] = useState('1'); 
  const [view, setView] = useState('menu');
  const [menuTab, setMenuTab] = useState<'games' | 'notes'>('games');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hearts, setHearts] = useState(3);

  useEffect(() => { localStorage.setItem('HF_HISTORY_PERSISTENT_V2', JSON.stringify(stats)); }, [stats]);

  const filtered = useMemo(() => ({
    entries: HISTORY_ENTRIES.filter(e => gameSelIds.includes(e.topicId)),
    sources: PRIMARY_SOURCES.filter(e => gameSelIds.includes(e.topicId))
  }), [gameSelIds]);

  const recordStat = (id: string, ok: boolean) => setStats((p: any) => ({ ...p, masteryPoints: p.masteryPoints + (ok ? 1 : 0) }));

  const renderView = () => {
    switch (view) {
      case 'flashcards': return <FlashcardSession entries={shuffle([...filtered.entries])} onExit={() => setView('menu')} onRecord={recordStat} playSound={playSound} />;
      case 'quiz': return <QuizSession entries={filtered.entries} title="Videns Quiz" onExit={() => setView('menu')} onRecord={recordStat} playSound={playSound} />;
      case 'timeline': return <TimelineQuest entries={filtered.entries} hearts={hearts} setHearts={setHearts} onExit={() => setView('menu')} onRecord={recordStat} playSound={playSound} stats={stats} setStats={setStats} />;
      case 'sources': return <SourceAnalysis sources={filtered.sources} onExit={() => setView('menu')} onRecord={recordStat} playSound={playSound} />;
      case 'exam': return <ExamMaster stats={stats} setStats={setStats} onExit={() => setView('menu')} onRecord={recordStat} playSound={playSound} />;
      default: return (
        <div className="flex flex-col h-full animate-pop max-w-6xl mx-auto w-full">
          <div className="mb-12 flex border-b-8 border-slate-900 pb-8 gap-6">
            <button onClick={() => setMenuTab('games')} className={`px-12 py-4 border-4 border-slate-900 text-2xl font-black ${menuTab === 'games' ? 'bg-slate-900 text-white' : 'bg-white shadow-[6px_6px_0px_black]'}`}>🕹️ TRÆNING</button>
            <button onClick={() => setMenuTab('notes')} className={`px-12 py-4 border-4 border-slate-900 text-2xl font-black ${menuTab === 'notes' ? 'bg-slate-900 text-white' : 'bg-white shadow-[6px_6px_0px_black]'}`}>📖 PENSUM</button>
          </div>
          {menuTab === 'games' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
              <button onClick={() => setView('flashcards')} className="bg-white border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_black] flex flex-col h-full">
                <div className="text-5xl mb-6">🗂️</div>
                <div className="flex-1"><h3 className="text-2xl font-black mb-3 underline decoration-blue-200">Flashcards</h3><p className="text-[11px] font-bold text-slate-500 mb-8 uppercase">Hurtig drill af begreber.</p></div>
                <div className="bg-blue-300 border-4 border-slate-900 p-4 text-center font-black">START DRILL</div>
              </button>
              <button onClick={() => setView('quiz')} className="bg-white border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_black] flex flex-col h-full">
                <div className="text-5xl mb-6">🎯</div>
                <div className="flex-1"><h3 className="text-2xl font-black mb-3 underline decoration-yellow-200">Videns Quiz</h3><p className="text-[11px] font-bold text-slate-500 mb-8 uppercase">Test din hukommelse.</p></div>
                <div className="bg-yellow-300 border-4 border-slate-900 p-4 text-center font-black">TAG QUIZ</div>
              </button>
              <button onClick={() => setView('timeline')} className="bg-white border-4 border-slate-900 p-10 md:col-span-2 flex items-center gap-10 shadow-[16px_16px_0px_black]">
                <div className="text-8xl">⚔️</div>
                <div className="flex-1"><h3 className="text-4xl font-black uppercase italic tracking-tighter">Timeline Quest</h3><div className="bg-green-300 border-4 border-slate-900 p-5 mt-4 text-center font-black">START MISSION</div></div>
              </button>
              <button onClick={() => setView('sources')} className="bg-white border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_black] flex flex-col h-full">
                <div className="text-5xl mb-6">📜</div>
                <div className="flex-1"><h3 className="text-2xl font-black mb-3 underline decoration-slate-400">Kilde Kritik</h3><p className="text-[11px] font-bold text-slate-500 mb-8 uppercase">Gå i dybden.</p></div>
                <div className="bg-slate-100 border-4 border-slate-900 p-4 text-center font-black">ANALYSÉR</div>
              </button>
              <button onClick={() => setView('exam')} className="bg-slate-900 border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_#3b82f6] flex flex-col h-full">
                <div className="text-5xl mb-6">🎓</div>
                <div className="flex-1"><h3 className="text-2xl font-black mb-3 text-white underline decoration-blue-500">Eksamenstræner</h3><p className="text-[11px] font-bold text-white mb-8 uppercase">Mundtlig simulering.</p></div>
                <div className="bg-blue-400 text-slate-900 border-4 border-slate-900 p-4 text-center font-black">GÅ TIL EKSAMEN</div>
              </button>
            </div>
          ) : <div className="h-full flex flex-col pb-24"><NoteViewer selectedTopicId={noteSelId} /></div>}
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} menuTab={menuTab} gameSelIds={gameSelIds} setGameSelIds={setGameSelIds} noteSelId={noteSelId} setNoteSelId={setNoteSelId} stats={stats} />
      <main className="flex-1 p-4 md:p-12 overflow-y-auto no-scrollbar">{renderView()}</main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);