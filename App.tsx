import React, { useState } from 'react';
import Home from './components/Home';
import Player from './components/Player';
import ListeningHistory from './components/ListeningHistory';
import Library from './components/Library';
import { AppView, Mode, Track } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.FOCUS);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const handleModeSelect = (mode: Mode) => {
    setCurrentMode(mode);
    setSelectedTrack(null);
    setView(AppView.PLAYER);
  };

  const handleBack = () => {
    setView(AppView.HOME);
    setSelectedTrack(null);
  };

  const handleShowHistory = () => {
    setView(AppView.HISTORY);
  };

  const handleShowLibrary = () => {
    setView(AppView.LIBRARY);
  };

  const handleStartSession = () => {
    setView(AppView.HOME);
  };

  const handlePlayTrack = (track: Track, mode: Mode) => {
    setSelectedTrack(track);
    setCurrentMode(mode);
    setView(AppView.PLAYER);
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {view === AppView.HOME ? (
        <Home onSelectMode={handleModeSelect} onShowHistory={handleShowHistory} onShowLibrary={handleShowLibrary} />
      ) : view === AppView.PLAYER ? (
        <Player mode={currentMode} onBack={handleBack} initialTrack={selectedTrack} />
      ) : view === AppView.LIBRARY ? (
        <Library onBack={handleBack} onPlayTrack={handlePlayTrack} />
      ) : (
        <ListeningHistory onBack={handleBack} onStartSession={handleStartSession} />
      )}
    </div>
  );
};

export default App;