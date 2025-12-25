
// Shared type definitions for the history learning application.
// This file is a module that exports interfaces used across the UI components.

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  entryTitle?: string;
}

export interface HistoryEntry {
  id: number;
  topicId: number;
  title: string;
  description: string;
  date?: string;
  type: 'event' | 'concept';
  tags: string[];
  questions: Question[];
}

export interface Topic {
  id: number;
  title: string;
  description: string;
}
