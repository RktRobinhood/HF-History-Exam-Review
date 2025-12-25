
export type EntryType = 'event' | 'term' | 'concept';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  type: EntryType;
  date?: string; // For events
  period?: string;
  description: string;
  tags: string[];
  topicId: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export type ViewMode = 'menu' | 'flashcards' | 'quiz' | 'browser';
