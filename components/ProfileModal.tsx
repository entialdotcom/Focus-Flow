import React, { useState, useEffect } from 'react';
import { X, User, Trophy, Calendar, Clock, Activity, Heart, Play, Trash2 } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserProfile, FavoriteTrack } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh parent data
  onPlayTrack?: (track: FavoriteTrack) => void; // Optional callback to play a track
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onUpdate, onPlayTrack }) => {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [favorites, setFavorites] = useState<FavoriteTrack[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'favorites'>('stats');

  useEffect(() => {
    if (isOpen) {
      const p = StorageService.getProfile();
      setProfile(p);
      setTempName(p.name);
      setIsEditing(!p.name); // Auto edit if no name
      setFavorites(StorageService.getFavorites());
    }
  }, [isOpen]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      StorageService.updateName(tempName.trim());
      setProfile({ ...profile, name: tempName.trim() });
      setIsEditing(false);
      onUpdate();
    }
  };

  const handleRemoveFavorite = (videoId: string) => {
    StorageService.removeFavorite(videoId);
    setFavorites(StorageService.getFavorites());
  };

  const handlePlayFavorite = (track: FavoriteTrack) => {
    if (onPlayTrack) {
      onPlayTrack(track);
      onClose();
    }
  };

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatAddedDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-white/10">
            <User size={40} className="text-white" />
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSaveName} className="flex flex-col items-center gap-2 w-full max-w-[240px]">
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-center text-white focus:outline-none focus:border-purple-500 transition-colors"
                autoFocus
              />
              <button 
                type="submit"
                className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditing(true)}>
              <h2 className="text-2xl font-bold text-white">{profile.name || 'Anonymous User'}</h2>
              <span className="text-xs text-white/30 group-hover:text-white/70 transition-colors">(edit)</span>
            </div>
          )}
          <p className="text-white/40 text-sm mt-1">Member since {formatDate(profile.memberSince)}</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stats' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'favorites' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Heart size={14} className={activeTab === 'favorites' ? 'fill-current' : ''} />
            Favourites ({favorites.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'stats' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors border border-white/5">
                <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{profile.currentStreak}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Day Streak</div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors border border-white/5">
                <Activity className="w-6 h-6 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{profile.totalSessions}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Total Sessions</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors border border-white/5 col-span-2">
                <Clock className="w-6 h-6 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{Math.floor(profile.totalMinutes)}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Minutes Focused</div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart size={40} className="mx-auto text-white/20 mb-3" />
                  <p className="text-white/50 text-sm">No favourites yet</p>
                  <p className="text-white/30 text-xs mt-1">Tap the Save button whilst playing a track to save it here</p>
                </div>
              ) : (
                favorites.map((track) => (
                  <div 
                    key={track.videoId}
                    className="bg-white/5 rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors border border-white/5 group"
                  >
                    {/* Play button */}
                    <button
                      onClick={() => handlePlayFavorite(track)}
                      className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition-all flex-shrink-0"
                    >
                      <Play size={16} className="ml-0.5" fill="currentColor" />
                    </button>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{track.title}</h4>
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        {track.category && <span>{track.category}</span>}
                        {track.category && <span>•</span>}
                        <span>Added {formatAddedDate(track.addedAt)}</span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveFavorite(track.videoId)}
                      className="p-2 text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from favourites"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
