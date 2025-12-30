import React, { useState, useEffect } from 'react';
import { X, User, Trophy, Calendar, Clock, Activity } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh parent data
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    if (isOpen) {
      const p = StorageService.getProfile();
      setProfile(p);
      setTempName(p.name);
      setIsEditing(!p.name); // Auto edit if no name
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

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
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
      </div>
    </div>
  );
};

export default ProfileModal;