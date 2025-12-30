import { Badge, BadgeType } from './types';

export const LISTENING_BADGES: Badge[] = [
  {
    id: 'listening_1h',
    type: BadgeType.LISTENING_HOURS,
    name: 'First Hour',
    description: 'Completed your first hour of focused listening',
    threshold: 1,
    icon: '🎧'
  },
  {
    id: 'listening_10h',
    type: BadgeType.LISTENING_HOURS,
    name: '10 Hours In',
    description: 'Accumulated 10 hours of focused time',
    threshold: 10,
    icon: '⚡'
  },
  {
    id: 'listening_20h',
    type: BadgeType.LISTENING_HOURS,
    name: 'Rising Star',
    description: 'Reached 20 hours of dedication',
    threshold: 20,
    icon: '⭐'
  },
  {
    id: 'listening_50h',
    type: BadgeType.LISTENING_HOURS,
    name: 'Focus Master',
    description: 'Achieved 50 hours of deep work',
    threshold: 50,
    icon: '🏆'
  },
  {
    id: 'listening_100h',
    type: BadgeType.LISTENING_HOURS,
    name: 'Century Club',
    description: '100 hours of focused excellence',
    threshold: 100,
    icon: '🚀'
  }
];

export const STREAK_BADGES: Badge[] = [
  {
    id: 'streak_3d',
    type: BadgeType.STREAK,
    name: '3-Day Streak',
    description: 'Maintained focus for 3 consecutive days',
    threshold: 3,
    icon: '🔥'
  },
  {
    id: 'streak_7d',
    type: BadgeType.STREAK,
    name: 'Week Warrior',
    description: 'Completed a full 7-day streak',
    threshold: 7,
    icon: '💪'
  },
  {
    id: 'streak_30d',
    type: BadgeType.STREAK,
    name: 'Monthly Master',
    description: '30 consecutive days of consistency',
    threshold: 30,
    icon: '🌟'
  },
  {
    id: 'streak_50d',
    type: BadgeType.STREAK,
    name: 'Streak Legend',
    description: '50-day commitment champion',
    threshold: 50,
    icon: '💎'
  },
  {
    id: 'streak_75d',
    type: BadgeType.STREAK,
    name: 'Diamond Streak',
    description: '75 days of unwavering dedication',
    threshold: 75,
    icon: '👑'
  },
  {
    id: 'streak_100d',
    type: BadgeType.STREAK,
    name: 'Centurion',
    description: '100-day streak - Elite status achieved',
    threshold: 100,
    icon: '🏅'
  }
];

export const ALL_BADGES: Badge[] = [...LISTENING_BADGES, ...STREAK_BADGES];

export const getBadgeById = (id: string): Badge | undefined => {
  return ALL_BADGES.find(badge => badge.id === id);
};
