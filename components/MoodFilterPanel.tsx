import React, { useMemo } from 'react';
import { X, Play, Clock } from 'lucide-react';
import { Mood, Track } from '../types';

interface MoodFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  moods: Mood[];
  tracks: Track[];
  selectedMoodId?: string;
  selectedTrackId?: string;
  onSelectMood: (moodId: string | undefined) => void;
  onSelectTrack: (track: Track) => void;
}

const MoodFilterPanel: React.FC<MoodFilterPanelProps> = ({
  isOpen,
  onClose,
  moods,
  tracks,
  selectedMoodId,
  selectedTrackId,
  onSelectMood,
  onSelectTrack,
}) => {
  // Filter tracks by selected mood
  const filteredTracks = useMemo(() => {
    if (!selectedMoodId) {
      return [];
    }
    const filtered = tracks.filter(t => t.moodId === selectedMoodId);
    return filtered;
  }, [tracks, selectedMoodId]);

  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Note: To get actual durations, you would need to:
  // 1. Use YouTube Data API v3 with an API key
  // 2. Or load each video in a hidden player and get duration from onReady event
  // For now, showing placeholder. Duration can be fetched and cached later.
  const getTrackDuration = (track: Track): number | undefined => {
    // Placeholder - in production, fetch from YouTube Data API or cache
    return undefined;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#1e1e24]/95 backdrop-blur-xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 animate-slide-in-right overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white tracking-wider uppercase text-sm">Filter by Mood</h3>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Clear Filter Button */}
          <button
            onClick={() => onSelectMood(undefined)}
            className={`w-full mb-4 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !selectedMoodId
                ? 'bg-white text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            All Moods
          </button>

          {/* Moods List */}
          <div className="space-y-2 mb-6">
            {moods.length === 0 ? (
              <p className="text-white/50 text-sm text-center py-8">
                No moods available for this activity
              </p>
            ) : (
              moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => onSelectMood(mood.id === selectedMoodId ? undefined : mood.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedMoodId === mood.id
                      ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{mood.name}</div>
                  {mood.description && (
                    <div className={`text-xs ${selectedMoodId === mood.id ? 'text-black/70' : 'text-white/50'}`}>
                      {mood.description}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Tracks List - Show when mood is selected */}
          {selectedMoodId && filteredTracks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                Tracks ({filteredTracks.length})
              </h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredTracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => onSelectTrack(track)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all group ${
                      selectedTrackId === track.id
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1 line-clamp-2">{track.title}</div>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <Clock size={12} />
                          <span>{formatDuration(getTrackDuration(track))}</span>
                        </div>
                      </div>
                      <div className={`flex-shrink-0 ${selectedTrackId === track.id ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>
                        <Play size={16} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedMoodId && filteredTracks.length === 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/50 text-sm text-center py-8">
                No tracks available for this mood
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default MoodFilterPanel;

