import React from 'react';
import { Badge } from '../types';

interface BadgeCelebrationProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeCelebration: React.FC<BadgeCelebrationProps> = ({ badge, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              backgroundColor: ['#ff6b9d', '#c084fc', '#60a5fa', '#34d399', '#fbbf24'][i % 5],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Badge card */}
      <div
        className="relative max-w-md w-full mx-4 bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-3xl border-2 border-white/20 p-8 shadow-2xl backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl animate-pulse" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Badge icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-ping" />
            <div className="relative w-32 h-32 flex items-center justify-center bg-white/10 rounded-full border-4 border-white/30 animate-scale-in">
              <span className="text-7xl animate-bounce-slow">{badge.icon}</span>
            </div>
          </div>

          {/* Badge details */}
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white animate-slide-up">
              Congratulations!
            </h2>
            <h3 className="text-2xl font-semibold text-purple-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {badge.name}
            </h3>
            <p className="text-lg text-white/80 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {badge.description}
            </p>
          </div>

          {/* Badge type indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <span className="text-sm font-medium text-white/90">
              {badge.type === 'LISTENING_HOURS' ? `${badge.threshold} ${badge.threshold === 1 ? 'Hour' : 'Hours'}` : `${badge.threshold} Day Streak`}
            </span>
          </div>

          {/* Call to action */}
          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-200 shadow-lg animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            CLAIM MY BADGE
          </button>
        </div>

        {/* Sparkles */}
        <div className="absolute top-4 right-4 text-2xl animate-spin-slow">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl animate-spin-slow" style={{ animationDelay: '1s' }}>✨</div>
      </div>
    </div>
  );
};
