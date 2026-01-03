// Track Service - Loads tracks from JSON files

export interface MotivationVideo {
  title: string;
  url: string;
  channel: string;
}

export interface MeditationVideo {
  title: string;
  url: string;
}

export interface MotivationCategory {
  description: string;
  count: number;
  videos: MotivationVideo[];
}

export interface MeditationCategory {
  description: string;
  count: number;
  videos: MeditationVideo[];
}

export interface MotivationData {
  metadata: {
    total_videos: number;
    channels: string[];
  };
  motivation_categories: Record<string, MotivationCategory>;
}

export interface MeditationData {
  metadata: {
    total_meditations: number;
    categories: string[];
  };
  meditation_categories: Record<string, MeditationCategory>;
}

// Extract YouTube video ID from various URL formats
export function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  
  // Clean the URL - remove query params after the video ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s?#]+)/,
    /(?:youtu\.be\/)([^&\s?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\s?#]+)/,
    /(?:youtube\.com\/v\/)([^&\s?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return url;
}

// Cache for loaded data
let motivationDataCache: MotivationData | null = null;
let meditationDataCache: MeditationData | null = null;

// Load motivation videos from JSON
export async function loadMotivationVideos(): Promise<MotivationData | null> {
  if (motivationDataCache) {
    return motivationDataCache;
  }
  
  try {
    const response = await fetch('/json/motivation_videos_categorized.json');
    if (!response.ok) {
      console.error('Failed to load motivation videos:', response.statusText);
      return null;
    }
    
    const data: MotivationData = await response.json();
    motivationDataCache = data;
    return data;
  } catch (error) {
    console.error('Error loading motivation videos:', error);
    return null;
  }
}

// Load guided meditations from JSON
export async function loadGuidedMeditations(): Promise<MeditationData | null> {
  if (meditationDataCache) {
    return meditationDataCache;
  }
  
  try {
    const response = await fetch('/json/guided_meditations.json');
    if (!response.ok) {
      console.error('Failed to load guided meditations:', response.statusText);
      return null;
    }
    
    const data: MeditationData = await response.json();
    meditationDataCache = data;
    return data;
  } catch (error) {
    console.error('Error loading guided meditations:', error);
    return null;
  }
}

// Get video IDs for a specific motivation category
export async function getMotivationTrackIds(category: string): Promise<string[]> {
  const data = await loadMotivationVideos();
  if (!data || !data.motivation_categories[category]) {
    return [];
  }
  
  return data.motivation_categories[category].videos.map(video => 
    extractYouTubeVideoId(video.url)
  );
}

// Get all motivation categories with their descriptions
export async function getMotivationCategories(): Promise<{ id: string; name: string; description: string }[]> {
  const data = await loadMotivationVideos();
  if (!data) return [];
  
  const categoryNames: Record<string, string> = {
    discipline: 'Discipline',
    perseverance: 'Perseverance',
    success: 'Success',
    self_belief: 'Self-Belief',
    action: 'Action',
    mindset: 'Mindset',
    personal_growth: 'Growth',
    inspiration: 'Inspiration',
  };
  
  return Object.entries(data.motivation_categories).map(([id, cat]) => ({
    id,
    name: categoryNames[id] || id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: cat.description,
  }));
}

// Get all meditation categories with their descriptions
export async function getMeditationCategories(): Promise<{ id: string; name: string; description: string }[]> {
  const data = await loadGuidedMeditations();
  if (!data) return [];
  
  const categoryNames: Record<string, string> = {
    love: 'Self-Love',
    gratitude: 'Gratitude',
    peace: 'Inner Peace',
    happiness: 'Happiness',
    abundance: 'Abundance',
    wealth_success: 'Success',
    sleep: 'Sleep',
    joy: 'Joy',
    reduce_anxiety_calm: 'Calm & Anxiety Relief',
  };
  
  return Object.entries(data.meditation_categories).map(([id, cat]) => ({
    id,
    name: categoryNames[id] || id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: cat.description,
  }));
}

// Get a random track from a motivation category
export async function getRandomMotivationTrack(category: string): Promise<{ videoId: string; title: string } | null> {
  const data = await loadMotivationVideos();
  if (!data || !data.motivation_categories[category]) {
    return null;
  }
  
  const videos = data.motivation_categories[category].videos;
  if (videos.length === 0) return null;
  
  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  return {
    videoId: extractYouTubeVideoId(randomVideo.url),
    title: randomVideo.title,
  };
}

// Get a random track from a meditation category
export async function getRandomMeditationTrack(category: string): Promise<{ videoId: string; title: string } | null> {
  const data = await loadGuidedMeditations();
  if (!data || !data.meditation_categories[category]) {
    return null;
  }
  
  const videos = data.meditation_categories[category].videos;
  if (videos.length === 0) return null;
  
  const randomVideo = videos[Math.floor(Math.random() * videos.length)];
  return {
    videoId: extractYouTubeVideoId(randomVideo.url),
    title: randomVideo.title,
  };
}

