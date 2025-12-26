
import React, { useState, useEffect } from 'react';

export const NoteViewer = ({ selectedTopicId }: { selectedTopicId: string }) => {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setError(null);
    fetch(`./notes/emne${selectedTopicId}.html`)
      .then(res => res.ok ? res.text() : Promise.reject())
      .then(html => setContent(html))
      .catch(() => setError("Noter ikke fundet."))
      .finally(() => setLoading(false));
  }, [selectedTopicId]);

  return (
    <div className="flex-1 bg-white border-8 border-slate-900 shadow-[12px_12px_0px_rgba(0,0,0,0.1)] relative overflow-hidden h-full">
      {loading && <div className="absolute inset-0 flex items-center justify-center bg-white z-20 font-black uppercase text-xs">Indlæser Pensum...</div>}
      {error ? (
        <div className="p-20 text-center h-full flex flex-col justify-center items-center bg-slate-50">
          <div className="text-6xl mb-4">🏜️</div>
          <p className="font-black uppercase text-slate-400">Noter Mangler for dette emne</p>
        </div>
      ) : <iframe srcDoc={content || ''} className="w-full h-full border-none" title="Curriculum Noter" />}
    </div>
  );
};
