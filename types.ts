export enum AppView {
  HOME = 'HOME',
  PLAYER = 'PLAYER',
  HISTORY = 'HISTORY',
  LIBRARY = 'LIBRARY'
}

export enum Mode {
  FOCUS = 'Focus',
  RELAX = 'Relax',
  SLEEP = 'Sleep',
  MEDITATE = 'Meditate',
  MOTIVATION = 'Motivation'
}

export interface Mood {
  id: string;
  name: string;
  description: string;
}

export interface Track {
  id: string;
  title: string;
  videoId: string;
  moodId?: string;
  category?: string;
  url?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  mode: Mode;
  moods?: Mood[];
}

export interface TrackInfo {
  title: string;
  genre: string;
  effect: string;
}

export enum TimerMode {
  INFINITE = 'INFINITE',
  TIMER = 'TIMER',
  INTERVALS = 'INTERVALS'
}

export interface Quote {
  text: string;
  author: string;
}

export interface UserProfile {
  name: string;
  memberSince: string; // ISO Date string
  lastSessionDate: string; // YYYY-MM-DD
  currentStreak: number;
  totalSessions: number;
  totalMinutes: number;
}

export interface AmbientSound {
  id: string;
  name: string;
  videoId: string;
  defaultVolume: number;
}

export interface MixerState {
  [id: string]: {
    active: boolean;
    volume: number;
  };
}

export interface ListeningSession {
  id: string;
  date: string; // ISO Date string
  duration: number; // minutes
  mode: Mode;
  activityId: string;
  activityName: string;
  trackTitle?: string;
  moodId?: string;
  moodName?: string;
}

export enum BadgeType {
  LISTENING_HOURS = 'LISTENING_HOURS',
  STREAK = 'STREAK'
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  threshold: number;
  icon: string;
}