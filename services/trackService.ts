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

export interface FocusVideo {
  title: string;
  url: string;
  views: string;
  published: string;
}

export interface FocusData {
  channel: {
    name: string;
    handle: string;
  };
  videos: FocusVideo[];
}

export interface SuccessTrack {
  song_title: string;
  artist: string;
  youtube_url: string;
  video_title: string;
}

export interface SuccessPlaylistItem {
  input: string;
  output: SuccessTrack;
  error: string;
}

export interface SuccessPlaylistData {
  results: SuccessPlaylistItem[];
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
let focusDataCache: FocusData | null = null;
let successPlaylistCache: SuccessPlaylistData | null = null;

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

// Load focus tracks from Founder FM JSON
export async function loadFocusTracks(): Promise<FocusData | null> {
  if (focusDataCache) {
    return focusDataCache;
  }
  
  try {
    const response = await fetch('/json/founder_fm_videos.json');
    if (!response.ok) {
      console.error('Failed to load focus tracks:', response.statusText);
      return null;
    }
    
    const data: FocusData = await response.json();
    focusDataCache = data;
    return data;
  } catch (error) {
    console.error('Error loading focus tracks:', error);
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

// Get a random focus track from Founder FM
export async function getRandomFocusTrack(): Promise<{ videoId: string; title: string } | null> {
  const data = await loadFocusTracks();
  if (!data || !data.videos || data.videos.length === 0) {
    return null;
  }

  const randomVideo = data.videos[Math.floor(Math.random() * data.videos.length)];
  return {
    videoId: extractYouTubeVideoId(randomVideo.url),
    title: randomVideo.title,
  };
}

// Load success playlist from JSON
export async function loadSuccessPlaylist(): Promise<SuccessPlaylistData | null> {
  if (successPlaylistCache) {
    return successPlaylistCache;
  }

  try {
    const response = await fetch('/json/success_playlist.json');
    if (!response.ok) {
      console.error('Failed to load success playlist:', response.statusText);
      return null;
    }

    const data: SuccessPlaylistData = await response.json();
    successPlaylistCache = data;
    return data;
  } catch (error) {
    console.error('Error loading success playlist:', error);
    return null;
  }
}

// Get a random track from the success playlist
export async function getRandomSuccessTrack(): Promise<{ videoId: string; title: string } | null> {
  const data = await loadSuccessPlaylist();
  if (!data || !data.results || data.results.length === 0) {
    return null;
  }

  // Filter out any items with errors
  const validTracks = data.results.filter(item => !item.error && item.output?.youtube_url);
  if (validTracks.length === 0) return null;

  const randomItem = validTracks[Math.floor(Math.random() * validTracks.length)];
  const track = randomItem.output;

  return {
    videoId: extractYouTubeVideoId(track.youtube_url),
    title: `${track.song_title} - ${track.artist}`,
  };
}

