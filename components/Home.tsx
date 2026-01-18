import React, { useState, useEffect } from 'react';
import { Mode, FavoriteTrack } from '../types';
import { Brain, Coffee, Moon, Wind, UserCircle, Zap, Sun, Moon as MoonIcon, Headphones, Trophy } from 'lucide-react';
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
      mode: Mode.SUCCESS,
      icon: <Trophy className="w-12 h-12" />,
      label: 'Success',
      desc: 'Hip-hop anthems for winners',
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col transition-colors overflow-y-auto">
      {/* Header Bar */}
      <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-50 transition-colors">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-md shadow-[var(--accent)]/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
              FOCUS<span className="text-[var(--accent)]">MODE</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-primary)] transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-primary)] transition-colors"
            >
              <UserCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-4 md:mb-6">
          <p className="text-[var(--text-secondary)] text-sm md:text-base font-light">
            {userName ? `Welcome back, ${userName}` : 'Music for people who want to focus and get sh*t done.'}
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 auto-rows-fr" style={{ minHeight: 'min(calc(80vh - 180px), 600px)' }}>
          {/* Focus - Featured large tile */}
          <button
            onClick={() => onSelectMode(Mode.FOCUS)}
            className="btn-mechanical group relative col-span-2 lg:col-span-1 lg:row-span-2 rounded-xl p-5 md:p-8 flex flex-col justify-between items-start text-left overflow-hidden transition-all duration-300 hover:border-[var(--accent)] min-h-[160px] md:min-h-0"
          >
            <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 blur-xl"></div>
            <div className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300 group-hover:scale-110 relative z-10">
              <Brain className="w-10 h-10 md:w-16 md:h-16" />
            </div>
            <div className="w-full relative z-10">
              <h2 className="text-xl md:text-3xl font-semibold text-[var(--text-primary)] mb-1 md:mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">Focus</h2>
              <p className="text-sm md:text-base text-[var(--text-secondary)] font-light">Deep work, creativity & studying</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Other modes - smaller tiles */}
          {cards.slice(1).map((card) => (
            <button
              key={card.mode}
              onClick={() => onSelectMode(card.mode)}
              className="btn-mechanical group relative rounded-xl p-4 md:p-6 flex flex-col justify-between items-start text-left overflow-hidden transition-all duration-300 hover:border-[var(--accent)] min-h-[140px] md:min-h-0"
            >
              <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 blur-xl"></div>
              <div className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300 group-hover:scale-110 relative z-10">
                {React.cloneElement(card.icon, { className: 'w-8 h-8 md:w-10 md:h-10' })}
              </div>
              <div className="w-full relative z-10">
                <h2 className="text-base md:text-xl font-medium text-[var(--text-primary)] mb-0.5 group-hover:text-[var(--accent)] transition-colors duration-300">{card.label}</h2>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light line-clamp-2">{card.desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 flex justify-center z-10">
        <a
          href="https://ential.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          ❤️ Made with Love + Code by Ential
        </a>
      </footer>

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