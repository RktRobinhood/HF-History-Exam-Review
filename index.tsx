import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TOPICS, HISTORY_ENTRIES, PRIMARY_SOURCES, EXAM_INTERPRETATIONS } from './data/index.js';

// --- UTILITIES ---
const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);
const STORAGE_KEY = 'hf_historie_master_v4_final';

const getYearFromDate = (dateStr: string | undefined): number => {
  if (!dateStr) return 0;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
};

// --- COMPONENTS ---

const AnkiFlashcards: React.FC<{ entries: any[]; onExit: () => void; onRecord: (id: string, ok: boolean) => void }> = ({ entries, onExit, onRecord }) => {
  const [curr, setCurr] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const entry = entries[curr];

  if (!entry) return <div className="p-20 text-center font-black">Ingen data tilgængelig. <button onClick={onExit} className="text-indigo-600 block mx-auto mt-4">Gå tilbage</button></div>;

  const handleFeedback = (level: 'easy' | 'good' | 'hard' | 'again') => {
    const isOk = level === 'easy' || level === 'good';
    onRecord(entry.id, isOk);
    setFlipped(false);
    if (curr < entries.length - 1) {
      setCurr(curr + 1);
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6 animate-pop">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="text-slate-400 font-black text-xs uppercase hover:text-slate-800 transition-colors">✕ Afslut Session</button>
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full tracking-widest">{curr + 1} / {entries.length}</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Anki Recall Mode</span>
        </div>
      </div>
      
      <div className="relative perspective-1000 h-[500px] cursor-pointer mb-10" onClick={() => setFlipped(!flipped)}>
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
          {/* FRONT */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[3rem] shadow-2xl border-2 border-slate-50 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-1 bg-indigo-100 rounded-full mb-8" />
            <span className="text-[11px] font-black uppercase text-indigo-500 mb-6 tracking-[0.25em]">{entry.type === 'event' ? 'Historisk Begivenhed' : 'Teoretisk Begreb'}</span>
            <h2 className="text-4xl font-black text-slate-800 leading-tight mb-4">{String(entry.title)}</h2>
            <div className="mt-12 text-slate-300 text-[10px] font-black uppercase tracking-widest animate-pulse">Klik for at se svaret</div>
          </div>
          
          {/* BACK */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-[3rem] shadow-2xl p-12 flex flex-col items-center justify-center text-center text-white">
             <div className="overflow-y-auto max-h-full py-4 scrollbar-hide">
                <p className="text-2xl leading-relaxed font-medium mb-10 text-slate-200">{String(entry.description)}</p>
                {entry.date && (
                  <div className="inline-block px-6 py-2 bg-indigo-600 rounded-full text-white font-black text-sm uppercase tracking-widest mb-4">
                    Tid: {String(entry.date)}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pop">
          <button onClick={() => handleFeedback('again')} className="py-4 bg-rose-50 text-rose-600 rounded-2xl font-black border-2 border-rose-100 hover:bg-rose-100 transition-all text-xs uppercase">Igen</button>
          <button onClick={() => handleFeedback('hard')} className="py-4 bg-orange-50 text-orange-600 rounded-2xl font-black border-2 border-orange-100 hover:bg-orange-100 transition-all text-xs uppercase">Svært</button>
          <button onClick={() => handleFeedback('good')} className="py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black border-2 border-indigo-100 hover:bg-indigo-100 transition-all text-xs uppercase">Godt</button>
          <button onClick={() => handleFeedback('easy')} className="py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black border-2 border-emerald-100 hover:bg-emerald-100 transition-all text-xs uppercase">Nemt</button>
        </div>
      )}
    </div>
  );
};

const TimelineGame: React.FC<{ entries: any[]; onExit: () => void }> = ({ entries, onExit }) => {
  const allEvents = useMemo(() => entries.filter(e => e.date), [entries]);
  const [deck, setDeck] = useState<any[]>([]);
  const [placed, setPlaced] = useState<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{correct: boolean; pos: number} | null>(null);

  useEffect(() => {
    if (allEvents.length < 3) return;
    const shuffled = shuffle(allEvents);
    const initial = shuffled.slice(0, 2).sort((a, b) => getYearFromDate(a.date) - getYearFromDate(b.date));
    setPlaced(initial);
    setDeck(shuffled.slice(2));
    setCurrent(shuffled[2] || null);
  }, [allEvents]);

  const placeCard = (index: number) => {
    if (!current || feedback) return;

    const currentYear = getYearFromDate(current.date);
    let isCorrect = true;

    if (index === 0) {
      if (currentYear > getYearFromDate(placed[0].date)) isCorrect = false;
    } else if (index === placed.length) {
      if (currentYear < getYearFromDate(placed[placed.length - 1].date)) isCorrect = false;
    } else {
      if (currentYear < getYearFromDate(placed[index - 1].date) || currentYear > getYearFromDate(placed[index].date)) {
        isCorrect = false;
      }
    }

    setFeedback({ correct: isCorrect, pos: index });

    if (isCorrect) {
      const newPlaced = [...placed];
      newPlaced.splice(index, 0, current);
      setPlaced(newPlaced);
    }
  };

  const nextCard = () => {
    setFeedback(null);
    const nextDeck = deck.slice(1);
    setDeck(nextDeck);
    setCurrent(nextDeck[0] || null);
    if (!nextDeck[0]) onExit();
  };

  if (allEvents.length < 3) return <div className="p-20 text-center font-black">For få begivenheder til tidslinje-spillet. <button onClick={onExit} className="text-indigo-600">Gå tilbage</button></div>;
  if (!current) return <div className="p-20 text-center font-black">Færdig! <button onClick={onExit} className="text-indigo-600">Afslut</button></div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-pop">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onExit} className="text-slate-400 font-black text-xs uppercase">✕ Forlad Spil</button>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">Tidslinje: <span className="text-indigo-600">Strategi</span></h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Placér kortet det rigtige sted</p>
        </div>
        <div className="bg-indigo-50 px-4 py-1 rounded-full text-indigo-600 text-xs font-black uppercase">Level {placed.length - 1}</div>
      </div>

      {/* THE PENDING CARD */}
      <div className="flex justify-center mb-16">
        <div className="w-64 bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-indigo-600 text-center relative animate-pop">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Næste Kort</div>
          <h3 className="text-xl font-black text-slate-800 leading-tight mb-4">{String(current.title)}</h3>
          <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-3">{String(current.description)}</p>
          <div className="mt-6 text-2xl font-black text-slate-200">????</div>
        </div>
      </div>

      {/* THE PLACED TIMELINE */}
      <div className="flex flex-wrap justify-center items-center gap-2 overflow-x-auto py-8 scrollbar-hide">
        {/* Placement button before first card */}
        <button 
          onClick={() => placeCard(0)} 
          disabled={!!feedback}
          className={`w-8 h-32 rounded-xl transition-all flex items-center justify-center text-xs font-black vertical-text ${feedback ? 'opacity-20 cursor-default' : 'bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 border-2 border-dashed border-slate-200'}`}
        >
          {!feedback && 'HER'}
        </button>

        {placed.map((item, idx) => (
          <React.Fragment key={item.id}>
            <div className="w-40 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 text-center shrink-0">
               <div className="text-indigo-600 font-black text-sm mb-2 font-mono">{String(item.date)}</div>
               <h4 className="text-[11px] font-black text-slate-800 leading-tight uppercase tracking-tight">{String(item.title)}</h4>
            </div>

            {/* Placement button between cards */}
            <button 
              onClick={() => placeCard(idx + 1)} 
              disabled={!!feedback}
              className={`w-8 h-32 rounded-xl transition-all flex items-center justify-center text-xs font-black vertical-text ${feedback ? 'opacity-20 cursor-default' : 'bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 border-2 border-dashed border-slate-200'}`}
            >
              {!feedback && 'HER'}
            </button>
          </React.Fragment>
        ))}
      </div>

      {feedback && (
        <div className="mt-12 text-center animate-pop">
          <div className={`inline-block px-12 py-6 rounded-[2rem] border-4 mb-6 shadow-2xl ${feedback.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
            <p className="text-3xl font-black mb-1">{feedback.correct ? 'RIKTIGT!' : 'FORKERT!'}</p>
            <p className="font-bold text-slate-700">Årstallet var: <span className="font-black text-indigo-600">{current.date}</span></p>
          </div>
          <br />
          <button onClick={nextCard} className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">Fortsæt →</button>
        </div>
      )}

      <style>{`
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); }
      `}</style>
    </div>
  );
};

const Quiz: React.FC<{ questions: any[]; onExit: () => void; onRecord: (id: string, ok: boolean) => void; title: string }> = ({ questions, onExit, onRecord, title }) => {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const q = questions[idx];
  const opts = useMemo(() => q?.options ? shuffle(q.options) : [], [q]);

  if (!q) return <div className="p-20 text-center font-black">Du er gennem alle spørgsmål! <button onClick={onExit} className="block mx-auto mt-4 text-indigo-600">Tilbage</button></div>;

  const handleSel = (o: string) => {
    if (done) return;
    onRecord(q.entryId || 'q', o === q.correctAnswer);
    setSel(o); setDone(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-pop">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onExit} className="text-slate-400 font-black text-xs uppercase">✕ Luk</button>
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full">{idx + 1} / {questions.length}</span>
      </div>
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-2 border-slate-50 relative overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">{String(title)}</p>
        <h2 className="text-2xl font-black mb-10 text-slate-800 leading-snug">{String(q.question)}</h2>
        <div className="space-y-4">
          {opts.map((o: string) => (
            <button key={o} onClick={() => handleSel(o)} disabled={done} className={`w-full p-6 text-left rounded-3xl border-2 transition-all font-bold text-lg flex items-center gap-4 ${done ? (o === q.correctAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : (o === sel ? 'border-rose-500 bg-rose-50 text-rose-700' : 'opacity-30 border-slate-50')) : 'border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/20'}`}>
              <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-sm font-black text-slate-400">{o === sel ? '🎯' : '•'}</span>
              {String(o)}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <div className="mt-8 animate-pop">
          {q.explanation && <div className="p-6 bg-amber-50 rounded-3xl mb-6 text-sm font-bold text-amber-800 border-2 border-amber-100 italic">💡 Forklaring: {String(q.explanation)}</div>}
          <button onClick={() => { if (idx < questions.length - 1) { setIdx(idx + 1); setSel(null); setDone(false); } else onExit(); }} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-xl">Fortsæt →</button>
        </div>
      )}
    </div>
  );
};

const SourceAnalysis: React.FC<{ sources: any[]; onExit: () => void; onRecord: (id: string, ok: boolean) => void }> = ({ sources, onExit, onRecord }) => {
  const [idx, setIdx] = useState(0);
  const s = sources[idx];
  
  if (!s) return <div className="p-20 text-center font-black">Ingen kilder i dette emne. <button onClick={onExit} className="block mx-auto mt-4 text-indigo-600">Tilbage</button></div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-pop">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onExit} className="text-slate-400 font-black text-xs uppercase hover:text-indigo-600">✕ Luk Analyse</button>
        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full">Kilde {idx + 1} / {sources.length}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border-2 border-slate-50 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-3xl font-black text-slate-800 mb-8 leading-tight">{String(s.title)}</h2>
          <div className="prose prose-indigo leading-relaxed text-slate-600 text-xl italic border-l-8 border-indigo-500 pl-8 py-4 bg-indigo-50/20 rounded-r-3xl">
            "{String(s.text)}"
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-widest">
             <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">i</span>
             Primær historisk kilde til analyse
          </div>
        </div>

        <div className="space-y-6">
           <Quiz 
              questions={s.questions.map((q: any) => ({ ...q, entryId: s.id }))} 
              onExit={() => { if (idx < sources.length - 1) setIdx(idx + 1); else onExit(); }} 
              onRecord={onRecord} 
              title="Analyse Spørgsmål" 
           />
        </div>
      </div>
    </div>
  );
};

// --- APP CORE ---

const App: React.FC = () => {
  const [stats, setStats] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [selIds, setSelIds] = useState<string[]>(['0', '1']);
  const [view, setView] = useState<'menu' | 'quiz' | 'interpretation' | 'flashcards' | 'timeline' | 'sources'>('menu');

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)), [stats]);

  const handleRecord = (id: string, ok: boolean) => {
    setStats((prev: any) => {
      const s = prev[id] || { count: 0, correct: 0 };
      return { ...prev, [id]: { count: s.count + 1, correct: s.correct + (ok ? 1 : 0) } };
    });
  };

  const filtered = useMemo(() => ({
    entries: (HISTORY_ENTRIES || []).filter(e => selIds.includes(e.topicId)),
    exams: (EXAM_INTERPRETATIONS || []).filter(e => selIds.includes(e.topicId)),
    sources: (PRIMARY_SOURCES || []).filter(e => selIds.includes(e.topicId))
  }), [selIds]);

  const quizQs = useMemo(() => filtered.entries.flatMap(e => (e.questions || []).map(q => ({ ...q, entryId: e.id }))), [filtered]);
  const examQs = useMemo(() => filtered.exams.flatMap(e => (e.subtext || []).map(s => ({ ...s, entryId: e.id }))), [filtered]);

  const mastery = useMemo(() => {
    const vals: any[] = Object.values(stats);
    if (!vals.length) return 0;
    const total = vals.reduce((a, b) => a + (b.count || 0), 0);
    const correct = vals.reduce((a, b) => a + (b.correct || 0), 0);
    return total ? Math.round((correct / total) * 100) : 0;
  }, [stats]);

  const toggleAll = () => {
    if (selIds.length === TOPICS.length) setSelIds([]);
    else setSelIds(TOPICS.map(t => t.id));
  };

  if (view === 'flashcards') return <AnkiFlashcards entries={filtered.entries} onExit={() => setView('menu')} onRecord={handleRecord} />;
  if (view === 'quiz') return <Quiz questions={quizQs} title="Konceptuel Test" onExit={() => setView('menu')} onRecord={handleRecord} />;
  if (view === 'interpretation') return <Quiz questions={examQs} title="Eksamens Scenarier" onExit={() => setView('menu')} onRecord={handleRecord} />;
  if (view === 'timeline') return <TimelineGame entries={filtered.entries} onExit={() => setView('menu')} />;
  if (view === 'sources') return <SourceAnalysis sources={filtered.sources} onExit={() => setView('menu')} onRecord={handleRecord} />;

  return (
    <div className="min-h-screen bg-slate-50 pb-48">
      <header className="bg-white/90 backdrop-blur-2xl border-b py-8 px-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-2xl shadow-indigo-100 rotate-3 font-black italic">H</div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-none">HF <span className="text-indigo-600">Historie</span></h1>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mt-2">Vibe Code Learning Engine v5.0</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border-2 border-slate-100 px-8 py-5 rounded-[2rem] flex flex-col items-center shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Mastery Level</span>
              <span className="text-3xl font-black text-indigo-600">{mastery}%</span>
            </div>
            <button onClick={() => { if(confirm('Slet alt fremgang?')) setStats({}); }} className="text-[10px] font-black uppercase text-slate-300 hover:text-rose-500 transition-colors px-4 py-2 border-2 border-transparent hover:border-rose-100 rounded-full">Reset</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <section className="mb-24">
          <div className="flex justify-between items-end mb-10 border-b-2 border-slate-100 pb-6">
            <div>
              <h2 className="text-4xl font-black italic text-slate-800">01. Curriculum</h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Markér de områder du vil træne</p>
            </div>
            <button onClick={toggleAll} className="text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-3xl transition-all shadow-xl shadow-indigo-100 hover:scale-105">
              {selIds.length === TOPICS.length ? 'Nulstil Valg' : 'Vælg Alle Emner'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {TOPICS.map(t => (
              <button key={t.id} onClick={() => setSelIds(s => s.includes(t.id) ? s.filter(x => x !== t.id) : [...s, t.id])} className={`group p-8 rounded-[3rem] border-4 transition-all text-left flex flex-col h-full relative overflow-hidden ${selIds.includes(t.id) ? 'border-indigo-600 bg-white shadow-2xl scale-[1.05] z-10' : 'border-white bg-white/60 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-indigo-200 shadow-sm'}`}>
                {selIds.includes(t.id) && <div className="absolute top-6 right-8 text-indigo-600 font-black text-3xl animate-pop">✓</div>}
                <span className={`text-[12px] font-black uppercase mb-6 tracking-widest ${selIds.includes(t.id) ? 'text-indigo-500' : 'text-slate-400'}`}>Unit {t.id}</span>
                <h3 className="font-black text-slate-800 text-xl leading-tight group-hover:text-indigo-600 transition-colors">{t.title}</h3>
                <p className="mt-4 text-[11px] text-slate-400 font-bold leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tight">{t.description}</p>
                <div className={`mt-auto pt-6 flex items-center gap-2 ${selIds.includes(t.id) ? 'text-indigo-300' : 'text-slate-200'}`}>
                   <div className="h-1 flex-1 bg-current rounded-full" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-12">
            <h2 className="text-4xl font-black italic text-slate-800">02. Exercise Hub</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Dyk ned i forskellige træningsformer</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Bento Card: Flashcards */}
            <button onClick={() => setView('flashcards')} className="bento-card bg-indigo-600 p-14 rounded-[4rem] shadow-2xl text-white text-left group hover:scale-[1.03] transition-all relative overflow-hidden ring-offset-4 hover:ring-4 ring-indigo-200">
               <div className="absolute -bottom-10 -right-10 text-[12rem] opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700 pointer-events-none">🗂️</div>
               <div className="text-5xl mb-10">🗂️</div>
               <h3 className="text-4xl font-black mb-6">Anki Recall</h3>
               <p className="text-indigo-100 text-xl font-medium mb-10 leading-relaxed max-w-[240px]">Spaced repetition teknikker til hurtig læring.</p>
               <span className="bg-white/20 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">{filtered.entries.length} Kort i puljen</span>
            </button>

            {/* Bento Card: Concept Quiz */}
            <button onClick={() => setView('quiz')} className="bento-card bg-white p-14 rounded-[4rem] shadow-xl text-slate-800 text-left border-4 border-slate-50 hover:border-indigo-500 hover:shadow-2xl transition-all group relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 text-[12rem] opacity-5 -rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none">🎯</div>
               <div className="text-5xl mb-10">🎯</div>
               <h3 className="text-4xl font-black mb-6 text-slate-800">Begrebs Quiz</h3>
               <p className="text-slate-400 text-xl font-medium mb-10 leading-relaxed">Multiple choice tests af din historiske paratviden.</p>
               <span className="bg-indigo-50 text-indigo-600 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">{quizQs.length} Spørgsmål klar</span>
            </button>

            {/* Bento Card: Timeline */}
            <button onClick={() => setView('timeline')} className="bento-card bg-slate-900 p-14 rounded-[4rem] shadow-2xl text-white text-left group hover:scale-[1.03] transition-all relative overflow-hidden ring-offset-4 hover:ring-4 ring-slate-200">
               <div className="absolute -bottom-10 -right-10 text-[12rem] opacity-10 rotate-45 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">⏳</div>
               <div className="text-5xl mb-10">⏳</div>
               <h3 className="text-4xl font-black mb-6">Timeline Board</h3>
               <p className="text-slate-400 text-xl font-medium mb-10 leading-relaxed">Strategisk placering af begivenheder. Gæt rigtigt eller dø!</p>
               <span className="bg-white/10 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Logik-baseret</span>
            </button>

             {/* Bento Card: Source Analysis */}
             <button onClick={() => setView('sources')} className="bento-card bg-white p-14 rounded-[4rem] shadow-xl text-slate-800 text-left border-4 border-slate-50 hover:border-emerald-500 hover:shadow-2xl transition-all group lg:col-span-2 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 text-[15rem] opacity-5 group-hover:translate-x-10 transition-transform duration-1000 pointer-events-none">📜</div>
               <div className="text-5xl mb-10">📜</div>
               <h3 className="text-4xl font-black mb-6 text-slate-800">Kilde Analyse</h3>
               <p className="text-slate-400 text-xl font-medium mb-10 leading-relaxed max-w-lg">Læs autentiske kilder og demonstrér din kildekritiske metode. Dette er kernen i din karakter.</p>
               <div className="flex gap-4">
                  <span className="bg-emerald-50 text-emerald-600 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">{filtered.sources.length} Kilder</span>
               </div>
            </button>

            {/* Bento Card: Exam Training */}
            <button onClick={() => setView('interpretation')} className="bento-card bg-amber-400 p-14 rounded-[4rem] shadow-xl text-slate-900 text-left group hover:bg-amber-300 transition-all relative overflow-hidden">
               <div className="absolute bottom-0 right-0 text-[18rem] opacity-10 group-hover:-translate-y-6 transition-transform duration-700 pointer-events-none">💡</div>
               <div className="text-5xl mb-10">💡</div>
               <h3 className="text-4xl font-black mb-6">Eksamens-Focus</h3>
               <p className="text-amber-900/60 text-xl font-black mb-10 leading-relaxed">Træn specifikke eksamensspørgsmål og scor topkarakter.</p>
               <span className="bg-black/10 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Deep Training</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 inset-x-0 p-8 bg-white/80 backdrop-blur-xl border-t z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             System Online
          </div>
          <div className="hidden md:block italic text-slate-300">"Historie er ikke hvad der skete, men hvad vi husker."</div>
          <div>Stable Build v5.0.1</div>
        </div>
      </footer>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) createRoot(rootEl).render(<App />);