import React from 'react';
import { Mode } from '../types';

interface VisualizerProps {
  mode: Mode;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ mode, isPlaying }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Solid background using brand colors */}
      <div className="absolute inset-0 bg-[var(--bg-primary)] z-0"></div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_var(--chrome)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
    </div>
  );
};

export default Visualizer;