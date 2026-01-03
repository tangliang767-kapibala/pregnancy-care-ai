
export interface User {
  id: string;
  nickname: string;
  age: number;
  lastPeriodDate: string; // YYYY-MM-DD
  height: number; // cm
  weight: number; // kg
  healthNotes: string; // 基础疾病情况，如血糖、血液等
}

export interface PregnancyData {
  currentWeek: number;
  daysRemaining: number;
  dueDate: string;
}

export interface Checkup {
  id: string;
  week: number;
  title: string;
  description: string;
  isCompleted: boolean;
  date?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  weight: number;
  mood: string;
  note: string;
}

export enum AppScreen {
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  HEALTH = 'health',
  CHECKUPS = 'checkups',
  JOURNAL = 'journal',
  AI_CHAT = 'ai_chat',
  PROFILE = 'profile'
}
