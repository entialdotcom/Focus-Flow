import React from 'react';
import { Mode } from '../types';

interface VisualizerProps {
  mode: Mode;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ mode, isPlaying }) => {
  // Determine colors based on mode
  const getGradient = () => {
    switch (mode) {
      case Mode.FOCUS: return 'bg-fuchsia-600';
      case Mode.RELAX: return 'bg-blue-600';
      case Mode.SLEEP: return 'bg-indigo-900';
      case Mode.MEDITATE: return 'bg-teal-600';
      default: return 'bg-fuchsia-600';
    }
  };

  const baseColor = getGradient();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background base */}
      <div className="absolute inset-0 bg-slate-900 opacity-90 z-0"></div>
      
      {/* Animated Blobs */}
      <div className={`absolute top-0 left-[-10%] w-[70vw] h-[70vw] ${baseColor} rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob`}></div>
      <div className={`absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000`}></div>
      <div className={`absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-pink-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000`}></div>
      
      {/* Overlay Mesh/Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      
      {/* Play state pulsing overlay */}
      {isPlaying && (
         <div className={`absolute inset-0 bg-black opacity-0 animate-pulse`} style={{ animationDuration: '4s' }}></div>
      )}
    </div>
  );
};

export default Visualizer;