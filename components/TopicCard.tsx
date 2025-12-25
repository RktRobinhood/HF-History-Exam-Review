
import React from 'react';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  isSelected: boolean;
  onClick: () => void;
  count: number;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, isSelected, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all text-left w-full h-full flex flex-col ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">
          Emne {topic.id}
        </span>
        <span className="text-slate-400 text-xs font-medium">
          {count} kort
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{topic.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2">{topic.description}</p>
    </button>
  );
};

export default TopicCard;
