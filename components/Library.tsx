import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, Heart, MoreVertical, Play } from 'lucide-react';
import { Track, Mode } from '../types';
import { StorageService } from '../services/storageService';
import { loadTracksFromJSON, getAllTracks, getAllMoods, TrackData } from '../services/trackService';
import { ACTIVITIES, MODE_ACCENT } from '../constants';

interface LibraryProps {
  onBack: () => void;
  onPlayTrack: (track: Track, mode: Mode) => void;
}

const Library: React.FC<LibraryProps> = ({ onBack, onPlayTrack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<Mode | 'ALL'>('ALL');
  const [selectedMood, setSelectedMood] = useState<string | 'ALL'>('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [moods, setMoods] = useState<{ id: string; name: string }[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trackData, setTrackData] = useState<TrackData>({});

  useEffect(() => {
    loadTracks();
    loadFavorites();
  }, []);

  const loadTracks = async () => {
    const data = await loadTracksFromJSON();
    setTrackData(data);
    const allTracks = getAllTracks(data);
    setTracks(allTracks);
    
    // Get all unique moods
    const allMoods = getAllMoods(data);
    setMoods(allMoods.map(m => ({ id: m.id, name: m.name })));
  };

  const loadFavorites = () => {
    const favs = StorageService.getFavorites();
    setFavorites(favs);
  };

  const toggleFavorite = (trackId: string) => {
    StorageService.toggleFavorite(trackId);
    loadFavorites();
  };

  // Get activity/mode for a track
  const getTrackMode = (track: Track): Mode | null => {
    // Find which activity this track belongs to
    const entries = Object.entries(trackData) as [string, { tracks: Track[]; moods: { id: string; name: string }[] }][];
    for (const [activityId, activityData] of entries) {
      if (activityData?.tracks?.some(t => t.id === track.id)) {
        const activity = ACTIVITIES.find(a => a.id === activityId);
        return activity?.mode || null;
      }
    }
    return null;
  };

  // Get activity name for a track
  const getTrackActivity = (track: Track): string => {
    const entries = Object.entries(trackData) as [string, { tracks: Track[]; moods: { id: string; name: string }[] }][];
    for (const [activityId, activityData] of entries) {
      if (activityData?.tracks?.some(t => t.id === track.id)) {
        const activity = ACTIVITIES.find(a => a.id === activityId);
        return activity?.name || activityId;
      }
    }
    return 'Unknown';
  };

  // Filter tracks based on search, mode, mood, and favorites
  const filteredTracks = useMemo(() => {
    let filtered = tracks;

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(t => favorites.includes(t.id));
    }

    // Filter by mode
    if (selectedMode !== 'ALL') {
      filtered = filtered.filter(t => {
        const trackMode = getTrackMode(t);
        return trackMode === selectedMode;
      });
    }

    // Filter by mood
    if (selectedMood !== 'ALL') {
      filtered = filtered.filter(t => t.moodId === selectedMood);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(t => {
        const titleMatch = t.title.toLowerCase().includes(query);
        const categoryMatch = t.category?.toLowerCase().includes(query);
        const moodMatch = moods.find(m => m.id === t.moodId)?.name.toLowerCase().includes(query);
        const activityMatch = getTrackActivity(t).toLowerCase().includes(query);
        return titleMatch || categoryMatch || moodMatch || activityMatch;
      });
    }

    return filtered;
  }, [tracks, searchQuery, selectedMode, selectedMood, showFavoritesOnly, favorites, trackData, moods]);

  const modeOptions: (Mode | 'ALL')[] = ['ALL', Mode.FOCUS, Mode.RELAX, Mode.SLEEP, Mode.MEDITATE, Mode.MOTIVATION];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold text-white">Your Library</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tracks, artists, or activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Mode Filter */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Mode:</span>
              <div className="flex gap-2">
                {modeOptions.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedMode === mode
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Filter */}
            {moods.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Mood:</span>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
                >
                  <option value="ALL">All Moods</option>
                  {moods.map((mood) => (
                    <option key={mood.id} value={mood.id}>
                      {mood.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                showFavoritesOnly
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Heart size={16} className={showFavoritesOnly ? 'fill-current' : ''} />
              Favorites
            </button>
          </div>
        </div>

        {/* Tracks List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            {showFavoritesOnly ? 'Favorite Tracks' : 'All Tracks'} ({filteredTracks.length})
          </h2>

          {filteredTracks.length === 0 ? (
            <div className="bg-slate-800/50 rounded-xl p-12 text-center">
              <p className="text-white/60">
                {showFavoritesOnly
                  ? 'No favorite tracks yet. Click the heart icon to favorite tracks.'
                  : 'No tracks found matching your search.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTracks.map((track) => {
                const isFavorite = favorites.includes(track.id);
                const trackMode = getTrackMode(track);
                const activityName = getTrackActivity(track);
                const moodName = moods.find(m => m.id === track.moodId)?.name;

                return (
                  <div
                    key={track.id}
                    className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Album Art Placeholder */}
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                        {track.title.charAt(0).toUpperCase()}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white mb-1 truncate">{track.title}</div>
                        <div className="text-white/60 text-sm mb-2">
                          {track.category && (
                            <span className="uppercase">{track.category}</span>
                          )}
                          {track.category && moodName && ' • '}
                          {moodName && <span>{moodName}</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {trackMode && (
                            <span className={`text-xs px-2 py-1 rounded-full ${MODE_ACCENT[trackMode].replace('text-', 'bg-')} bg-opacity-20`}>
                              {trackMode}
                            </span>
                          )}
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                            {activityName}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const mode = trackMode || Mode.FOCUS;
                            onPlayTrack(track, mode);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Play"
                        >
                          <Play size={18} className="text-white/70" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(track.id)}
                          className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                            isFavorite ? 'text-red-400' : 'text-white/50'
                          }`}
                          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                        </button>
                        <button
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50"
                          title="More options"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;

