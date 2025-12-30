import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Share2,
  Maximize2,
  ChevronDown,
  Check,
  Zap,
  BookOpen,
  Coffee,
  Brain,
  Sliders,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { Mode, Activity, TimerMode, Quote, TrackInfo, MixerState, Badge } from '../types';
import { ACTIVITIES, MOCK_TRACKS, MODE_ACCENT, ACTIVITY_TRACKS, AMBIENT_SOUNDS } from '../constants';
import { fetchQuote } from '../services/geminiService';
import { AudioService } from '../services/audioService';
import { StorageService } from '../services/storageService';
import Visualizer from './Visualizer';
import TimerModal from './TimerModal';
import MixerPanel from './MixerPanel';
import AmbientTrack from './AmbientTrack';
import { BadgeCelebration } from './BadgeCelebration';
import { BadgeGallery } from './BadgeGallery';

interface PlayerProps {
  mode: Mode;
  initialActivityId?: string;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const Player: React.FC<PlayerProps> = ({ mode, initialActivityId, onBack }) => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity>(
    ACTIVITIES.find(a => a.id === initialActivityId) || ACTIVITIES.find(a => a.mode === mode) || ACTIVITIES[0]
  );
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  
  // Time Tracking
  const [elapsed, setElapsed] = useState(0); // For Infinite Mode
  const [timeLeft, setTimeLeft] = useState(0); // For Timer/Pomodoro
  const [isBreak, setIsBreak] = useState(false); // For Pomodoro
  
  const [volume, setVolume] = useState(80);
  const [streak, setStreak] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mixer State
  const [showMixer, setShowMixer] = useState(false);
  const [mixerState, setMixerState] = useState<MixerState>({});

  // Ref to track total session time even across play/pauses before unmount
  const sessionTimeRef = useRef(0);

  // Timer Settings State
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.INFINITE);
  const [quotesEnabled, setQuotesEnabled] = useState(false);

  // AI Quote State
  const [quote, setQuote] = useState<Quote | null>(null);

  // Badge State
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [showBadgeGallery, setShowBadgeGallery] = useState(false);
  const [badgeQueue, setBadgeQueue] = useState<Badge[]>([]);

  // Track Info
  const trackInfo: TrackInfo = MOCK_TRACKS[mode];

  // Icons mapping for activities
  const getActivityIcon = (id: string) => {
    switch(id) {
      case 'deep-work': return <Brain size={18} />;
      case 'creative': return <Zap size={18} />;
      case 'learning': return <BookOpen size={18} />;
      case 'light-work': return <Coffee size={18} />;
      default: return <Brain size={18} />;
    }
  };

  // Helper to pick a track
  const pickTrack = (activityId: string) => {
    const tracks = ACTIVITY_TRACKS[activityId] || ACTIVITY_TRACKS['deep-work'];
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    return randomTrack;
  };

  // Initialize Audio and Stats
  useEffect(() => {
    AudioService.init('youtube-player');

    // Load streak
    const profile = StorageService.getProfile();
    setStreak(profile.currentStreak);

    // Check for pending badges from previous session
    const pendingBadgesStr = sessionStorage.getItem('pendingBadges');
    if (pendingBadgesStr) {
      try {
        const pendingBadges = JSON.parse(pendingBadgesStr) as Badge[];
        if (pendingBadges.length > 0) {
          setBadgeQueue(pendingBadges);
          sessionStorage.removeItem('pendingBadges');
        }
      } catch (e) {
        console.error('Failed to parse pending badges', e);
      }
    }

    // Initialize mixer state with defaults if empty
    if (Object.keys(mixerState).length === 0) {
      const initialMixerState: MixerState = {};
      AMBIENT_SOUNDS.forEach(sound => {
        initialMixerState[sound.id] = { active: false, volume: sound.defaultVolume };
      });
      setMixerState(initialMixerState);
    }

    // Clean up player and log session when component unmounts
    return () => {
      AudioService.cleanup();

      // Log session if played for more than 10 seconds
      if (sessionTimeRef.current > 10) {
        const updatedProfile = StorageService.logSession(sessionTimeRef.current / 60);

        // Check for new badges
        const newBadges = StorageService.checkNewBadges(updatedProfile);
        if (newBadges.length > 0) {
          // Store badges for next session (since we're unmounting)
          sessionStorage.setItem('pendingBadges', JSON.stringify(newBadges));

          // Unlock all new badges
          newBadges.forEach(badge => StorageService.unlockBadge(badge.id));
        }

        // Update streak display
        setStreak(updatedProfile.currentStreak);
      }
    };
  }, []);

  // Handle Activity Change (and initial load)
  useEffect(() => {
     const trackId = pickTrack(currentActivity.id);
     AudioService.loadTrack(trackId);
     
     if (quotesEnabled) {
       setQuote(null);
       fetchQuote(currentActivity.name).then(setQuote);
     }
  }, [currentActivity, quotesEnabled]);

  // Handle Play/Pause & Timer Logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        // Track stats regardless of mode
        sessionTimeRef.current += 1;

        // Check for milestone badges every 10 seconds
        if (sessionTimeRef.current % 10 === 0) {
          const currentProfile = StorageService.getProfile();
          // Simulate updated profile with current session time
          const tempProfile = {
            ...currentProfile,
            totalMinutes: currentProfile.totalMinutes + (sessionTimeRef.current / 60)
          };
          const newBadges = StorageService.checkNewBadges(tempProfile);
          if (newBadges.length > 0 && badgeQueue.length === 0 && !celebrationBadge) {
            setBadgeQueue(newBadges);
          }
        }

        if (timerMode === TimerMode.INFINITE) {
          setElapsed(prev => prev + 1);
        } else {
          // Countdown Logic (Timer & Pomodoro)
          setTimeLeft(prev => {
            if (prev <= 1) {
               // Timer finished logic
               if (timerMode === TimerMode.INTERVALS) {
                 // Switch phases for Pomodoro
                 const nextIsBreak = !isBreak;
                 setIsBreak(nextIsBreak);
                 // 5 min break or 25 min work
                 return nextIsBreak ? 5 * 60 : 25 * 60;
               } else {
                 // Standard Timer finished
                 setIsPlaying(false);
                 return 0;
               }
            }
            return prev - 1;
          });
        }
      }, 1000);
      AudioService.play();
    } else {
      AudioService.pause();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timerMode, isBreak, badgeQueue, celebrationBadge]);

  // Handle Volume
  useEffect(() => {
    AudioService.setVolume(volume);
  }, [volume]);

  // Handle badge queue - show celebrations one at a time
  useEffect(() => {
    if (badgeQueue.length > 0 && !celebrationBadge) {
      const [nextBadge, ...remaining] = badgeQueue;
      setCelebrationBadge(nextBadge);
      setBadgeQueue(remaining);
    }
  }, [badgeQueue, celebrationBadge]);

  const handleBadgeCelebrationClose = () => {
    if (celebrationBadge) {
      // Unlock the badge
      StorageService.unlockBadge(celebrationBadge.id);
      setCelebrationBadge(null);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = () => {
    const trackId = pickTrack(currentActivity.id);
    AudioService.loadTrack(trackId);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const availableActivities = ACTIVITIES.filter(a => a.mode === mode);

  return (
    <div className="relative w-full h-full flex flex-col text-white overflow-hidden bg-slate-900">
      
      {/* Hidden YouTube Player Container for Main Track */}
      <div id="youtube-player" className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none -z-50" />

      {/* Render Ambient Tracks (Hidden) */}
      {AMBIENT_SOUNDS.map(sound => {
        const state = mixerState[sound.id];
        if (!state) return null;
        
        // Only play if global play is on AND individual sound is active
        const shouldPlaySound = isPlaying && state.active;
        
        return (
          <AmbientTrack 
            key={sound.id}
            id={sound.id}
            videoId={sound.videoId}
            isPlaying={shouldPlaySound}
            volume={state.volume}
          />
        );
      })}

      {/* Background Visuals */}
      <Visualizer mode={mode} isPlaying={isPlaying} />

      {/* --- Top Bar --- */}
      <div className="relative z-20 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {/* Activity Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowActivityMenu(!showActivityMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md transition-all border border-white/5"
            >
              {getActivityIcon(currentActivity.id)}
              <span className="font-medium">{currentActivity.name}</span>
              <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
            </button>

            {/* Dropdown Menu */}
            {showActivityMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e24] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Activities</div>
                {availableActivities.map(act => (
                  <button
                    key={act.id}
                    onClick={() => {
                      setCurrentActivity(act);
                      setShowActivityMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-white/5 rounded-lg group text-left"
                  >
                    <div className="flex items-center gap-3">
                       <span className={currentActivity.id === act.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}>
                         {getActivityIcon(act.id)}
                       </span>
                       <span className={currentActivity.id === act.id ? 'text-white font-medium' : 'text-gray-400 group-hover:text-white'}>
                         {act.name}
                       </span>
                    </div>
                    {currentActivity.id === act.id && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button
             onClick={() => setShowBadgeGallery(true)}
             className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
             title="Badges"
           >
             <Trophy className="w-6 h-6" />
           </button>
           <button
             onClick={() => setShowTimerSettings(true)}
             className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
           >
             <Settings className="w-6 h-6" />
             {quotesEnabled && <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></span>}
           </button>
           <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <Maximize2 className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* --- Center Content (Timer / Visuals / Quotes) --- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        
        {/* Ambient Mixer Panel Overlay */}
        <MixerPanel 
           isOpen={showMixer}
           onClose={() => setShowMixer(false)}
           mixerState={mixerState}
           setMixerState={setMixerState}
        />

        {quotesEnabled ? (
          <div className="max-w-2xl text-center animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-6 tracking-wide drop-shadow-2xl">
              "{quote?.text || "Generating insight..."}"
            </h2>
            <p className="text-lg text-white/60 font-medium">— {quote?.author || "AI"}</p>
          </div>
        ) : (
          <div className="text-center">
             <div className="text-8xl font-thin tracking-tighter opacity-90 drop-shadow-2xl font-mono">
                {timerMode === TimerMode.INFINITE 
                  ? formatTime(elapsed) 
                  : formatTime(timeLeft)
                }
             </div>
             
             {/* Subtext under Timer */}
             <p className="text-white/50 mt-4 tracking-widest uppercase text-sm font-semibold flex items-center justify-center gap-2">
               {timerMode === TimerMode.INTERVALS 
                 ? (isBreak ? <><Coffee size={14} /> BREAK TIME</> : <><Zap size={14} /> FOCUS TIME</>)
                 : `${mode} SESSION`
               }
             </p>
          </div>
        )}
      </div>

      {/* --- Bottom Controls --- */}
      <div className="relative z-20 px-8 pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Track Info */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-white/10 rounded-md overflow-hidden relative group cursor-pointer">
                  {/* Mock Album Art */}
                   <div className={`absolute inset-0 bg-gradient-to-br ${MODE_ACCENT[mode].replace('text-', 'bg-')} opacity-50`}></div>
                   <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">BF</div>
                </div>
                <div>
                   <h3 className="font-bold text-lg leading-none">{trackInfo.title}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/60 uppercase tracking-wider">{trackInfo.genre}</span>
                      <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                      <span className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full">{trackInfo.effect}</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4 text-white/50">
               {/* Share Button with Feedback */}
               <button 
                 onClick={handleShare} 
                 className={`transition-colors flex items-center gap-1 ${copiedLink ? 'text-green-400' : 'hover:text-white'}`}
               >
                 {copiedLink ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
               </button>
               
               {/* Ambient Mixer Toggle */}
               <button 
                 onClick={() => setShowMixer(!showMixer)}
                 className={`transition-all duration-300 ${showMixer ? 'text-white' : 'hover:text-white'}`}
                 title="Ambient Mixer"
               >
                 <Sliders size={18} />
               </button>
             </div>
          </div>

          {/* Center: Play Controls */}
          <div className="flex items-center gap-8 w-full md:w-1/3 justify-center">
             <button onClick={handleSkip} className="text-white/50 hover:text-white transition-colors"><SkipBack className="w-8 h-8" /></button>
             <button 
               onClick={togglePlay}
               className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
             >
               {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
             </button>
             <button onClick={handleSkip} className="text-white/50 hover:text-white transition-colors"><SkipForward className="w-8 h-8" /></button>
          </div>

          {/* Right: Volume & Streak */}
          <div className="flex flex-col items-end w-full md:w-1/3 gap-2">
             <div className="flex items-center gap-2 text-white/70">
                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-wider">{streak > 0 ? `${streak} day streak` : 'Start a streak'}</span>
             </div>
             <div className="flex items-center gap-3 group w-full max-w-[160px]">
                <Volume2 size={18} className="text-white/70" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                />
             </div>
          </div>

        </div>
      </div>

      <TimerModal
        isOpen={showTimerSettings}
        onClose={() => setShowTimerSettings(false)}
        timerMode={timerMode}
        setTimerMode={setTimerMode}
        setDuration={(seconds) => {
          setTimeLeft(seconds);
          setIsBreak(false); // Reset break status when timer manually set
        }}
        quotesEnabled={quotesEnabled}
        setQuotesEnabled={setQuotesEnabled}
      />

      {/* Badge Celebration Modal */}
      {celebrationBadge && (
        <BadgeCelebration
          badge={celebrationBadge}
          onClose={handleBadgeCelebrationClose}
        />
      )}

      {/* Badge Gallery Modal */}
      <BadgeGallery
        isOpen={showBadgeGallery}
        onClose={() => setShowBadgeGallery(false)}
      />

    </div>
  );
};

export default Player;