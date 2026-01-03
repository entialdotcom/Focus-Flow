import React from 'react';
import { AMBIENT_SOUNDS } from '../constants';
import { CloudRain, Coffee, Bird, Waves, Wind, Trees, X } from 'lucide-react';
import { MixerState } from '../types';

interface MixerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mixerState: MixerState;
  setMixerState: (state: MixerState) => void;
}

const MixerPanel: React.FC<MixerPanelProps> = ({ isOpen, onClose, mixerState, setMixerState }) => {
  if (!isOpen) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'rain': return <CloudRain size={20} />;
      case 'cafe': return <Coffee size={20} />;
      case 'birds': return <Bird size={20} />;
      case 'ocean': return <Waves size={20} />;
      case 'wind': return <Wind size={20} />;
      case 'rainforest': return <Trees size={20} />;
      default: return <Wind size={20} />;
    }
  };

  const toggleSound = (id: string) => {
    const current = mixerState[id] || { active: false, volume: 30 };
    setMixerState({
      ...mixerState,
      [id]: { ...current, active: !current.active }
    });
  };

  const updateVolume = (id: string, vol: number) => {
    const current = mixerState[id] || { active: false, volume: 30 };
    setMixerState({
      ...mixerState,
      [id]: { ...current, volume: vol, active: true } // Auto activate on volume change
    });
  };

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-[#1e1e24]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white tracking-wider uppercase text-sm">Ambient Mixer</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-6">
        {AMBIENT_SOUNDS.map((sound) => {
          const state = mixerState[sound.id] || { active: false, volume: sound.defaultVolume };
          
          return (
            <div key={sound.id} className="flex items-center gap-4">
              <button 
                onClick={() => toggleSound(sound.id)}
                className={`p-2 rounded-full transition-all duration-300 ${state.active ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                title={state.active ? `Turn off ${sound.name}` : `Turn on ${sound.name}`}
              >
                {getIcon(sound.id)}
              </button>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium transition-colors ${state.active ? 'text-white' : 'text-gray-500'}`}>{sound.name}</span>
                  {state.active && <span className="text-xs text-white/50">{state.volume}%</span>}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.volume}
                  onChange={(e) => updateVolume(sound.id, Number(e.target.value))}
                  className={`w-full h-1 rounded-lg appearance-none cursor-pointer transition-all ${state.active ? 'bg-white/20' : 'bg-white/5'} [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all ${state.active ? '[&::-webkit-slider-thumb]:bg-white' : '[&::-webkit-slider-thumb]:bg-gray-600'}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MixerPanel;