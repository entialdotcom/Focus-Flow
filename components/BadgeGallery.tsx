import React, { useState, useEffect } from 'react';
import { X, Trophy, Zap } from 'lucide-react';
import { Badge, BadgeType, UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { ALL_BADGES } from '../badgeConstants';

interface BadgeGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<UserProfile>();
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [lockedBadges, setLockedBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (isOpen) {
      const currentProfile = StorageService.getProfile();
      setProfile(currentProfile);
      setUnlockedBadges(StorageService.getUnlockedBadges(currentProfile));
      setLockedBadges(StorageService.getLockedBadges(currentProfile));
    }
  }, [isOpen]);

  if (!isOpen || !profile) return null;

  const totalHours = Math.floor(profile.totalMinutes / 60);

  const getProgressToNextBadge = (badge: Badge): number => {
    if (badge.type === BadgeType.LISTENING_HOURS) {
      return Math.min((totalHours / badge.threshold) * 100, 100);
    } else {
      return Math.min((profile.currentStreak / badge.threshold) * 100, 100);
    }
  };

  const BadgeCard: React.FC<{ badge: Badge; unlocked: boolean }> = ({ badge, unlocked }) => {
    const progress = getProgressToNextBadge(badge);

    return (
      <div
        className={`relative group rounded-2xl p-6 transition-all duration-300 ${
          unlocked
            ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500/30 hover:border-purple-400/50'
            : 'bg-gray-800/30 border-2 border-gray-700/30 hover:border-gray-600/50'
        }`}
      >
        {/* Badge icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-20 h-20 flex items-center justify-center rounded-full transition-all duration-300 ${
              unlocked
                ? 'bg-white/10 border-2 border-white/20 group-hover:scale-110'
                : 'bg-gray-800/50 border-2 border-gray-700/30 grayscale opacity-40'
            }`}
          >
            <span className={`text-4xl ${unlocked ? 'animate-pulse' : ''}`}>{badge.icon}</span>
          </div>
        </div>

        {/* Badge info */}
        <div className="text-center space-y-2">
          <h3 className={`font-semibold text-lg ${unlocked ? 'text-white' : 'text-gray-500'}`}>
            {badge.name}
          </h3>
          <p className={`text-sm ${unlocked ? 'text-white/70' : 'text-gray-600'}`}>
            {badge.description}
          </p>

          {/* Badge requirement */}
          <div className={`flex items-center justify-center gap-2 text-xs mt-3 ${unlocked ? 'text-purple-300' : 'text-gray-500'}`}>
            {badge.type === BadgeType.LISTENING_HOURS ? (
              <>
                <Trophy className="w-4 h-4" />
                <span>{badge.threshold} {badge.threshold === 1 ? 'Hour' : 'Hours'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>{badge.threshold} Day Streak</span>
              </>
            )}
          </div>

          {/* Progress bar for locked badges */}
          {!unlocked && (
            <div className="mt-4 space-y-1">
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {badge.type === BadgeType.LISTENING_HOURS
                  ? `${totalHours} / ${badge.threshold} hours`
                  : `${profile.currentStreak} / ${badge.threshold} days`}
              </p>
            </div>
          )}

          {/* Unlocked indicator */}
          {unlocked && (
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
              <span className="text-xs font-medium text-purple-300">✓ Unlocked</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-w-5xl w-full max-h-[90vh] mx-4 bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-8 h-8 text-purple-400" />
                Badge Gallery
              </h2>
              <p className="text-white/60 mt-1">
                {unlockedBadges.length} of {ALL_BADGES.length} badges earned
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white/80" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Total Listening</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalHours} hours</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile.currentStreak} days</p>
            </div>
          </div>
        </div>

        {/* Badge grid */}
        <div className="overflow-y-auto p-6 flex-1">
          {/* Unlocked badges */}
          {unlockedBadges.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-green-400">✓</span> Unlocked Badges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} unlocked={true} />
                ))}
              </div>
            </div>
          )}

          {/* Locked badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white/60 mb-4 flex items-center gap-2">
                <span className="text-gray-600">🔒</span> Locked Badges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} unlocked={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
