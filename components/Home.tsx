import React, { useState, useEffect } from 'react';
import { Mode, FavoriteTrack } from '../types';
import { Brain, Coffee, Moon, Wind, UserCircle, Zap, Sun, Moon as MoonIcon } from 'lucide-react';
import { StorageService } from '../services/storageService';
import ProfileModal from './ProfileModal';
import { useTheme } from '../contexts/ThemeContext';

interface HomeProps {
  onSelectMode: (mode: Mode) => void;
  onPlayFavorite?: (track: FavoriteTrack) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectMode, onPlayFavorite }) => {
  const [userName, setUserName] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
      icon: <Brain className="w-12 h-12" />, 
      label: 'Focus', 
      desc: 'Deep work, creativity & studying',
    },
    { 
      mode: Mode.MOTIVATION, 
      icon: <Zap className="w-12 h-12" />, 
      label: 'Motivation', 
      desc: 'Energise your drive & ambition',
    },
    { 
      mode: Mode.RELAX, 
      icon: <Coffee className="w-12 h-12" />, 
      label: 'Relax', 
      desc: 'Unwind & recharge',
    },
    { 
      mode: Mode.MEDITATE, 
      icon: <Wind className="w-12 h-12" />, 
      label: 'Meditate', 
      desc: 'Guided & unguided mindfulness',
    },
    { 
      mode: Mode.SLEEP, 
      icon: <Moon className="w-12 h-12" />, 
      label: 'Sleep', 
      desc: 'Drift off & rest deeply',
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col p-4 md:p-8 relative transition-colors overflow-y-auto">
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 md:top-10 md:right-10 flex items-center gap-2 md:gap-4 z-20">
        <button
          onClick={toggleTheme}
          className="btn-mechanical p-2 rounded-lg text-[var(--text-primary)] hover:opacity-80"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setIsProfileOpen(true)}
          className="btn-mechanical p-2 rounded-lg text-[var(--text-primary)] hover:opacity-80"
        >
          <UserCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col pt-12 md:pt-0 md:justify-center">
        <div className="mb-6 md:mb-12">
          <h1 className="text-3xl md:text-6xl font-light text-[var(--text-primary)] mb-2 md:mb-3 tracking-tight">
            Founder FM
          </h1>
          <p className="text-[var(--text-secondary)] text-sm md:text-lg font-light">
            {userName ? `Welcome back, ${userName}` : 'Music for people who want to focus and get sh*t done.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-16 md:pb-0">
          {cards.map((card) => (
            <button
              key={card.mode}
              onClick={() => onSelectMode(card.mode)}
              className="btn-mechanical group relative h-28 md:h-48 rounded-lg p-3 md:p-6 flex flex-col justify-between items-start text-left overflow-hidden transition-all duration-300 hover:border-[var(--accent)]"
            >
              {/* Orange glow effect on hover */}
              <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 blur-xl"></div>

              <div className="flex items-center justify-start w-full mb-2 md:mb-4 relative z-10">
                <div className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300 group-hover:scale-110">
                  {React.cloneElement(card.icon, { className: 'w-7 h-7 md:w-12 md:h-12' })}
                </div>
              </div>

              <div className="w-full relative z-10">
                <h2 className="text-sm md:text-xl font-medium text-[var(--text-primary)] mb-0.5 md:mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">{card.label}</h2>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light line-clamp-2">{card.desc}</p>
              </div>

              {/* Orange accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 flex justify-center z-10">
        <p className="text-xs text-[var(--text-secondary)] font-light opacity-70">
          Built with love + code by{' '}
          <a
            href="https://ential.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors underline underline-offset-2"
          >
            Ential
          </a>
        </p>
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