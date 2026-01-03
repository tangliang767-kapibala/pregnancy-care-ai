
export interface User {
  id: string;
  nickname: string;
  age: number;
  lastPeriodDate: string; 
  height: number;
  weight: number;
  healthNotes: string;
}

export interface GlucoseLog {
  id: string;
  date: string;
  timeType: 'fasting' | 'postMeal1h' | 'postMeal2h';
  value: number; // mmol/L
}

export interface ReportLog {
  id: string;
  date: string;
  title: string;
  analysis: string;
  imageUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'checkup' | 'glucose' | 'weight' | 'other';
  dueDate: string;
  isDone: boolean;
  week: number;
}

// Fix: Added missing Checkup interface required by constants.tsx
export interface Checkup {
  id: string;
  week: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

// Fix: Added missing JournalEntry interface required by screens/Journal.tsx
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
  GLUCOSE = 'glucose', // 新增血糖管理
  CHECKUPS = 'checkups',
  JOURNAL = 'journal',
  // Fix: Added missing HEALTH screen constant used in Navigation.tsx and App.tsx
  HEALTH = 'health',
  AI_CHAT = 'ai_chat',
  REPORT_CENTER = 'report_center' // 新增报告中心
}
