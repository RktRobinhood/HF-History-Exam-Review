
// Fix: Defining and exporting the shared types to resolve "not a module" errors in importing components.

/**
 * Interface representing a historical topic category.
 */
export interface Topic {
  id: number;
  title: string;
  description: string;
}

/**
 * Interface representing a quiz question associated with a historical entry.
 */
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

/**
 * Interface representing a specific historical event or concept entry.
 */
export interface HistoryEntry {
  id: number;
  topicId: number;
  type: 'event' | 'concept';
  title: string;
  date?: string;
  description: string;
  tags: string[];
  questions: Question[];
}
