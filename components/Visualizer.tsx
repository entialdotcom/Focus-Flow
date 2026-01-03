import React from 'react';
import { Mode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface VisualizerProps {
  mode: Mode;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ mode, isPlaying }) => {
  const { theme } = useTheme();
  
  // Subtle gradients matching the new aesthetic
  const getGradient = () => {
    const isDark = theme === 'dark';
    
    if (isDark) {
      // Dark mode: subtle dark grey gradient
      return {
        primary: 'from-gray-900 via-gray-800 to-gray-900',
        accent: 'from-gray-800/30 via-gray-700/20 to-gray-800/30',
      };
    } else {
      // Light mode: subtle light gradients - pure white
      return {
        primary: 'from-white via-white to-white',
        accent: 'from-gray-50/30 via-gray-100/20 to-gray-50/30',
      };
    }
  };

  const gradients = getGradient();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Solid background - no gradient */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} z-0`}></div>
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_var(--chrome)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
    </div>
  );
};

export default Visualizer;