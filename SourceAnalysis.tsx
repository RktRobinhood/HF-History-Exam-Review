import React, { useState, useMemo } from 'react';
import { shuffle } from './utils.ts';

export const SourceAnalysis = ({ sources, onExit, onRecord, playSound }: any) => {
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
  if (!currentSource) return <div className="text-center p-20"><button onClick={onExit} className="border-4 p-4 border-slate-900 font-black uppercase">VÆLG EMNER</button></div>;
  return (
    <div className="max-w-4xl mx-auto py-12 h-full overflow-y-auto no-scrollbar pb-48 px-4">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onExit} className="border-4 border-slate-900 px-6 py-2 bg-white font-black uppercase text-xs">✕ AFSLUT</button>
        <span className="font-black bg-yellow-300 border-4 border-slate-900 px-6 py-2 uppercase text-xs">KILDE {curr + 1} / {sessionSources.length}</span>
      </div>
      <div className="bg-white border-4 border-slate-900 p-12 shadow-[20px_20px_0px_black] rounded-3xl">
        <h2 className="text-3xl font-black mb-8 underline decoration-blue-400 decoration-8">{currentSource.title}</h2>
        <div className="bg-slate-50 border-4 border-slate-900 p-8 mb-12 italic text-xl whitespace-pre-wrap border-l-[12px] border-l-slate-900">"{currentSource.text}"</div>
        <div className="space-y-12">
          {currentQuestions.map((q: any) => (
            <div key={q.id} className="border-t-4 border-slate-900 pt-8">
              <p className="font-black text-xl mb-6">{q.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((o: string) => (
                  <button key={o} onClick={() => handleAnswer(q.id, o)} className={`p-6 border-4 font-black text-left text-sm ${activeAnswers[q.id] ? (o === currentSource.questions[q.id].correctAnswer ? 'bg-green-400' : (o === activeAnswers[q.id] ? 'bg-red-400' : 'opacity-30')) : 'bg-white hover:bg-blue-50 border-slate-900 shadow-[4px_4px_0px_black]'}`}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => curr < sessionSources.length - 1 ? (setCurr(curr + 1), setActiveAnswers({})) : onExit()} className="bg-blue-400 border-4 border-slate-900 w-full py-8 mt-12 text-2xl font-black uppercase italic shadow-[8px_8px_0px_black]">NÆSTE</button>
      </div>
    </div>
  );
};