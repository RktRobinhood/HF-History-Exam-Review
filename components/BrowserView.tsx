
import React, { useState } from 'react';
import { HistoryEntry, Topic } from '../types';

interface BrowserViewProps {
  entries: HistoryEntry[];
  topics: Topic[];
  onExit: () => void;
}

const BrowserView: React.FC<BrowserViewProps> = ({ entries, topics, onExit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = entries.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Vidensbank</h2>
        <button onClick={onExit} className="text-indigo-600 font-bold hover:underline">Gå tilbage</button>
      </div>

      <div className="relative mb-8">
        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input 
          type="text" 
          placeholder="Søg i begreber, begivenheder eller tags..."
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-200 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.map(entry => (
          <div key={entry.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${entry.type === 'event' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {entry.type === 'event' ? 'Begivenhed' : 'Begreb'}
                </span>
                <h3 className="text-xl font-bold text-slate-800">
                  {entry.title} {entry.date && <span className="text-slate-400 font-normal ml-2">({entry.date})</span>}
                </h3>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Emne {entry.topicId}</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">{entry.description}</p>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">#{tag}</span>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200">
             <p className="text-slate-400 italic">Ingen resultater matcher din søgning.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserView;
