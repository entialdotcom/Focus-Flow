import React, { useState } from 'react';
import Home from './components/Home';
import Player from './components/Player';
import { AppView, Mode } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.FOCUS);

  const handleModeSelect = (mode: Mode) => {
    setCurrentMode(mode);
    setView(AppView.PLAYER);
  };

  const handleBack = () => {
    setView(AppView.HOME);
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {view === AppView.HOME ? (
        <Home onSelectMode={handleModeSelect} />
      ) : (
        <Player mode={currentMode} onBack={handleBack} />
      )}
    </div>
  );
};

export default App;