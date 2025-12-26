import React, { useState, useEffect } from 'react';

export const NoteViewer = ({ selectedTopicId }) => {
  const [content, setContent] = useState(null);
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
           <span className="uppercase text-slate-400">NOTER MANGLER FOR DETTE EMNE</span>
        </div>
      ) : <iframe srcDoc={content || ''} className="w-full h-full border-none" title="Notes" />}
    </div>
  );
};