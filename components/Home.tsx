import React, { useState, useEffect } from 'react';
import { Mode, FavoriteTrack } from '../types';
import { Brain, Coffee, Moon, Wind, UserCircle, Zap } from 'lucide-react';
import { StorageService } from '../services/storageService';
import ProfileModal from './ProfileModal';

interface HomeProps {
  onSelectMode: (mode: Mode) => void;
  onPlayFavorite?: (track: FavoriteTrack) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectMode, onPlayFavorite }) => {
  const [userName, setUserName] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const loadProfile = () => {
    const profile = StorageService.getProfile();
    setUserName(profile.name);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const cards = [
    { 
      mode: Mode.FOCUS, 
      icon: <Brain className="w-16 h-16 text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, 
      label: 'Focus', 
      desc: 'Deep work, creativity & studying',
      gradient: 'from-[#2a0e35] to-[#4a1068] hover:to-[#6a1b9a] border-fuchsia-500/30'
    },
    { 
      mode: Mode.RELAX, 
      icon: <Coffee className="w-16 h-16 text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, 
      label: 'Relax', 
      desc: 'Unwind & recharge',
      gradient: 'from-[#0f172a] to-[#1e3a8a] hover:to-[#2563eb] border-blue-500/30'
    },
    { 
      mode: Mode.SLEEP, 
      icon: <Moon className="w-16 h-16 text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, 
      label: 'Sleep', 
      desc: 'Drift off & rest deeply',
      gradient: 'from-[#020617] to-[#1e1b4b] hover:to-[#312e81] border-indigo-500/30'
    },
    { 
      mode: Mode.MEDITATE, 
      icon: <Wind className="w-16 h-16 text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, 
      label: 'Meditate', 
      desc: 'Guided & unguided mindfulness',
      gradient: 'from-[#042f2e] to-[#0f766e] hover:to-[#0d9488] border-teal-500/30'
    },
    { 
      mode: Mode.MOTIVATION, 
      icon: <Zap className="w-16 h-16 text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />, 
      label: 'Motivation', 
      desc: 'Energise your drive & ambition',
      gradient: 'from-[#7c2d12] to-[#c2410c] hover:to-[#ea580c] border-orange-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8 relative">
      {/* Profile Button */}
      <button 
        onClick={() => setIsProfileOpen(true)}
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors z-20"
      >
        <UserCircle className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      <div className="max-w-7xl w-full">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Welcome back{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-gray-400 mb-8">Choose your mental state.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {cards.map((card) => (
            <button
              key={card.mode}
              onClick={() => onSelectMode(card.mode)}
              className={`relative group h-64 md:h-80 rounded-3xl p-8 flex flex-col justify-end items-start text-left bg-gradient-to-br ${card.gradient} border border-transparent hover:border-white/20 transition-all duration-300 transform hover:scale-[1.01] shadow-2xl overflow-hidden`}
            >
              {/* Illustrative Background Blob */}
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>

              {/* Icon Container */}
              <div className="absolute top-8 right-8 transform group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">{card.label}</h2>
                <p className="text-white/60 font-medium">{card.desc}</p>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onUpdate={loadProfile}
        onPlayTrack={onPlayFavorite}
      />
    </div>
  );
};

export default Home;