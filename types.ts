export enum AppView {
  HOME = 'HOME',
  PLAYER = 'PLAYER'
}

export enum Mode {
  FOCUS = 'Focus',
  RELAX = 'Relax',
  SLEEP = 'Sleep',
  MEDITATE = 'Meditate',
  MOTIVATION = 'Motivation',
  SUCCESS = 'Success'
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  mode: Mode;
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

export enum BadgeType {
  LISTENING_HOURS = 'LISTENING_HOURS',
  STREAK = 'STREAK',
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  threshold: number;
  icon: string;
}

export interface FavoriteTrack {
  videoId: string;
  title: string;
  category?: string; // Activity name for display
  activityId?: string; // Activity ID for navigation
  mode?: Mode; // The mode this track belongs to
  addedAt: string; // ISO date string
}