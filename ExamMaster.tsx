import React, { useState, useMemo, useEffect } from 'react';
import { PRIMARY_SOURCES } from './data/index.js';

export const ExamMaster = ({ stats, setStats, onExit, onRecord, playSound }: any) => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'prep' | 'exam' | 'result'>('select');
  const [activeSourceIdx, setActiveSourceIdx] = useState(0);
  const [examStep, setExamStep] = useState(0);
  const [gradePoints, setGradePoints] = useState(0);

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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 mb-12 bg-white font-black uppercase text-xs">✕ TILBAGE</button>
      <h2 className="text-5xl font-black uppercase italic mb-12 tracking-tighter underline decoration-blue-500">VÆLG EKSAMENSSÆT</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packs.map(p => (
          <button key={p.id} onClick={() => { setSelectedPack(p.id); setPhase('prep'); playSound('start'); }} className="bg-white border-4 border-slate-900 p-8 text-left shadow-[12px_12px_0px_black] flex flex-col h-full hover:-translate-y-2 transition-all">
            <h3 className="text-2xl font-black mb-4 uppercase">{p.title}</h3>
            <p className="flex-1 text-sm font-bold text-slate-600 mb-8 italic">"{p.desc}"</p>
            <div className="bg-slate-900 text-white py-4 text-center font-black uppercase text-xs shadow-[4px_4px_0px_#3b82f6]">TRÆK OPGAVESÆT</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (phase === 'prep') return (
    <div className="max-w-6xl mx-auto py-6 h-full flex flex-col px-4">
      <div className="flex justify-between border-b-8 border-slate-900 pb-6 mb-8">
        <h2 className="text-4xl font-black italic uppercase">FORBEREDELSE (24 T)</h2>
        <button onClick={() => setPhase('exam')} className="bg-green-400 border-4 border-slate-900 px-8 py-4 font-black uppercase shadow-[4px_4px_0px_black]">GÅ TIL EKSAMEN →</button>
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
        <div className="w-full md:w-80 flex flex-col gap-3">
          {currentPack?.sources.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSourceIdx(i)} className={`p-6 border-4 font-black text-left uppercase text-[10px] ${activeSourceIdx === i ? 'bg-slate-900 text-white shadow-[4px_4px_0px_blue]' : 'bg-white border-slate-300 text-slate-400'}`}>KILDE {i+1}</button>
          ))}
        </div>
        <div className="flex-1 bg-white border-4 border-slate-900 p-12 overflow-y-auto shadow-inner rounded-xl">
          <h3 className="text-3xl font-black mb-12 underline decoration-blue-200">{currentPack?.sources[activeSourceIdx]?.title}</h3>
          <p className="font-serif italic text-2xl leading-relaxed whitespace-pre-wrap">"{currentPack?.sources[activeSourceIdx]?.text}"</p>
        </div>
      </div>
    </div>
  );

  if (examStep < allExamQuestions.length) {
    const q = allExamQuestions[examStep];
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 h-full">
        <div className="flex justify-between mb-8 items-center border-b-4 border-slate-100 pb-4">
          <h2 className="font-black text-4xl italic text-blue-600 drop-shadow-sm">KARAKTER: {currentGrade}</h2>
          <span className="font-black text-xs uppercase text-slate-400">{examStep + 1} / {allExamQuestions.length}</span>
        </div>
        <div className="bg-white border-4 border-slate-900 p-12 shadow-[16px_16px_0px_black] rounded-xl">
          <h2 className="text-3xl font-black mb-12 leading-tight uppercase tracking-tighter">{q.question}</h2>
          <div className="space-y-4">
            {q.options.map((o: string) => (
              <button key={o} onClick={() => { const ok = o === q.correctAnswer; if (ok) { setGradePoints(p => p + 1); playSound('success'); } else playSound('damage'); onRecord(q.id, ok); setExamStep(s => s + 1); }} className="w-full text-left p-8 border-4 border-slate-900 font-black text-lg hover:bg-blue-50 transition-all shadow-[6px_6px_0px_black] active:translate-y-1 active:shadow-none">
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 text-center px-4">
      <div className="bg-white border-[12px] border-slate-900 p-16 rounded-3xl shadow-[24px_24px_0px_rgba(0,0,0,0.1)]">
        <h2 className="text-4xl font-black mb-6 uppercase text-slate-400 italic">CENSORENS DOM</h2>
        <div className="text-[12rem] font-black text-blue-600 mb-10 leading-none drop-shadow-2xl">{currentGrade}</div>
        <button onClick={() => { setStats((p: any) => ({ ...p, completedExams: [...(p.completedExams || []), selectedPack] })); onExit(); playSound('victory'); }} className="bg-slate-900 text-white px-16 py-8 text-2xl font-black uppercase italic border-4 border-slate-900 shadow-[8px_8px_0px_#3b82f6]">GEM OG AFSLUT</button>
      </div>
    </div>
  );
};