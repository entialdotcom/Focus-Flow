import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../../services/storageService';
import { BadgeType, UserProfile, FavoriteTrack } from '../../types';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return default profile when no data is stored', () => {
      const profile = StorageService.getProfile();

      expect(profile.name).toBe('');
      expect(profile.currentStreak).toBe(0);
      expect(profile.totalSessions).toBe(0);
      expect(profile.totalMinutes).toBe(0);
      expect(profile.lastSessionDate).toBe('');
      expect(profile.memberSince).toBeDefined();
    });

    it('should return stored profile data', () => {
      const storedProfile: UserProfile = {
        name: 'Test User',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '2024-06-15',
        currentStreak: 5,
        totalSessions: 20,
        totalMinutes: 300,
      };
      localStorage.setItem('focusmode_profile', JSON.stringify(storedProfile));

      const profile = StorageService.getProfile();

      expect(profile.name).toBe('Test User');
      expect(profile.currentStreak).toBe(5);
      expect(profile.totalSessions).toBe(20);
      expect(profile.totalMinutes).toBe(300);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('focusmode_profile', 'invalid json');

      const profile = StorageService.getProfile();

      expect(profile.name).toBe('');
      expect(profile.currentStreak).toBe(0);
    });

    it('should merge with defaults for partial data', () => {
      localStorage.setItem('focusmode_profile', JSON.stringify({ name: 'Partial' }));

      const profile = StorageService.getProfile();

      expect(profile.name).toBe('Partial');
      expect(profile.currentStreak).toBe(0); // default
      expect(profile.totalMinutes).toBe(0); // default
    });
  });

  describe('saveProfile', () => {
    it('should save profile to localStorage', () => {
      const profile: UserProfile = {
        name: 'New User',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '2024-06-15',
        currentStreak: 3,
        totalSessions: 10,
        totalMinutes: 150,
      };

      StorageService.saveProfile(profile);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'focusmode_profile',
        JSON.stringify(profile)
      );
    });
  });

  describe('updateName', () => {
    it('should update and return profile with new name', () => {
      const profile = StorageService.updateName('John Doe');

      expect(profile.name).toBe('John Doe');
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should preserve existing profile data', () => {
      const existingProfile: UserProfile = {
        name: 'Old Name',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '2024-06-15',
        currentStreak: 7,
        totalSessions: 15,
        totalMinutes: 200,
      };
      localStorage.setItem('focusmode_profile', JSON.stringify(existingProfile));

      const profile = StorageService.updateName('New Name');

      expect(profile.name).toBe('New Name');
      expect(profile.currentStreak).toBe(7);
      expect(profile.totalSessions).toBe(15);
    });
  });

  describe('logSession', () => {
    it('should increment totals on session log', () => {
      const profile = StorageService.logSession(25);

      expect(profile.totalSessions).toBe(1);
      expect(profile.totalMinutes).toBe(25);
    });

    it('should start streak at 1 for first session', () => {
      const profile = StorageService.logSession(30);

      expect(profile.currentStreak).toBe(1);
    });

    it('should maintain streak for consecutive days', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const existingProfile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: yesterday,
        currentStreak: 5,
        totalSessions: 10,
        totalMinutes: 200,
      };
      localStorage.setItem('focusmode_profile', JSON.stringify(existingProfile));

      const profile = StorageService.logSession(25);

      expect(profile.currentStreak).toBe(6);
    });

    it('should reset streak after a gap', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
      const existingProfile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: twoDaysAgo,
        currentStreak: 10,
        totalSessions: 20,
        totalMinutes: 400,
      };
      localStorage.setItem('focusmode_profile', JSON.stringify(existingProfile));

      const profile = StorageService.logSession(25);

      expect(profile.currentStreak).toBe(1);
    });

    it('should not increment streak for same-day sessions', () => {
      const today = new Date().toISOString().split('T')[0];
      const existingProfile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: today,
        currentStreak: 5,
        totalSessions: 10,
        totalMinutes: 200,
      };
      localStorage.setItem('focusmode_profile', JSON.stringify(existingProfile));

      const profile = StorageService.logSession(25);

      expect(profile.currentStreak).toBe(5);
      expect(profile.totalSessions).toBe(11);
      expect(profile.totalMinutes).toBe(225);
    });

    it('should set streak to 1 if same day but streak was 0', () => {
      const today = new Date().toISOString().split('T')[0];
      const existingProfile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: today,
        currentStreak: 0,
        totalSessions: 5,
        totalMinutes: 100,
      };
      localStorage.setItem('focusmode_profile', JSON.stringify(existingProfile));

      const profile = StorageService.logSession(25);

      expect(profile.currentStreak).toBe(1);
    });

    it('should accumulate minutes over multiple sessions', () => {
      // Start with a fresh profile
      const freshProfile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 0,
        totalSessions: 0,
        totalMinutes: 0,
      };
      localStorage.setItem('focusmode_profile', JSON.stringify(freshProfile));

      StorageService.logSession(25);
      StorageService.logSession(30);
      const profile = StorageService.logSession(15);

      expect(profile.totalSessions).toBe(3);
      expect(profile.totalMinutes).toBe(70);
    });
  });

  describe('getUnlockedBadges', () => {
    it('should return no badges for new user', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 0,
        totalSessions: 0,
        totalMinutes: 0,
      };

      const badges = StorageService.getUnlockedBadges(profile);

      expect(badges).toHaveLength(0);
    });

    it('should unlock first hour badge at 60 minutes', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 0,
        totalSessions: 3,
        totalMinutes: 60,
      };

      const badges = StorageService.getUnlockedBadges(profile);

      expect(badges.some(b => b.id === 'listening_1h')).toBe(true);
    });

    it('should unlock 10 hours badge at 600 minutes', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 0,
        totalSessions: 20,
        totalMinutes: 600,
      };

      const badges = StorageService.getUnlockedBadges(profile);

      expect(badges.some(b => b.id === 'listening_10h')).toBe(true);
    });

    it('should unlock 3-day streak badge', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 3,
        totalSessions: 5,
        totalMinutes: 100,
      };

      const badges = StorageService.getUnlockedBadges(profile);

      expect(badges.some(b => b.id === 'streak_3d')).toBe(true);
    });

    it('should unlock 7-day streak badge', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 7,
        totalSessions: 10,
        totalMinutes: 200,
      };

      const badges = StorageService.getUnlockedBadges(profile);

      expect(badges.some(b => b.id === 'streak_7d')).toBe(true);
      expect(badges.some(b => b.id === 'streak_3d')).toBe(true);
    });

    it('should unlock multiple badges for advanced user', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 30,
        totalSessions: 100,
        totalMinutes: 1200, // 20 hours
      };

      const badges = StorageService.getUnlockedBadges(profile);

      // Listening badges: 1h, 10h, 20h
      expect(badges.some(b => b.id === 'listening_1h')).toBe(true);
      expect(badges.some(b => b.id === 'listening_10h')).toBe(true);
      expect(badges.some(b => b.id === 'listening_20h')).toBe(true);
      // Streak badges: 3d, 7d, 30d
      expect(badges.some(b => b.id === 'streak_3d')).toBe(true);
      expect(badges.some(b => b.id === 'streak_7d')).toBe(true);
      expect(badges.some(b => b.id === 'streak_30d')).toBe(true);
    });
  });

  describe('getLockedBadges', () => {
    it('should return all badges for new user', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 0,
        totalSessions: 0,
        totalMinutes: 0,
      };

      const badges = StorageService.getLockedBadges(profile);

      // All 11 badges should be locked
      expect(badges.length).toBeGreaterThan(0);
      expect(badges.some(b => b.id === 'listening_1h')).toBe(true);
    });

    it('should not include unlocked badges', () => {
      const profile: UserProfile = {
        name: '',
        memberSince: '2024-01-01T00:00:00.000Z',
        lastSessionDate: '',
        currentStreak: 3,
        totalSessions: 5,
        totalMinutes: 60,
      };

      const lockedBadges = StorageService.getLockedBadges(profile);

      // listening_1h and streak_3d should NOT be in locked
      expect(lockedBadges.some(b => b.id === 'listening_1h')).toBe(false);
      expect(lockedBadges.some(b => b.id === 'streak_3d')).toBe(false);
    });
  });

  describe('Favorites', () => {
    const testTrack: FavoriteTrack = {
      videoId: 'abc123',
      title: 'Test Track',
      category: 'Focus',
      addedAt: '2024-06-15T10:00:00.000Z',
    };

    describe('getFavorites', () => {
      it('should return empty array when no favorites', () => {
        const favorites = StorageService.getFavorites();
        expect(favorites).toEqual([]);
      });

      it('should return stored favorites', () => {
        localStorage.setItem('focusmode_favorites', JSON.stringify([testTrack]));

        const favorites = StorageService.getFavorites();

        expect(favorites).toHaveLength(1);
        expect(favorites[0].videoId).toBe('abc123');
      });

      it('should handle invalid JSON gracefully', () => {
        localStorage.setItem('focusmode_favorites', 'invalid json');

        const favorites = StorageService.getFavorites();

        expect(favorites).toEqual([]);
      });
    });

    describe('addFavorite', () => {
      it('should add a new favorite', () => {
        const favorites = StorageService.addFavorite(testTrack);

        expect(favorites).toHaveLength(1);
        expect(favorites[0].videoId).toBe('abc123');
      });

      it('should add new favorites at the beginning', () => {
        StorageService.addFavorite(testTrack);
        const newTrack: FavoriteTrack = {
          videoId: 'xyz789',
          title: 'New Track',
          addedAt: '2024-06-16T10:00:00.000Z',
        };

        const favorites = StorageService.addFavorite(newTrack);

        expect(favorites).toHaveLength(2);
        expect(favorites[0].videoId).toBe('xyz789');
        expect(favorites[1].videoId).toBe('abc123');
      });

      it('should not add duplicate favorites', () => {
        StorageService.addFavorite(testTrack);
        const favorites = StorageService.addFavorite(testTrack);

        expect(favorites).toHaveLength(1);
      });
    });

    describe('removeFavorite', () => {
      it('should remove a favorite by videoId', () => {
        StorageService.addFavorite(testTrack);

        const favorites = StorageService.removeFavorite('abc123');

        expect(favorites).toHaveLength(0);
      });

      it('should return unchanged array if videoId not found', () => {
        StorageService.addFavorite(testTrack);

        const favorites = StorageService.removeFavorite('nonexistent');

        expect(favorites).toHaveLength(1);
      });
    });

    describe('isFavorite', () => {
      it('should return true for favorited track', () => {
        StorageService.addFavorite(testTrack);

        expect(StorageService.isFavorite('abc123')).toBe(true);
      });

      it('should return false for non-favorited track', () => {
        expect(StorageService.isFavorite('abc123')).toBe(false);
      });
    });

    describe('toggleFavorite', () => {
      it('should add favorite when not favorited', () => {
        const result = StorageService.toggleFavorite(testTrack);

        expect(result).toBe(true);
        expect(StorageService.isFavorite('abc123')).toBe(true);
      });

      it('should remove favorite when already favorited', () => {
        StorageService.addFavorite(testTrack);

        const result = StorageService.toggleFavorite(testTrack);

        expect(result).toBe(false);
        expect(StorageService.isFavorite('abc123')).toBe(false);
      });
    });
  });
});
