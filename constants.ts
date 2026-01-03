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

  { id: 'motivation-discipline', name: 'Discipline', description: 'Self-control, focus & consistency', mode: Mode.MOTIVATION },
  { id: 'motivation-perseverance', name: 'Perseverance', description: 'Never quit & push through', mode: Mode.MOTIVATION },
  { id: 'motivation-success', name: 'Success', description: 'Win & achieve your goals', mode: Mode.MOTIVATION },
  { id: 'motivation-self_belief', name: 'Self-Belief', description: 'Confidence & inner strength', mode: Mode.MOTIVATION },
  { id: 'motivation-action', name: 'Action', description: 'Execute & get it done', mode: Mode.MOTIVATION },
  { id: 'motivation-mindset', name: 'Mindset', description: 'Mental psychology & perspective', mode: Mode.MOTIVATION },
  { id: 'motivation-inspiration', name: 'Inspiration', description: 'Powerful speeches & stories', mode: Mode.MOTIVATION },
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

  // Motivation tracks are loaded dynamically from JSON
  // These are fallback tracks in case JSON fails to load
  'motivation-discipline': ['77BiKDbWMO4', '42tRnwjglN0', 'vPc8hO2806A'],
  'motivation-perseverance': ['oIKe8d1ixTY', 'J9Fb6QMRZaA', 'kwwNxyJSj8I'],
  'motivation-success': ['XeDNJ9vmBcc', 'vH1Dj4_JKVU', 'vY8vbkegtNs'],
  'motivation-self_belief': ['EJthNc2z9Dk', 'DtHiwLeOF-c', '1i-Gz0UQ53M'],
  'motivation-action': ['gHD-Oh5qbkM', 'Z1JmzJwnjC0', 'HV-PsU3qqQg'],
  'motivation-mindset': ['0YNLQASyM-8', '5I4YkUGzlvc', 'tvzPmizTRk8'],
  'motivation-inspiration': ['WfIUHHI7xls', 'lTVG1K6bo0I', '8PXG6CmdUlk'],
};

// Track titles mapped by video ID
export const TRACK_TITLES: Record<string, string> = {
  // Deep Work
  'F5lPywAN5cw': 'Interstellar Soundtrack',
  'TpBnbLT3Ki0': 'Blade Runner 2049 Ambience',
  'MYW0TgV67RE': 'Oppenheimer Score',
  // Creativity
  'VKI605D0apc': 'Inception Dreams',
  'dUqdlL_k6x8': 'Tron Legacy Soundtrack',
  // Light Work
  '_4kHxtiuML0': 'The Social Network Score',
  '_Q8Ih2SW-TE': 'Theory of Everything',
  // Learning
  'jfKfPfyJRdk': 'Lofi Girl Radio',
  '5qap5aO4i9A': 'Study Beats',
  // Chill
  'ot5UsNymqgQ': 'Chillhop Essentials',
  'IuzD5J87QFc': 'Calm Vibes',
  '6h-sEV6uNxo': 'Evening Unwind',
  // Recharge
  '8xkTdJ0svis': 'Quick Reset',
  'Lju6h-C37hE': 'Energy Restore',
  // Reading
  'HPyu0PGqGkU': 'Library Ambience',
  'BklGhQYKl30': 'Rainy Day Reading',
  // Deep Sleep
  'rA7m3iKpuko': 'Deep Sleep Waves',
  'HZJQiDXIIgI': 'Sleep Rain Sounds',
  'BPFbmMVdJRE': 'Night Sky Ambience',
  // Guided Sleep
  '69o0P7s8GHE': 'Guided Sleep Journey',
  'U6Ay9v7gK9w': 'Peaceful Sleep Meditation',
  // Meditate
  'ODPUPv9hJ5c': 'Theta Wave Meditation',
};

export const MOCK_TRACKS: Record<Mode, TrackInfo> = {
  [Mode.FOCUS]: { title: 'Neural Flow', genre: 'Cinematic Focus', effect: 'Deep Concentration' },
  [Mode.RELAX]: { title: 'Ambient Drift', genre: 'Down Tempo', effect: 'Alpha Waves' },
  [Mode.SLEEP]: { title: 'Nightfall', genre: 'Atmospheric', effect: 'Delta Waves' },
  [Mode.MEDITATE]: { title: 'Presence', genre: 'Drone', effect: 'Theta Isochronic' },
  [Mode.MOTIVATION]: { title: 'Rise Up', genre: 'Epic Orchestral', effect: 'Peak Energy' },
};

// Colors for gradients
export const MODE_COLORS: Record<Mode, string> = {
  [Mode.FOCUS]: 'from-fuchsia-600 to-purple-900',
  [Mode.RELAX]: 'from-blue-500 to-indigo-900',
  [Mode.SLEEP]: 'from-indigo-900 to-slate-900',
  [Mode.MEDITATE]: 'from-teal-500 to-emerald-900',
  [Mode.MOTIVATION]: 'from-orange-500 to-red-900',
};

export const MODE_ACCENT: Record<Mode, string> = {
  [Mode.FOCUS]: 'text-fuchsia-400',
  [Mode.RELAX]: 'text-blue-400',
  [Mode.SLEEP]: 'text-indigo-400',
  [Mode.MEDITATE]: 'text-teal-400',
  [Mode.MOTIVATION]: 'text-orange-400',
};

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Rain', videoId: 'eTeD8DAta4c', defaultVolume: 30 },
  { id: 'cafe', name: 'Café', videoId: 'h2zkV-l_TbY', defaultVolume: 20 },
  { id: 'birds', name: 'Birdsong', videoId: 'rYoZgpAEkFs', defaultVolume: 20 },
  { id: 'ocean', name: 'Ocean Waves', videoId: 'bn9F19Hi1Lk', defaultVolume: 30 },
  { id: 'wind', name: 'Wind', videoId: 'sGkh1W5cbH4', defaultVolume: 25 },
  { id: 'rainforest', name: 'Rainforest', videoId: 'ubNfkpbxXUs', defaultVolume: 30 },
];