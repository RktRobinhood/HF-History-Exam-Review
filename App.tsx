
import React, { useState, useMemo } from 'react';
import { TOPICS, HISTORY_ENTRIES } from './data/historyData';
import { ViewMode } from './types';
import TopicCard from './components/TopicCard';
import FlashcardView from './components/FlashcardView';
import QuizView from './components/QuizView';
import BrowserView from './components/BrowserView';

const App: React.FC = () => {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('menu');

  const filteredEntries = useMemo(() => {
    if (selectedTopicIds.length === 0) return HISTORY_ENTRIES;
    return HISTORY_ENTRIES.filter(e => selectedTopicIds.includes(e.topicId));
  }, [selectedTopicIds]);

  const toggleTopic = (id: string) => {
    setSelectedTopicIds(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const selectAllTopics = () => {
    setSelectedTopicIds(TOPICS.map(t => t.id));
  };

  const clearTopics = () => {
    setSelectedTopicIds([]);
  };

  const getTopicEntryCount = (id: string) => {
    return HISTORY_ENTRIES.filter(e => e.topicId === id).length;
  };

  // Rendering logic based on state
  if (viewMode === 'flashcards') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <FlashcardView 
          entries={filteredEntries} 
          onExit={() => setViewMode('menu')} 
        />
      </div>
    );
  }

  if (viewMode === 'quiz') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <QuizView 
          entries={filteredEntries} 
          onExit={() => setViewMode('menu')} 
        />
      </div>
    );
  }

  if (viewMode === 'browser') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <BrowserView 
          entries={filteredEntries} 
          topics={TOPICS}
          onExit={() => setViewMode('menu')} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Historie <span className="text-indigo-600">HF Master</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Gør dig klar til din historieeksamen med interaktive flashcards og quizzer baseret på dit kernestof.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 pb-32">
        {/* Topic Selection */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-slate-800">Vælg Emner</h2>
            <div className="flex gap-4">
              <button 
                onClick={selectAllTopics}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                Vælg alle
              </button>
              <button 
                onClick={clearTopics}
                className="text-sm font-medium text-slate-400 hover:text-slate-600"
              >
                Ryd valg
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map(topic => (
              <TopicCard 
                key={topic.id}
                topic={topic}
                isSelected={selectedTopicIds.includes(topic.id)}
                onClick={() => toggleTopic(topic.id)}
                count={getTopicEntryCount(topic.id)}
              />
            ))}
          </div>
        </section>

        {/* Action Selection */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Vælg Aktivitet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => setViewMode('flashcards')}
              className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Flashcards</h3>
              <p className="text-sm text-slate-500">Lær begreber og datoer ved at vende kortene.</p>
            </button>

            <button 
              onClick={() => setViewMode('quiz')}
              className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Multiple Choice</h3>
              <p className="text-sm text-slate-500">Test din viden med spørgsmål fra emnerne.</p>
            </button>

            <button 
              onClick={() => setViewMode('browser')}
              className="group bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Gennemse Data</h3>
              <p className="text-sm text-slate-500">Læs alle begivenheder og begreber i en liste.</p>
            </button>
          </div>
        </section>
      </main>

      {/* Stats Sticky Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Valgte Emner</span>
              <span className="font-bold text-indigo-600">{selectedTopicIds.length || 'Alle'} valgt</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Kort i alt</span>
              <span className="font-bold text-slate-700">{filteredEntries.length}</span>
            </div>
          </div>
          <div className="flex gap-2">
             <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">Klar til eksamen</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
