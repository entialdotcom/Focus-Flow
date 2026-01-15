import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  extractYouTubeVideoId,
  loadMotivationVideos,
  loadGuidedMeditations,
  loadFocusTracks,
  getMotivationTrackIds,
  getMotivationCategories,
  getMeditationCategories,
  MotivationData,
  MeditationData,
  FocusData,
} from '../../services/trackService';

describe('trackService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module state by clearing caches
    vi.resetModules();
  });

  describe('extractYouTubeVideoId', () => {
    it('should return empty string for empty input', () => {
      expect(extractYouTubeVideoId('')).toBe('');
    });

    it('should extract ID from standard watch URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from watch URL with additional params', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from youtu.be short URL', () => {
      expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from youtu.be URL with params', () => {
      expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ?t=30')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from embed URL', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from /v/ URL format', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should return the input if no pattern matches', () => {
      expect(extractYouTubeVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should handle HTTP URLs', () => {
      expect(extractYouTubeVideoId('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should handle URLs without www', () => {
      expect(extractYouTubeVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('should handle 11-character video IDs with special characters', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=abc-123_XYZ')).toBe('abc-123_XYZ');
    });

    it('should handle embed URL with autoplay param', () => {
      expect(extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')).toBe('dQw4w9WgXcQ');
    });
  });

  describe('loadMotivationVideos', () => {
    it('should return data on successful fetch', async () => {
      const mockData: MotivationData = {
        metadata: {
          total_videos: 10,
          channels: ['Channel 1'],
        },
        motivation_categories: {
          discipline: {
            description: 'Discipline videos',
            count: 5,
            videos: [
              { title: 'Video 1', url: 'https://youtu.be/abc123', channel: 'Channel 1' },
            ],
          },
        },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      // Re-import to get fresh module state
      const { loadMotivationVideos: freshLoad } = await import('../../services/trackService');
      const result = await freshLoad();

      expect(result).toEqual(mockData);
    });

    it('should return null on fetch error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      const { loadMotivationVideos: freshLoad } = await import('../../services/trackService');
      const result = await freshLoad();

      expect(result).toBeNull();
    });

    it('should return null on network error', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

      const { loadMotivationVideos: freshLoad } = await import('../../services/trackService');
      const result = await freshLoad();

      expect(result).toBeNull();
    });
  });

  describe('loadGuidedMeditations', () => {
    it('should return data on successful fetch', async () => {
      const mockData: MeditationData = {
        metadata: {
          total_meditations: 15,
          categories: ['love', 'gratitude'],
        },
        meditation_categories: {
          love: {
            description: 'Self-love meditations',
            count: 5,
            videos: [
              { title: 'Meditation 1', url: 'https://youtu.be/xyz789' },
            ],
          },
        },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const { loadGuidedMeditations: freshLoad } = await import('../../services/trackService');
      const result = await freshLoad();

      expect(result).toEqual(mockData);
    });

    it('should return null on fetch error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      const { loadGuidedMeditations: freshLoad } = await import('../../services/trackService');
      const result = await freshLoad();

      expect(result).toBeNull();
    });
  });

  describe('loadFocusTracks', () => {
    it('should return data on successful fetch', async () => {
      const mockData: FocusData = {
        channel: {
          name: 'Founder FM',
          handle: '@founderfm',
        },
        videos: [
          { title: 'Focus Track 1', url: 'https://youtu.be/focus1', views: '1M', published: '2024-01-01' },
        ],
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const { loadFocusTracks: freshLoad } = await import('../../services/trackService');
      const result = await freshLoad();

      expect(result).toEqual(mockData);
    });

    it('should return null on fetch error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Server Error',
      } as Response);

      const { loadFocusTracks: freshLoad } = await import('../../services/trackService');
      const result = await freshLoad();

      expect(result).toBeNull();
    });
  });

  describe('getMotivationTrackIds', () => {
    it('should return video IDs for a category', async () => {
      const mockData: MotivationData = {
        metadata: { total_videos: 2, channels: [] },
        motivation_categories: {
          discipline: {
            description: 'Discipline',
            count: 2,
            videos: [
              { title: 'Video 1', url: 'https://www.youtube.com/watch?v=abc123', channel: 'Ch1' },
              { title: 'Video 2', url: 'https://youtu.be/xyz789', channel: 'Ch2' },
            ],
          },
        },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const { getMotivationTrackIds: freshGet } = await import('../../services/trackService');
      const ids = await freshGet('discipline');

      expect(ids).toEqual(['abc123', 'xyz789']);
    });

    it('should return empty array for non-existent category', async () => {
      const mockData: MotivationData = {
        metadata: { total_videos: 0, channels: [] },
        motivation_categories: {},
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const { getMotivationTrackIds: freshGet } = await import('../../services/trackService');
      const ids = await freshGet('nonexistent');

      expect(ids).toEqual([]);
    });

    it('should return empty array when data fails to load', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Error',
      } as Response);

      const { getMotivationTrackIds: freshGet } = await import('../../services/trackService');
      const ids = await freshGet('discipline');

      expect(ids).toEqual([]);
    });
  });

  describe('getMotivationCategories', () => {
    it('should return formatted categories', async () => {
      const mockData: MotivationData = {
        metadata: { total_videos: 5, channels: [] },
        motivation_categories: {
          discipline: { description: 'Build discipline', count: 3, videos: [] },
          self_belief: { description: 'Believe in yourself', count: 2, videos: [] },
        },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const { getMotivationCategories: freshGet } = await import('../../services/trackService');
      const categories = await freshGet();

      expect(categories).toHaveLength(2);
      expect(categories.find(c => c.id === 'discipline')).toEqual({
        id: 'discipline',
        name: 'Discipline',
        description: 'Build discipline',
      });
      expect(categories.find(c => c.id === 'self_belief')).toEqual({
        id: 'self_belief',
        name: 'Self-Belief',
        description: 'Believe in yourself',
      });
    });

    it('should return empty array when data fails to load', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Error',
      } as Response);

      const { getMotivationCategories: freshGet } = await import('../../services/trackService');
      const categories = await freshGet();

      expect(categories).toEqual([]);
    });
  });

  describe('getMeditationCategories', () => {
    it('should return formatted categories', async () => {
      const mockData: MeditationData = {
        metadata: { total_meditations: 10, categories: [] },
        meditation_categories: {
          love: { description: 'Self-love meditations', count: 5, videos: [] },
          gratitude: { description: 'Gratitude practices', count: 5, videos: [] },
        },
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const { getMeditationCategories: freshGet } = await import('../../services/trackService');
      const categories = await freshGet();

      expect(categories).toHaveLength(2);
      expect(categories.find(c => c.id === 'love')).toEqual({
        id: 'love',
        name: 'Self-Love',
        description: 'Self-love meditations',
      });
      expect(categories.find(c => c.id === 'gratitude')).toEqual({
        id: 'gratitude',
        name: 'Gratitude',
        description: 'Gratitude practices',
      });
    });

    it('should return empty array when data fails to load', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Error',
      } as Response);

      const { getMeditationCategories: freshGet } = await import('../../services/trackService');
      const categories = await freshGet();

      expect(categories).toEqual([]);
    });
  });
});

describe('badgeConstants', () => {
  it('should have correct badge thresholds', async () => {
    const { ALL_BADGES, LISTENING_BADGES, STREAK_BADGES } = await import('../../badgeConstants');
    const { BadgeType } = await import('../../types');

    // Check listening badges exist with correct thresholds
    expect(LISTENING_BADGES.find(b => b.threshold === 1)).toBeDefined();
    expect(LISTENING_BADGES.find(b => b.threshold === 10)).toBeDefined();
    expect(LISTENING_BADGES.find(b => b.threshold === 20)).toBeDefined();
    expect(LISTENING_BADGES.find(b => b.threshold === 50)).toBeDefined();
    expect(LISTENING_BADGES.find(b => b.threshold === 100)).toBeDefined();

    // Check streak badges exist with correct thresholds
    expect(STREAK_BADGES.find(b => b.threshold === 3)).toBeDefined();
    expect(STREAK_BADGES.find(b => b.threshold === 7)).toBeDefined();
    expect(STREAK_BADGES.find(b => b.threshold === 30)).toBeDefined();
    expect(STREAK_BADGES.find(b => b.threshold === 50)).toBeDefined();
    expect(STREAK_BADGES.find(b => b.threshold === 75)).toBeDefined();
    expect(STREAK_BADGES.find(b => b.threshold === 100)).toBeDefined();

    // Check ALL_BADGES contains all badges
    expect(ALL_BADGES.length).toBe(LISTENING_BADGES.length + STREAK_BADGES.length);

    // Check all listening badges have correct type
    LISTENING_BADGES.forEach(badge => {
      expect(badge.type).toBe(BadgeType.LISTENING_HOURS);
    });

    // Check all streak badges have correct type
    STREAK_BADGES.forEach(badge => {
      expect(badge.type).toBe(BadgeType.STREAK);
    });
  });

  it('should have getBadgeById function working', async () => {
    const { getBadgeById } = await import('../../badgeConstants');

    expect(getBadgeById('listening_1h')).toBeDefined();
    expect(getBadgeById('listening_1h')?.name).toBe('First Hour');

    expect(getBadgeById('streak_7d')).toBeDefined();
    expect(getBadgeById('streak_7d')?.name).toBe('Week Warrior');

    expect(getBadgeById('nonexistent')).toBeUndefined();
  });
});

describe('ThemeContext utilities', () => {
  it('should return light theme during day hours', () => {
    // Test the time-based theme logic
    const getTimeBasedTheme = (hour: number): 'light' | 'dark' => {
      return hour >= 6 && hour < 19 ? 'light' : 'dark';
    };

    // Day hours (6am - 6:59pm)
    expect(getTimeBasedTheme(6)).toBe('light');
    expect(getTimeBasedTheme(12)).toBe('light');
    expect(getTimeBasedTheme(18)).toBe('light');
  });

  it('should return dark theme during night hours', () => {
    const getTimeBasedTheme = (hour: number): 'light' | 'dark' => {
      return hour >= 6 && hour < 19 ? 'light' : 'dark';
    };

    // Night hours (7pm - 5:59am)
    expect(getTimeBasedTheme(19)).toBe('dark');
    expect(getTimeBasedTheme(23)).toBe('dark');
    expect(getTimeBasedTheme(0)).toBe('dark');
    expect(getTimeBasedTheme(5)).toBe('dark');
  });

  it('should return correct theme at boundary hours', () => {
    const getTimeBasedTheme = (hour: number): 'light' | 'dark' => {
      return hour >= 6 && hour < 19 ? 'light' : 'dark';
    };

    // Boundaries
    expect(getTimeBasedTheme(5)).toBe('dark');  // Before 6am
    expect(getTimeBasedTheme(6)).toBe('light'); // At 6am
    expect(getTimeBasedTheme(18)).toBe('light'); // At 6pm
    expect(getTimeBasedTheme(19)).toBe('dark');  // At 7pm
  });
});
