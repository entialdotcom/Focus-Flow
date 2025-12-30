import React from 'react';
import { TimerMode } from '../types';
import { Infinity, Timer, Hourglass } from 'lucide-react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  setDuration: (seconds: number) => void;
  quotesEnabled: boolean;
  setQuotesEnabled: (enabled: boolean) => void;
}

const TimerModal: React.FC<TimerModalProps> = ({ 
  isOpen, 
  onClose, 
  timerMode, 
  setTimerMode,
  setDuration,
  quotesEnabled,
  setQuotesEnabled
}) => {
  if (!isOpen) return null;

  const presets = [5, 10, 15, 30, 45, 60, 75, 90];

  const handlePresetClick = (minutes: number) => {
    setTimerMode(TimerMode.TIMER);
    setDuration(minutes * 60);
    onClose();
  };

  const handlePomodoroClick = () => {
    setTimerMode(TimerMode.INTERVALS);
    setDuration(25 * 60); // Default start with 25 min work
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-xl border border-white/10 p-6 shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-center text-xl font-bold text-white mb-8">Timer Settings</h2>

        {/* Mode Selectors */}
        <div className="flex bg-white/5 rounded-lg p-1 mb-8">
          <button 
            className={`flex-1 flex flex-col items-center py-4 rounded-md transition-all ${timerMode === TimerMode.INFINITE ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setTimerMode(TimerMode.INFINITE)}
          >
            <Infinity className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold tracking-wider">INFINITE</span>
          </button>
          
          <button 
            className={`flex-1 flex flex-col items-center py-4 rounded-md transition-all ${timerMode === TimerMode.TIMER ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setTimerMode(TimerMode.TIMER)}
          >
            <Timer className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold tracking-wider">TIMER</span>
          </button>

          <button 
            className={`flex-1 flex flex-col items-center py-4 rounded-md transition-all ${timerMode === TimerMode.INTERVALS ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setTimerMode(TimerMode.INTERVALS)}
          >
            <Hourglass className="w-6 h-6 mb-2" />
            <span className="text-xs font-bold tracking-wider">POMODORO</span>
          </button>
        </div>

        {/* Dynamic Content Based on Mode */}
        <div className="mb-10">
          
          {timerMode === TimerMode.INFINITE && (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Infinite Play</h3>
              <p className="text-gray-400 text-sm">Listen to tracks freely without any time restrictions.</p>
            </div>
          )}

          {timerMode === TimerMode.TIMER && (
             <div className="animate-fade-in">
                <h3 className="text-center text-lg font-bold mb-4">Select Duration (Minutes)</h3>
                <div className="grid grid-cols-4 gap-3">
                  {presets.map(min => (
                    <button
                      key={min}
                      onClick={() => handlePresetClick(min)}
                      className="py-2 px-1 bg-white/5 hover:bg-white/20 rounded-lg border border-white/5 text-sm font-medium transition-colors"
                    >
                      {min}m
                    </button>
                  ))}
                </div>
             </div>
          )}

          {timerMode === TimerMode.INTERVALS && (
            <div className="text-center animate-fade-in">
               <h3 className="text-2xl font-bold mb-2">Pomodoro Technique</h3>
               <p className="text-gray-400 text-sm mb-6">25 minutes focus, 5 minutes break.</p>
               <button 
                 onClick={handlePomodoroClick}
                 className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
               >
                 Start Session
               </button>
            </div>
          )}

        </div>

        {/* Toggle Quotes */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div>
            <div className="text-white font-medium">Activate Quotes</div>
            <div className="text-gray-400 text-sm">Quotes replace the timer display.</div>
          </div>
          <button 
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${quotesEnabled ? 'bg-white' : 'bg-gray-600'}`}
            onClick={() => setQuotesEnabled(!quotesEnabled)}
          >
            <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${quotesEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;