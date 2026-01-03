import { UserProfile, Badge, BadgeType, FavoriteTrack } from '../types';
import { ALL_BADGES } from '../badgeConstants';

const STORAGE_KEY = 'focusflow_profile';
const FAVORITES_KEY = 'focusflow_favorites';

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
  },

  // Favorites Methods
  getFavorites: (): FavoriteTrack[] => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
    return [];
  },

  saveFavorites: (favorites: FavoriteTrack[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  },

  addFavorite: (track: FavoriteTrack): FavoriteTrack[] => {
    const favorites = StorageService.getFavorites();
    // Check if already favorited
    if (favorites.some(f => f.videoId === track.videoId)) {
      return favorites;
    }
    const updated = [track, ...favorites];
    StorageService.saveFavorites(updated);
    return updated;
  },

  removeFavorite: (videoId: string): FavoriteTrack[] => {
    const favorites = StorageService.getFavorites();
    const updated = favorites.filter(f => f.videoId !== videoId);
    StorageService.saveFavorites(updated);
    return updated;
  },

  isFavorite: (videoId: string): boolean => {
    const favorites = StorageService.getFavorites();
    return favorites.some(f => f.videoId === videoId);
  },

  toggleFavorite: (track: FavoriteTrack): boolean => {
    if (StorageService.isFavorite(track.videoId)) {
      StorageService.removeFavorite(track.videoId);
      return false;
    } else {
      StorageService.addFavorite(track);
      return true;
    }
  }
};