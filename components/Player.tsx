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
  Target,
  Trophy,
  Heart,
  Flame,
  Sparkles,
  Star
} from 'lucide-react';
import { Mode, Activity, TimerMode, Quote, TrackInfo, MixerState, FavoriteTrack } from '../types';
import { ACTIVITIES, MOCK_TRACKS, MODE_ACCENT, ACTIVITY_TRACKS, AMBIENT_SOUNDS, TRACK_TITLES } from '../constants';
import { fetchQuote } from '../services/geminiService';
import { AudioService } from '../services/audioService';
import { StorageService } from '../services/storageService';
import { getRandomMotivationTrack, getRandomMeditationTrack, getMeditationCategories } from '../services/trackService';
import Visualizer from './Visualizer';
import TimerModal from './TimerModal';
import MixerPanel from './MixerPanel';
import AmbientTrack from './AmbientTrack';

interface PlayerProps {
  mode: Mode;
  initialActivityId?: string;
  initialVideoId?: string;
  initialTitle?: string;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const Player: React.FC<PlayerProps> = ({ mode, initialActivityId, initialVideoId, initialTitle, onBack }) => {
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

  // Current track info (for motivation tracks loaded from JSON)
  // Initialize from props if playing a favorite
  const [currentTrackTitle, setCurrentTrackTitle] = useState<string | null>(initialTitle || null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(initialVideoId || null);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Flag to track if we're playing a favorite (don't load random track)
  const playingFavorite = useRef(!!initialVideoId);
  
  // Meditation mood selection
  const [meditationMoods, setMeditationMoods] = useState<{ id: string; name: string; description: string }[]>([]);
  const [selectedMeditationMood, setSelectedMeditationMood] = useState<string | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  
  // Load meditation moods when in guided meditation mode
  useEffect(() => {
    if (currentActivity.id === 'meditate-guided') {
      getMeditationCategories().then(categories => {
        setMeditationMoods(categories);
        // Show mood selector if no mood selected yet
        if (!selectedMeditationMood && !playingFavorite.current) {
          setShowMoodSelector(true);
        }
      });
    } else {
      setShowMoodSelector(false);
    }
  }, [currentActivity.id]);

  // Track Info - use dynamic title for motivation mode if available
  const trackInfo: TrackInfo = currentTrackTitle 
    ? { ...MOCK_TRACKS[mode], title: currentTrackTitle }
    : MOCK_TRACKS[mode];

  // Check favorite status when video changes
  useEffect(() => {
    if (currentVideoId) {
      setIsFavorited(StorageService.isFavorite(currentVideoId));
    }
  }, [currentVideoId]);

  // Toggle favorite
  const handleToggleFavorite = () => {
    if (!currentVideoId) return;
    
    const track: FavoriteTrack = {
      videoId: currentVideoId,
      title: trackInfo.title,
      category: currentActivity.name,
      activityId: currentActivity.id,
      mode: mode,
      addedAt: new Date().toISOString(),
    };
    
    const nowFavorited = StorageService.toggleFavorite(track);
    setIsFavorited(nowFavorited);
  };

  // Icons mapping for activities
  const getActivityIcon = (id: string) => {
    switch(id) {
      case 'deep-work': return <Brain size={18} />;
      case 'creative': return <Zap size={18} />;
      case 'learning': return <BookOpen size={18} />;
      case 'light-work': return <Coffee size={18} />;
      // Motivation activities
      case 'motivation-discipline': return <Target size={18} />;
      case 'motivation-perseverance': return <Flame size={18} />;
      case 'motivation-success': return <Trophy size={18} />;
      case 'motivation-self_belief': return <Heart size={18} />;
      case 'motivation-action': return <Zap size={18} />;
      case 'motivation-mindset': return <Brain size={18} />;
      case 'motivation-inspiration': return <Star size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  // Helper to pick a track (async for motivation/meditation tracks from JSON)
  const pickTrack = async (activityId: string, meditationMood?: string): Promise<string> => {
    // Check if this is a motivation category that should load from JSON
    if (activityId.startsWith('motivation-')) {
      const category = activityId.replace('motivation-', '');
      const track = await getRandomMotivationTrack(category);
      if (track) {
        setCurrentTrackTitle(track.title);
        setCurrentVideoId(track.videoId);
        return track.videoId;
      }
    }
    
    // Check if this is guided meditation with a mood selected
    if (activityId === 'meditate-guided' && meditationMood) {
      const track = await getRandomMeditationTrack(meditationMood);
      if (track) {
        setCurrentTrackTitle(track.title);
        setCurrentVideoId(track.videoId);
        return track.videoId;
      }
    }
    
    // Fallback to hardcoded tracks
    const tracks = ACTIVITY_TRACKS[activityId] || ACTIVITY_TRACKS['deep-work'];
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    
    // Set title from TRACK_TITLES or use a default
    const trackTitle = TRACK_TITLES[randomTrack] || `${currentActivity.name} Track`;
    setCurrentTrackTitle(trackTitle);
    setCurrentVideoId(randomTrack);
    return randomTrack;
  };
  
  // Handle meditation mood selection
  const handleSelectMeditationMood = async (moodId: string) => {
    setSelectedMeditationMood(moodId);
    setShowMoodSelector(false);
    const trackId = await pickTrack(currentActivity.id, moodId);
    // Continue playing if already playing
    AudioService.loadTrack(trackId, isPlaying);
  };

  // Initialize Audio and Stats
  useEffect(() => {
    AudioService.init('youtube-player');
    
    // Load streak
    const profile = StorageService.getProfile();
    setStreak(profile.currentStreak);

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
        StorageService.logSession(sessionTimeRef.current / 60);
      }
    };
  }, []);

  // Load initial track on mount
  useEffect(() => {
    const loadInitialTrack = async () => {
      // If we have a favourite to play, load that specific track
      if (playingFavorite.current && initialVideoId) {
        AudioService.loadTrack(initialVideoId);
      } else {
        // Otherwise load a random track for the activity
        const trackId = await pickTrack(currentActivity.id);
        AudioService.loadTrack(trackId);
      }
    };
    loadInitialTrack();
  }, []); // Only run on mount

  // Handle Activity Change (user manually changes activity)
  const activityChangeCount = useRef(0);
  useEffect(() => {
    // Skip the first render (handled by mount effect above)
    if (activityChangeCount.current === 0) {
      activityChangeCount.current = 1;
      return;
    }
    
    // User changed activity, so we're no longer playing the favorite
    playingFavorite.current = false;
    
    const loadTrack = async () => {
      const trackId = await pickTrack(currentActivity.id);
      AudioService.loadTrack(trackId);
    };
    loadTrack();
  }, [currentActivity]);
  
  // Handle quotes separately
  useEffect(() => {
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
  }, [isPlaying, timerMode, isBreak]);

  // Handle Volume
  useEffect(() => {
    AudioService.setVolume(volume);
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = async () => {
    const trackId = await pickTrack(currentActivity.id, selectedMeditationMood || undefined);
    // Pass isPlaying to continue playback if already playing
    AudioService.loadTrack(trackId, isPlaying);
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

      {/* Meditation Mood Selector Modal */}
      {showMoodSelector && currentActivity.id === 'meditate-guided' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 shadow-2xl mx-4">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Choose Your Focus</h2>
            <p className="text-white/50 text-center mb-6">Select a theme for your guided meditation</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {meditationMoods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleSelectMeditationMood(mood.id)}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/50 rounded-xl transition-all text-left group"
                >
                  <div className="font-medium text-white group-hover:text-teal-400 transition-colors">{mood.name}</div>
                  <div className="text-xs text-white/40 mt-1 line-clamp-2">{mood.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Bottom Controls --- */}
      <div className="relative z-20 px-6 pb-6 pt-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Track Info */}
          <div className="flex items-center gap-3 w-full md:w-1/3">
            <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden relative flex-shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${MODE_ACCENT[mode].replace('text-', 'bg-')} opacity-50`}></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">BW</div>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base leading-tight truncate">{trackInfo.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/50">{trackInfo.genre}</span>
                {selectedMeditationMood && currentActivity.id === 'meditate-guided' && (
                  <>
                    <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                    <button 
                      onClick={() => setShowMoodSelector(true)}
                      className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      {meditationMoods.find(m => m.id === selectedMeditationMood)?.name || 'Change mood'}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Streak indicator */}
            {streak > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 text-white/70 ml-2 bg-white/5 px-2.5 py-1 rounded-full flex-shrink-0">
                <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium">{streak} days</span>
              </div>
            )}
          </div>

          {/* Centre: Play Controls + Volume */}
          <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSkip} 
                className="text-white/50 hover:text-white transition-colors p-1"
                title="Previous track"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
              <button 
                onClick={handleSkip} 
                className="text-white/50 hover:text-white transition-colors p-1"
                title="Next track"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2 w-full max-w-[200px]">
              <Volume2 size={16} className="text-white/50 flex-shrink-0" />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                title="Volume"
              />
              <span className="text-xs text-white/40 w-7 text-right">{volume}%</span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-1/3 justify-center md:justify-end">
            {/* Save to Favourites Button */}
            <button 
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 ${
                isFavorited 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title={isFavorited ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart size={18} className={isFavorited ? 'fill-current' : ''} />
              <span className="text-sm font-medium">{isFavorited ? 'Saved' : 'Save'}</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={handleShare} 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 ${
                copiedLink 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title={copiedLink ? 'Link copied!' : 'Share this track'}
            >
              {copiedLink ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
              <span className="text-sm font-medium">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
            
            {/* Ambient Mixer Button */}
            <button 
              onClick={() => setShowMixer(!showMixer)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 ${
                showMixer 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
              title="Open ambient sound mixer"
            >
              <Sliders size={18} />
              <span className="text-sm font-medium">Mixer</span>
            </button>
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

    </div>
  );
};

export default Player;