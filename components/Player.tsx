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
  Filter
} from 'lucide-react';
import { Mode, Activity, TimerMode, Quote, TrackInfo, MixerState, Track, Mood } from '../types';
import { ACTIVITIES, MOCK_TRACKS, MODE_ACCENT, ACTIVITY_TRACKS, AMBIENT_SOUNDS } from '../constants';
import { fetchQuote } from '../services/geminiService';
import { AudioService } from '../services/audioService';
import { StorageService } from '../services/storageService';
import { ListeningSession } from '../types';
import { loadTracksFromJSON, TrackData, getTracksForActivity, getMoodsForActivity } from '../services/trackService';
import Visualizer from './Visualizer';
import TimerModal from './TimerModal';
import MixerPanel from './MixerPanel';
import AmbientTrack from './AmbientTrack';
import MoodFilterPanel from './MoodFilterPanel';

interface PlayerProps {
  mode: Mode;
  initialActivityId?: string;
  initialTrack?: Track | null;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const Player: React.FC<PlayerProps> = ({ mode, initialActivityId, initialTrack, onBack }) => {
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

  // Track Data from JSON
  const [trackData, setTrackData] = useState<TrackData>({});
  const [tracksLoading, setTracksLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [selectedMoodId, setSelectedMoodId] = useState<string | undefined>(undefined);
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>(undefined);
  const [showMoodFilter, setShowMoodFilter] = useState(false);

  // Track Info - use current track if available, otherwise fallback to mock
  const trackInfo: TrackInfo = currentTrack 
    ? { title: currentTrack.title, genre: currentTrack.category || 'Track', effect: 'Playing' }
    : MOCK_TRACKS[mode];

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

  // Helper to pick a track - prioritize JSON tracks, fallback to hardcoded
  const pickTrack = (activityId: string): string => {
    // Try to get tracks from JSON data first
    const jsonTracks = getTracksForActivity(trackData, activityId, selectedMoodId);
    if (jsonTracks.length > 0) {
      const randomTrack = jsonTracks[Math.floor(Math.random() * jsonTracks.length)];
      setCurrentTrack(randomTrack);
      return randomTrack.videoId;
    }
    
    // Fallback to hardcoded tracks
    const tracks = ACTIVITY_TRACKS[activityId];
    if (tracks && tracks.length > 0) {
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      setCurrentTrack(null); // No track info for hardcoded tracks
      return randomTrack;
    }
    
    // Final fallback if no tracks available
    console.warn(`No tracks available for activity: ${activityId}`);
    return '';
  };

  // Load tracks from JSON on mount
  useEffect(() => {
    setTracksLoading(true);
    loadTracksFromJSON()
      .then(data => {
        setTrackData(data);
        setTracksLoading(false);
      })
      .catch(error => {
        console.error('Error loading tracks:', error);
        setTrackData({});
        setTracksLoading(false);
      });
  }, []);

  // Refs to capture current values for cleanup
  const currentActivityRef = useRef(currentActivity);
  const currentTrackRef = useRef(currentTrack);
  const selectedMoodIdRef = useRef(selectedMoodId);
  const modeRef = useRef(mode);
  const trackDataRef = useRef(trackData);

  // Update refs when values change
  useEffect(() => {
    currentActivityRef.current = currentActivity;
    currentTrackRef.current = currentTrack;
    selectedMoodIdRef.current = selectedMoodId;
    modeRef.current = mode;
    trackDataRef.current = trackData;
  }, [currentActivity, currentTrack, selectedMoodId, mode, trackData]);

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
        const minutes = sessionTimeRef.current / 60;
        
        // Log to profile
        StorageService.logSession(minutes);
        
        // Log detailed session to history using refs to get current values
        const availableMoods = getMoodsForActivity(trackDataRef.current, currentActivityRef.current.id);
        const selectedMood = availableMoods.find(m => m.id === selectedMoodIdRef.current);
        
        const session: ListeningSession = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          duration: minutes,
          mode: modeRef.current,
          activityId: currentActivityRef.current.id,
          activityName: currentActivityRef.current.name,
          trackTitle: currentTrackRef.current?.title,
          moodId: selectedMoodIdRef.current,
          moodName: selectedMood?.name,
        };
        
        StorageService.addSession(session);
      }
    };
  }, []);

  // Handle initial track from Library
  useEffect(() => {
    if (initialTrack && Object.keys(trackData).length > 0) {
      setCurrentTrack(initialTrack);
      setSelectedTrackId(initialTrack.id);
      AudioService.loadTrack(initialTrack.videoId);
      // Find the activity for this track
      const entries = Object.entries(trackData) as [string, { tracks: Track[]; moods: Mood[] }][];
      for (const [activityId, activityData] of entries) {
        if (activityData?.tracks?.some(t => t.id === initialTrack.id)) {
          const activity = ACTIVITIES.find(a => a.id === activityId);
          if (activity) {
            setCurrentActivity(activity);
            // Find mood if track has one
            if (initialTrack.moodId) {
              setSelectedMoodId(initialTrack.moodId);
            }
          }
          break;
        }
      }
    }
  }, [initialTrack, trackData]);

  // Handle Activity Change (and initial load) - only reload track when activity/mood changes
  useEffect(() => {
     // Skip if we have an initial track (handled by separate effect)
     if (initialTrack) return;
     
     // Ensure we're paused when loading a new track
     if (isPlaying) {
       setIsPlaying(false);
     }
     
     // Reset mood and track selection when activity changes
     setSelectedMoodId(undefined);
     setSelectedTrackId(undefined);
     
     // Try to load a track (will use fallback if JSON tracks not loaded yet)
     const trackId = pickTrack(currentActivity.id);
     if (trackId) {
       AudioService.loadTrack(trackId);
     }
     // If no track found, that's okay - user can select one from mood filter
  }, [currentActivity, trackData, selectedMoodId, initialTrack]);

  // Handle Quote fetching separately - don't reload track when quotes toggle
  useEffect(() => {
     if (quotesEnabled) {
       setQuote(null);
       fetchQuote(currentActivity.name).then(setQuote);
     } else {
       setQuote(null);
     }
  }, [quotesEnabled, currentActivity]);

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
  const availableMoods = getMoodsForActivity(trackData, currentActivity.id);
  // Get all tracks for the activity (not filtered by mood) - let the panel do the filtering
  const availableTracks = getTracksForActivity(trackData, currentActivity.id);

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

        {/* Mood Filter Panel Overlay */}
        <MoodFilterPanel
          isOpen={showMoodFilter}
          onClose={() => setShowMoodFilter(false)}
          moods={availableMoods}
          tracks={availableTracks}
          selectedMoodId={selectedMoodId}
          selectedTrackId={selectedTrackId}
          onSelectMood={(moodId) => {
            setSelectedMoodId(moodId);
            setSelectedTrackId(undefined); // Clear track selection when mood changes
            // Reload track with new mood filter
            const trackId = pickTrack(currentActivity.id);
            AudioService.loadTrack(trackId);
          }}
          onSelectTrack={(track) => {
            setSelectedTrackId(track.id);
            setCurrentTrack(track);
            // Load and play the selected track
            AudioService.loadTrack(track.videoId);
            // Auto-play when track is selected
            setIsPlaying(true);
          }}
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
               
               {/* Mood Filter Toggle - only show if moods are available */}
               {availableMoods.length > 0 && (
                 <button 
                   onClick={() => setShowMoodFilter(!showMoodFilter)}
                   className={`transition-all duration-300 ${showMoodFilter ? 'text-white' : 'hover:text-white'}`}
                   title="Filter by Mood"
                 >
                   <Filter size={18} />
                 </button>
               )}
               
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

    </div>
  );
};

export default Player;