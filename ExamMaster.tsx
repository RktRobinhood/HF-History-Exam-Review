import React, { useState, useMemo, useEffect } from 'react';
import { PRIMARY_SOURCES } from './data/index.js';
import { shuffle } from './utils.js';

export const ExamMaster = ({ stats, setStats, onExit, onRecord, playSound }: any) => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'prep' | 'exam' | 'result'>('select');
  const [activeSourceIdx, setActiveSourceIdx] = useState(0);
  const [examStep, setExamStep] = useState(0);
  const [gradePoints, setGradePoints] = useState(0);
  const [matchingSelections, setMatchingSelections] = useState<{ left: any, right: any }>({ left: null, right: null });
  const [matches, setMatches] = useState<any[]>([]);

  // Function to ensure we have at least 3 sources for any pack
  const getSourcesForTopic = (topicId: string) => {
    let s = PRIMARY_SOURCES.filter(s => s.topicId === topicId);
    if (s.length < 3) {
      // Pad with other relevant sources if needed to ensure 3
      const others = PRIMARY_SOURCES.filter(s => s.topicId !== topicId).slice(0, 3 - s.length);
      s = [...s, ...others];
    }
    return s.slice(0, 4); // Standard HF set is 3-4 sources
  };

  const packs = useMemo(() => [
    { id: 'p1', topicId: '1', title: 'Identitet & Tradition', desc: 'Analyse af bondesamfund, køn og familieliv.', sources: getSourcesForTopic('1') },
    { id: 'p3', topicId: '3', title: 'Holocaust & Gerningsmænd', desc: 'Den endelige løsning og den almindelige tysker.', sources: getSourcesForTopic('3') },
    { id: 'p2', topicId: '2', title: 'Demokratiets Fødsel', desc: 'Fra enevælde til grundlov og velfærd.', sources: getSourcesForTopic('2') },
    { id: 'p0', topicId: '0', title: 'Historisk Metode Ekspert', desc: 'Kildekritik og teoretisk analyse i dybden.', sources: getSourcesForTopic('0') }
  ], []);

  const currentPack = packs.find(p => p.id === selectedPack);
  
  const matchingData = useMemo(() => {
    if (selectedPack === 'p3') {
      return [
        { left: 'Wannsee-protokollen', right: 'Logistikken bag massemordet' },
        { left: 'Goldhagen', right: 'Almindelige tyskeres villighed' },
        { left: 'Götz Aly', right: 'Økonomisk plyndring' },
        { left: 'Dehumanisering', right: 'Sproglig fratagelse af værdighed' }
      ];
    }
    if (selectedPack === 'p1') {
      return [
        { left: 'Lars Rasmussen', right: 'Patriarkalsk revselsesret' },
        { left: 'Klinket Porcelæn', right: 'Kernefamilie og facade' },
        { left: 'P-pillen 1966', right: 'Kvindelig aftraditionalisering' },
        { left: 'Urbanisering', right: 'Masseflytning til byerne' }
      ];
    }
    return [
      { left: 'Kongeloven 1665', right: 'Gud-givet enevælde' },
      { left: 'Junigrundloven 1849', right: 'Indskrænket monarkisk styre' },
      { left: 'De 7 F\'er', right: 'Udelukkelse fra demokratiet' },
      { left: 'Primærkilde', right: 'Tidligst bevarede udtryk' }
    ];
  }, [selectedPack]);

  const allExamQuestions = useMemo(() => {
    if (!currentPack) return [];
    return currentPack.sources.flatMap(s => (s.questions || []).map(q => ({ ...q, sourceTitle: s.title, id: s.id })));
  }, [currentPack]);

  const currentGrade = useMemo(() => {
    const totalPossible = allExamQuestions.length + matchingData.length * 2;
    const ratio = gradePoints / Math.max(1, totalPossible);
    if (ratio > 0.88) return "12";
    if (ratio > 0.72) return "10";
    if (ratio > 0.55) return "7";
    if (ratio > 0.38) return "4";
    if (ratio > 0.18) return "02";
    return "00";
  }, [gradePoints, allExamQuestions.length, matchingData.length]);

  const handleMatch = (item: any, side: 'left' | 'right') => {
    const newSel = { ...matchingSelections, [side]: item };
    setMatchingSelections(newSel);
    if (newSel.left && newSel.right) {
      const correct = matchingData.find(m => m.left === newSel.left && m.right === newSel.right);
      if (correct) {
        playSound('success');
        setMatches([...matches, newSel.left]);
        setGradePoints(p => p + 2);
      } else {
        playSound('damage');
        setGradePoints(p => Math.max(0, p - 1));
      }
      setMatchingSelections({ left: null, right: null });
    }
  };

  useEffect(() => {
    if (phase === 'result' && selectedPack && !stats.completedExams?.includes(selectedPack)) {
       setStats((prev: any) => ({
         ...prev,
         completedExams: [...(prev.completedExams || []), selectedPack]
       }));
    }
  }, [phase, selectedPack, stats.completedExams, setStats]);

  if (phase === 'select') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-12">
           <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs shadow-[4px_4px_0px_black] text-slate-900 hover:bg-slate-50 transition-all">✕ TILBAGE TIL TRÆNING</button>
           <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">UDVÆLG DIT EKSAMENSSÆT</span>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4 text-slate-900 underline decoration-blue-500 decoration-8">VÆLG EKSAMENSSÆT</h2>
          <p className="font-bold text-slate-500 uppercase text-xs">STANDARD HF-FORMAT: 3-4 KILDER PR. SÆT. 24 TIMERS FORBEREDELSE SIMULERET.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 pb-20">
          {packs.map(p => {
            const isDone = stats.completedExams?.includes(p.id);
            return (
              <button 
                key={p.id} 
                onClick={() => { setSelectedPack(p.id); setPhase('prep'); playSound('start'); }}
                className={`bg-white border-4 border-slate-900 p-8 text-left transition-all hover:-translate-y-2 hover:border-blue-600 relative shadow-[12px_12px_0px_black] flex flex-col h-full ${isDone ? 'bg-green-50' : 'bg-white'}`}
              >
                {isDone && <span className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 border-4 border-slate-900 text-xs font-black shadow-[4px_4px_0px_black] z-10">✓ BESTÅET</span>}
                <div className="text-6xl mb-6">{p.topicId === '3' ? '☠️' : p.topicId === '1' ? '👨‍👩‍👧' : p.topicId === '0' ? '📜' : '🏛️'}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black uppercase leading-tight mb-3 text-slate-900">{p.title}</h3>
                  <div className="mb-6">
                    <p className="text-sm font-bold text-slate-800 leading-relaxed italic mb-2">"{p.desc}"</p>
                    <p className="text-[11px] font-black text-blue-600 uppercase border-b-2 border-slate-200 pb-2 inline-block w-full">{p.sources.length} KILDER I DETTE UDTRÆK</p>
                  </div>
                </div>
                <div className="bg-slate-900 text-white border-4 border-slate-900 w-full text-center py-4 text-sm font-black shadow-[4px_4px_0px_#3b82f6] group-hover:bg-blue-600 transition-colors">TRÆK OPGAVESÆT</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === 'prep') {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8 border-b-8 border-slate-900 pb-6">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">FORBEREDELSE</h2>
            <p className="text-sm font-black text-blue-600 uppercase italic">Anbefalet læsetid: 15-20 minutter. Gå i dybden med kilderne.</p>
          </div>
          <button onClick={() => setPhase('select')} className="border-4 border-slate-900 px-4 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_black] bg-white">✕ NY OPGAVE</button>
        </div>
        <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0 overflow-hidden">
          <div className="w-full md:w-80 flex flex-col gap-3 overflow-y-auto no-scrollbar pb-24">
            {currentPack?.sources.map((s, i) => (
              <button key={s.id} onClick={() => setActiveSourceIdx(i)} className={`text-left p-6 border-4 font-black uppercase text-[10px] transition-all ${activeSourceIdx === i ? 'bg-slate-900 text-white shadow-[4px_4px_0px_rgba(59,130,246,1)] scale-105' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-500'}`}>
                KILDE {i+1}: {s.title}
              </button>
            ))}
            <div className="mt-8 pt-8 border-t-8 border-slate-900">
               <div className="mb-4 text-[10px] font-black uppercase text-slate-400 text-center">Når du er færdig med læsningen:</div>
               <button onClick={() => { playSound('start'); setPhase('exam'); }} className="bg-green-400 border-4 border-slate-900 w-full py-8 text-2xl font-black uppercase italic shadow-[8px_8px_0px_black] hover:translate-y-2 active:shadow-none transition-all">GÅ IND TIL CENSOR →</button>
            </div>
          </div>
          <div className="flex-1 bg-white border-4 border-slate-900 p-10 md:p-16 overflow-y-auto shadow-[16px_16px_0px_rgba(0,0,0,0.05)] rounded-xl scroll-smooth">
            <span className="text-[10px] font-black uppercase text-blue-600 mb-2 block tracking-widest">KILDE NR. {activeSourceIdx + 1}</span>
            <h3 className="text-3xl font-black mb-12 underline decoration-blue-300 decoration-8 text-slate-900 leading-tight">{currentPack?.sources[activeSourceIdx]?.title}</h3>
            <div className="font-serif italic text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-slate-900 border-l-[12px] border-slate-100 pl-10">
              "{currentPack?.sources[activeSourceIdx]?.text}"
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (examStep < allExamQuestions.length) {
    const q = allExamQuestions[examStep];
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 h-full">
        <div className="flex justify-between mb-8 items-end">
          <div>
            <div className="font-black text-xs uppercase text-slate-400 mb-1">TRIN 1: TEKSTNÆR ANALYSE</div>
            <div className="h-2 w-48 bg-slate-200 border-2 border-slate-900">
              <div className="h-full bg-blue-500" style={{ width: `${(examStep / allExamQuestions.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="font-black text-blue-900 text-2xl italic bg-blue-50 px-8 py-3 border-4 border-slate-900 shadow-[6px_6px_0px_black]">KARAKTER: {currentGrade}</div>
        </div>
        <div className="bg-white border-4 border-slate-900 p-12 shadow-[16px_16px_0px_black] rounded-xl">
          <p className="text-xs font-black text-blue-600 mb-4 uppercase tracking-widest border-b-2 border-slate-50 pb-2">EKSAMINATION: {q.sourceTitle}</p>
          <h2 className="text-3xl font-black mb-12 leading-tight text-slate-900">{q.question}</h2>
          <div className="space-y-4">
            {q.options.map((o: string) => (
              <button key={o} onClick={() => {
                const correct = o === q.correctAnswer;
                if (correct) { playSound('success'); setGradePoints(p => p + 1); } else playSound('damage');
                onRecord(q.id, correct);
                setExamStep(s => s + 1);
              }} className="w-full text-left p-8 border-4 border-slate-900 font-black text-xl text-slate-900 hover:bg-blue-100 hover:translate-x-2 transition-all shadow-[6px_6px_0px_black] active:translate-x-4 active:shadow-none">
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (matches.length < matchingData.length) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 pb-32">
        <div className="text-center mb-16">
          <span className="font-black text-xs uppercase text-slate-400 tracking-widest">TRIN 2: HISTORIESYN & TEORI</span>
          <h2 className="text-5xl font-black uppercase italic mt-4 text-slate-900">Kobl Kilder til Begreber</h2>
          <p className="text-lg font-bold text-slate-500 mt-2 uppercase">Vis censor at du kan se de store linjer i historien.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32">
          <div className="space-y-4">
            <p className="text-center font-black text-xs uppercase text-blue-600 mb-6 underline decoration-4">KILDE / AKTØR</p>
            {matchingData.map(m => m.left).filter(l => !matches.includes(l)).map(item => (
              <button key={item} onClick={() => handleMatch(item, 'left')} className={`w-full p-8 border-4 font-black uppercase text-sm transition-all shadow-[6px_6px_0px_black] text-slate-900 ${matchingSelections.left === item ? 'bg-blue-400 border-slate-900 scale-105' : 'bg-white hover:bg-slate-100 border-slate-900'}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <p className="text-center font-black text-xs uppercase text-yellow-600 mb-6 underline decoration-4">FAGLIGT BEGREB</p>
            {shuffle(matchingData.map(m => m.right)).filter(r => !matches.some(m => matchingData.find(md => md.left === m)?.right === r)).map(item => (
              <button key={item} onClick={() => handleMatch(item, 'right')} className={`w-full p-8 border-4 font-black uppercase text-sm transition-all shadow-[6px_6px_0px_black] text-slate-900 ${matchingSelections.right === item ? 'bg-yellow-400 border-slate-900 scale-105' : 'bg-white hover:bg-slate-100 border-slate-900'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-24 text-center">
          <div className="inline-block px-12 py-6 bg-slate-900 text-white border-4 border-slate-900 font-black text-3xl italic uppercase shadow-[10px_10px_0px_#3b82f6]">KARAKTER LIGE NU: {currentGrade}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 text-center animate-pop px-4">
       <div className="bg-white border-[12px] border-slate-900 p-16 shadow-[24px_24px_0px_rgba(0,0,0,0.1)] rounded-3xl">
          <p className="text-sm font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">EKSAMINATION AFSLUTTET</p>
          <h2 className="text-6xl font-black mb-6 uppercase italic tracking-tighter text-slate-900">CENSORENS DOM:</h2>
          <div className="text-[14rem] font-black text-blue-600 mb-10 leading-none drop-shadow-2xl animate-bounce">{currentGrade}</div>
          <p className="text-2xl font-bold text-slate-800 mb-12 max-w-lg mx-auto leading-relaxed italic border-y-4 border-slate-50 py-8">
            {currentGrade === "12" ? "Fremragende! Du har fuldt overblik over både kildernes detaljer og de tunge historiske teorier. Du er klar til den rigtige eksamen." : 
             currentGrade === "10" ? "Flot præstation. Du har godt fat i kilderne og linker dem sikkert til pensum. Bliv ved med at øve detaljerne!" : 
             currentGrade === "07" ? "Godt gået. Du har styr på det basale, men skal øve de teoretiske sammenhænge lidt mere for at nå toppen." :
             "Bestået. Du har forstået kilderne, men mangler det overordnede overblik over historiens drivkræfter. Læs dine noter en gang til!"}
          </p>
          <button 
            onClick={() => { playSound('victory'); onExit(); }} 
            className="bg-slate-900 text-white px-24 py-10 text-4xl font-black uppercase italic border-4 border-slate-900 shadow-[12px_12px_0px_#3b82f6] hover:scale-105 active:scale-95 transition-all"
          >
            AFSLUT OG GEM
          </button>
       </div>
    </div>
  );
};