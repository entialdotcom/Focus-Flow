import { UserProfile } from '../types';

const STORAGE_KEY = 'focusflow_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  memberSince: new Date().toISOString(),
  lastSessionDate: '',
  currentStreak: 0,
  totalSessions: 0,
  totalMinutes: 0,
};

export const StorageService = {
  getProfile: (): UserProfile => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Merge with default to handle potential future schema changes safely
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
    return DEFAULT_PROFILE;
  },

  saveProfile: (profile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  },

  updateName: (name: string): UserProfile => {
    const profile = StorageService.getProfile();
    profile.name = name;
    StorageService.saveProfile(profile);
    return profile;
  },

  logSession: (minutes: number): UserProfile => {
    const profile = StorageService.getProfile();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Update Totals
    profile.totalSessions += 1;
    profile.totalMinutes += minutes;

    // Update Streak Logic
    if (profile.lastSessionDate !== today) {
      if (profile.lastSessionDate === yesterday) {
        // Consecutive day
        profile.currentStreak += 1;
      } else {
        // Break in streak or first session
        profile.currentStreak = 1;
      }
      profile.lastSessionDate = today;
    } else {
        // Already logged today, streak remains same, but ensure it's at least 1
        if (profile.currentStreak === 0) profile.currentStreak = 1;
    }

    StorageService.saveProfile(profile);
    return profile;
  }
};