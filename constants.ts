import { Activity, Mode, TrackInfo, AmbientSound } from './types';

export const ACTIVITIES: Activity[] = [
  { id: 'deep-work', name: 'Deep Work', description: 'Intense focus for demanding tasks', mode: Mode.FOCUS },
  { id: 'creative', name: 'Creativity', description: 'Fluid thinking and idea generation', mode: Mode.FOCUS },
  { id: 'light-work', name: 'Light Work', description: 'Email, admin, and simple tasks', mode: Mode.FOCUS },
  { id: 'learning', name: 'Learning', description: 'Absorbing new information', mode: Mode.FOCUS },
  
  { id: 'chill', name: 'Chill', description: 'Unwind after work', mode: Mode.RELAX },
  { id: 'recharge', name: 'Recharge', description: 'Quick break to reset', mode: Mode.RELAX },
  { id: 'reading', name: 'Reading', description: 'Immersive reading environment', mode: Mode.RELAX },

  { id: 'sleep-deep', name: 'Deep Sleep', description: 'Fall asleep faster', mode: Mode.SLEEP },
  { id: 'sleep-guided', name: 'Guided Sleep', description: 'Voice guided relaxation', mode: Mode.SLEEP },

  { id: 'meditate-guided', name: 'Guided', description: 'Guided mindfulness', mode: Mode.MEDITATE },
  { id: 'meditate-un', name: 'Unguided', description: 'Open monitoring meditation', mode: Mode.MEDITATE },
];

// YouTube Video IDs for each activity
export const ACTIVITY_TRACKS: Record<string, string[]> = {
  // Deep Work: Interstellar, Blade Runner 2049, Oppenheimer
  'deep-work': ['F5lPywAN5cw', 'TpBnbLT3Ki0', 'MYW0TgV67RE'],
  // Creativity: Inception, Tron Legacy
  'creative': ['VKI605D0apc', 'dUqdlL_k6x8'],
  // Light Work: Social Network, Theory of Everything
  'light-work': ['_4kHxtiuML0', '_Q8Ih2SW-TE'],
  // Learning: Study Beats
  'learning': ['jfKfPfyJRdk', '5qap5aO4i9A'],
  
  // Relax: Chill
  'chill': ['ot5UsNymqgQ', 'IuzD5J87QFc', '6h-sEV6uNxo'],
  // Relax: Recharge
  'recharge': ['8xkTdJ0svis', 'Lju6h-C37hE'],
  // Relax: Reading
  'reading': ['HPyu0PGqGkU', 'BklGhQYKl30'],

  // Sleep: Deep Sleep / Rain
  'sleep-deep': ['rA7m3iKpuko', 'HZJQiDXIIgI', 'BPFbmMVdJRE'],
  // Sleep: Guided
  'sleep-guided': ['69o0P7s8GHE', 'U6Ay9v7gK9w'],

  // Meditate: Frequency / Drone
  'meditate-guided': ['ODPUPv9hJ5c'],
  'meditate-un': ['ODPUPv9hJ5c'],
};

export const MOCK_TRACKS: Record<Mode, TrackInfo> = {
  [Mode.FOCUS]: { title: 'Neural Flow', genre: 'Cinematic Focus', effect: 'Deep Concentration' },
  [Mode.RELAX]: { title: 'Ambient Drift', genre: 'Down Tempo', effect: 'Alpha Waves' },
  [Mode.SLEEP]: { title: 'Nightfall', genre: 'Atmospheric', effect: 'Delta Waves' },
  [Mode.MEDITATE]: { title: 'Presence', genre: 'Drone', effect: 'Theta Isochronic' },
};

// Colors for gradients
export const MODE_COLORS: Record<Mode, string> = {
  [Mode.FOCUS]: 'from-fuchsia-600 to-purple-900',
  [Mode.RELAX]: 'from-blue-500 to-indigo-900',
  [Mode.SLEEP]: 'from-indigo-900 to-slate-900',
  [Mode.MEDITATE]: 'from-teal-500 to-emerald-900',
};

export const MODE_ACCENT: Record<Mode, string> = {
  [Mode.FOCUS]: 'text-fuchsia-400',
  [Mode.RELAX]: 'text-blue-400',
  [Mode.SLEEP]: 'text-indigo-400',
  [Mode.MEDITATE]: 'text-teal-400',
};

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Rain', videoId: 'eTeD8DAta4c', defaultVolume: 30 },
  { id: 'cafe', name: 'Cafe', videoId: 'h2zkV-l_TbY', defaultVolume: 20 },
  { id: 'birds', name: 'Birds', videoId: 'rYoZgpAEkFs', defaultVolume: 20 },
  { id: 'ocean', name: 'Ocean', videoId: 'bn9F19Hi1Lk', defaultVolume: 30 },
  { id: 'wind', name: 'Wind', videoId: 'sGkh1W5cbH4', defaultVolume: 25 },
  { id: 'rainforest', name: 'Rainforest', videoId: 'ubNfkpbxXUs', defaultVolume: 30 },
];