
export interface PregnancyData {
  lastPeriodDate: string;
  dueDate: string;
  currentWeek: number;
  daysRemaining: number;
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

export interface FoodTip {
  name: string;
  benefit: string;
  recommendation: 'EAT' | 'MODERATE' | 'AVOID';
  category: string;
}

export enum AppScreen {
  DASHBOARD = 'dashboard',
  HEALTH = 'health',
  CHECKUPS = 'checkups',
  JOURNAL = 'journal',
  AI_CHAT = 'ai_chat',
  SETTINGS = 'settings'
}
