
import React, { useState, useMemo } from 'react';
import { EXAM_SETS } from './data/examSets.js';
import { shuffle } from './utils.ts';

export const ExamMaster = ({ stats, setStats, onExit, onRecord }: any) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'prep' | 'exam' | 'result'>('select');
  const [activeSourceIdx, setActiveSourceIdx] = useState(0);
  const [examStep, setExamStep] = useState(0);
  const [points, setPoints] = useState(0);
  const [matchingState, setMatchingState] = useState<Record<number, string>>({});

  const currentSet = useMemo(() => EXAM_SETS.find(s => s.id === selectedId), [selectedId]);
  
  const shuffledQuestions = useMemo(() => {
    if (!currentSet) return [];
    return shuffle(currentSet.questions.map(q => ({
      ...q,
      options: q.type === 'mcq' ? shuffle([...q.options]) : q.options,
      shuffledMatches: q.type === 'matching' ? shuffle(q.pairs.map((p:any) => p.match)) : []
    })));
  }, [currentSet]);

  const currentQuestion = shuffledQuestions[examStep];

  const handleGrade = () => {
    if (!currentSet) return "00";
    const total = currentSet.questions.length;
    const ratio = points / total;
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
        <h2 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900 underline decoration-blue-500">EKSAMENS-OPGAVER</h2>
        <button onClick={onExit} className="bg-white border-4 border-slate-900 px-6 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_black] hover:bg-slate-50 transition-all">✕ AFSLUT</button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {EXAM_SETS.map(set => (
          <button 
            key={set.id} 
            onClick={() => { setSelectedId(set.id); setPhase('prep'); }}
            className="group bg-white border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_black] flex flex-col h-full hover:-translate-y-2 transition-all hover:bg-blue-50"
          >
            <div className="bg-slate-900 text-white inline-block px-3 py-1 font-black text-[10px] uppercase mb-4 w-fit">Emne {set.topicId}</div>
            <h3 className="text-3xl font-black mb-4 uppercase leading-tight group-hover:text-blue-600 transition-colors text-slate-900">{set.title}</h3>
            <p className="text-sm font-bold text-slate-500 mb-8 italic">"{set.description}"</p>
            <div className="mt-auto bg-slate-900 text-white py-4 text-center font-black uppercase text-sm shadow-[4px_4px_0px_#3b82f6] group-hover:bg-blue-600">LÆS KILDER OG FORBERED DIG</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (phase === 'prep' && currentSet) return (
    <div className="max-w-6xl mx-auto py-6 flex flex-col h-full px-4 animate-pop">
      <header className="flex justify-between items-center mb-8 border-b-8 border-slate-900 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setPhase('select')} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs text-slate-900">← TILBAGE</button>
          <h2 className="text-3xl font-black italic uppercase text-slate-400">FASE 1: FORBEREDELSE</h2>
        </div>
        <button 
          onClick={() => { setPhase('exam'); }}
          className="bg-green-400 border-4 border-slate-900 px-10 py-5 font-black uppercase shadow-[6px_6px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-slate-900"
        >
          START EKSAMINATION →
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden pb-12">
        <div className="w-full lg:w-80 flex flex-col gap-3">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Kildemateriale</span>
          {currentSet.sources.map((s, i) => (
            <button 
              key={s.id} 
              onClick={() => setActiveSourceIdx(i)}
              className={`p-6 border-4 font-black text-left uppercase text-xs transition-all ${activeSourceIdx === i ? 'bg-slate-900 text-white shadow-[4px_4px_0px_#3b82f6] -translate-x-1' : 'bg-white border-slate-300 text-slate-400 hover:border-slate-900'}`}
            >
              KILDE {i+1}: {s.title.substring(0, 30)}...
            </button>
          ))}
          <div className="mt-auto bg-blue-50 border-4 border-dashed border-blue-400 p-6 text-[11px] font-bold text-blue-800 uppercase italic leading-relaxed">
            Husk: Under selve eksamen kan du ikke se kildeteksterne. Brug tiden på at forstå kildernes tendens og repræsentativitet nu.
          </div>
        </div>

        <div className="flex-1 bg-white border-4 border-slate-900 p-12 overflow-y-auto shadow-inner rounded-3xl relative no-scrollbar">
          <div className="absolute top-4 right-6 text-[10px] font-black text-slate-200 uppercase tracking-[0.2em]">Primærkilde-arkiv</div>
          <h3 className="text-4xl font-black mb-8 underline decoration-blue-200 decoration-8 text-slate-900">{currentSet.sources[activeSourceIdx].title}</h3>
          <div className="bg-slate-50 border-l-[16px] border-slate-900 p-10 mb-10 shadow-sm rounded-r-xl">
             <p className="font-serif italic text-2xl leading-relaxed text-slate-800 whitespace-pre-wrap">"{currentSet.sources[activeSourceIdx].text}"</p>
          </div>
          <div className="border-t-4 border-slate-100 pt-8">
            <h4 className="font-black text-blue-600 uppercase text-xs mb-3 tracking-widest">Historiefaglig analysehjælp</h4>
            <p className="text-slate-500 font-bold italic leading-relaxed">{currentSet.sources[activeSourceIdx].analysis}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === 'exam' && currentSet && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 h-full animate-pop">
        <header className="flex justify-between items-center mb-12 border-b-8 border-slate-900 pb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setPhase('prep')} className="border-4 border-slate-900 px-4 py-2 bg-white font-black uppercase text-xs shadow-[2px_2px_0px_black] text-slate-900">← SE KILDER IGEN</button>
            <h2 className="text-4xl font-black italic text-blue-600 uppercase">PROGNOSE: {handleGrade()}</h2>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Spørgsmål</span>
            <span className="text-3xl font-black italic leading-none">{examStep + 1} / {shuffledQuestions.length}</span>
          </div>
        </header>

        <div className="bg-white border-8 border-slate-900 p-12 shadow-[25px_25px_0px_black] rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 border-l-8 border-b-8 border-slate-900 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900">Det Grønne Bord</div>
          <h2 className="text-4xl font-black mb-12 leading-tight uppercase italic tracking-tighter underline decoration-yellow-300 decoration-8 text-slate-900">"{currentQuestion.question}"</h2>
          
          {currentQuestion.type === 'mcq' ? (
            <div className="space-y-4">
              {currentQuestion.options.map((o: string) => (
                <button 
                  key={o} 
                  onClick={() => handleNext(o === currentQuestion.correctAnswer)}
                  className="w-full text-left p-8 border-4 border-slate-900 font-black text-xl hover:bg-blue-50 transition-all shadow-[8px_8px_0px_black] active:translate-y-1 active:shadow-none text-slate-900"
                >
                  {o}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6 bg-slate-50 p-8 border-4 border-slate-900 rounded-xl shadow-inner">
               {currentQuestion.pairs.map((p: any, i: number) => (
                 <div key={i} className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <div className="bg-slate-900 text-white p-4 font-black uppercase text-sm flex-1 text-center md:text-left">{p.item}</div>
                    <div className="text-2xl font-black text-slate-300">↔</div>
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
                      className="p-4 border-4 border-slate-900 font-bold text-xs bg-white text-slate-900 flex-1 outline-none focus:ring-4 ring-blue-200"
                    >
                      <option value="">Vælg match...</option>
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200] p-6 animate-pop">
      <div className="bg-white border-[16px] border-slate-900 p-20 rounded-[4rem] shadow-[40px_40px_0px_#3b82f6] text-center max-w-2xl w-full transform -rotate-1">
        <h2 className="text-4xl font-black mb-8 uppercase text-slate-400 italic tracking-widest leading-none">PRØVEN ER SLUT</h2>
        <div className="text-[18rem] font-black text-slate-900 mb-10 leading-none drop-shadow-[15px_15px_0_#fde047]">{handleGrade()}</div>
        <p className="text-2xl font-bold mb-12 text-slate-600 uppercase tracking-wider italic">
          {parseInt(handleGrade()) >= 7 ? 'Censoren er imponeret. Du har et stærkt historisk overblik.' : 'Husk at bruge flere metodiske begreber næste gang for at løfte din karakter.'}
        </p>
        <button 
          onClick={() => { 
            setStats((p: any) => ({ ...p, completedExams: [...(p.completedExams || []), selectedId] })); 
            onExit(); 
          }} 
          className="bg-slate-900 text-white px-20 py-8 text-4xl font-black uppercase italic border-8 border-slate-900 shadow-[10px_10px_0px_#3b82f6] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          GEM OG AFSLUT
        </button>
      </div>
    </div>
  );

  return null;
};
