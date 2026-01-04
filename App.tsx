import React, { useState } from 'react';
import Home from './components/Home';
import Player from './components/Player';
import { AppView, Mode, FavoriteTrack } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.FOCUS);
  const [favoritePlayback, setFavoritePlayback] = useState<FavoriteTrack | null>(null);

  const handleModeSelect = (mode: Mode) => {
    setCurrentMode(mode);
    setFavoritePlayback(null); // Clear any favorite playback
    setView(AppView.PLAYER);
  };

  const handlePlayFavorite = (track: FavoriteTrack) => {
    setFavoritePlayback(track);
    // Use the stored mode, or default to MOTIVATION if not set
    setCurrentMode(track.mode || Mode.MOTIVATION);
    setView(AppView.PLAYER);
  };

  const handleBack = () => {
    setView(AppView.HOME);
    setFavoritePlayback(null);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-x-hidden transition-colors">
      {view === AppView.HOME ? (
        <Home onSelectMode={handleModeSelect} onPlayFavorite={handlePlayFavorite} />
      ) : (
        <Player 
          key={favoritePlayback?.videoId || 'default'}
          mode={currentMode} 
          onBack={handleBack} 
          initialActivityId={favoritePlayback?.activityId}
          initialVideoId={favoritePlayback?.videoId}
          initialTitle={favoritePlayback?.title}
        />
      )}
    </div>
  );
};

export default App;
