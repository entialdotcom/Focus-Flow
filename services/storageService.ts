import { UserProfile, ListeningSession, Badge, BadgeType } from '../types';
import { ALL_BADGES } from '../badgeConstants';

const STORAGE_KEY = 'focusflow_profile';
const HISTORY_KEY = 'focusflow_history';

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
  },

  // Listening History Methods
  getHistory: (): ListeningSession[] => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
    return [];
  },

  saveHistory: (history: ListeningSession[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  },

  addSession: (session: ListeningSession): ListeningSession[] => {
    const history = StorageService.getHistory();
    // Add new session at the beginning (most recent first)
    const updated = [session, ...history];
    // Keep only last 100 sessions
    const trimmed = updated.slice(0, 100);
    StorageService.saveHistory(trimmed);
    return trimmed;
  },

  clearHistory: () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  },

  // Favorites Methods
  getFavorites: (): string[] => {
    try {
      const stored = localStorage.getItem('focusflow_favorites');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
    return [];
  },

  saveFavorites: (favoriteIds: string[]) => {
    try {
      localStorage.setItem('focusflow_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  },

  toggleFavorite: (trackId: string): boolean => {
    const favorites = StorageService.getFavorites();
    const index = favorites.indexOf(trackId);
    if (index > -1) {
      favorites.splice(index, 1);
      StorageService.saveFavorites(favorites);
      return false;
    } else {
      favorites.push(trackId);
      StorageService.saveFavorites(favorites);
      return true;
    }
  },

  isFavorite: (trackId: string): boolean => {
    const favorites = StorageService.getFavorites();
    return favorites.includes(trackId);
  },

  // Badge Methods
  getUnlockedBadges: (profile: UserProfile): Badge[] => {
    const totalHours = profile.totalMinutes / 60;
    return ALL_BADGES.filter(badge => {
      if (badge.type === BadgeType.LISTENING_HOURS) {
        return totalHours >= badge.threshold;
      } else if (badge.type === BadgeType.STREAK) {
        return profile.currentStreak >= badge.threshold;
      }
      return false;
    });
  },

  getLockedBadges: (profile: UserProfile): Badge[] => {
    const totalHours = profile.totalMinutes / 60;
    return ALL_BADGES.filter(badge => {
      if (badge.type === BadgeType.LISTENING_HOURS) {
        return totalHours < badge.threshold;
      } else if (badge.type === BadgeType.STREAK) {
        return profile.currentStreak < badge.threshold;
      }
      return true;
    });
  }
};