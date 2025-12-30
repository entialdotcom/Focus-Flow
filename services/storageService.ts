import { UserProfile, Badge } from '../types';
import { ALL_BADGES, LISTENING_BADGES, STREAK_BADGES } from '../badgeConstants';

const STORAGE_KEY = 'focusflow_profile';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  memberSince: new Date().toISOString(),
  lastSessionDate: '',
  currentStreak: 0,
  totalSessions: 0,
  totalMinutes: 0,
  unlockedBadges: [],
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
  },

  checkNewBadges: (profile: UserProfile): Badge[] => {
    const newBadges: Badge[] = [];
    const totalHours = profile.totalMinutes / 60;

    // Check listening hour badges
    for (const badge of LISTENING_BADGES) {
      if (totalHours >= badge.threshold && !profile.unlockedBadges.includes(badge.id)) {
        newBadges.push(badge);
      }
    }

    // Check streak badges
    for (const badge of STREAK_BADGES) {
      if (profile.currentStreak >= badge.threshold && !profile.unlockedBadges.includes(badge.id)) {
        newBadges.push(badge);
      }
    }

    return newBadges;
  },

  unlockBadge: (badgeId: string): UserProfile => {
    const profile = StorageService.getProfile();
    if (!profile.unlockedBadges.includes(badgeId)) {
      profile.unlockedBadges.push(badgeId);
      StorageService.saveProfile(profile);
    }
    return profile;
  },

  getUnlockedBadges: (profile: UserProfile): Badge[] => {
    return ALL_BADGES.filter(badge => profile.unlockedBadges.includes(badge.id));
  },

  getLockedBadges: (profile: UserProfile): Badge[] => {
    return ALL_BADGES.filter(badge => !profile.unlockedBadges.includes(badge.id));
  }
};