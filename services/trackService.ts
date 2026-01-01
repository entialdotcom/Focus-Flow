// Service for loading and managing tracks from JSON files
// Extracts YouTube video IDs and transforms JSON data into track objects

export interface Mood {
  id: string;
  name: string;
  description: string;
}

export interface Track {
  id: string;
  title: string;
  videoId: string;
  moodId?: string;
  category?: string;
  url?: string;
}

export interface TrackData {
  [activityId: string]: {
    tracks: Track[];
    moods: Mood[];
  };
}

/**
 * Maps category IDs to user-friendly mood names (single words or short phrases)
 */
function getMoodName(categoryId: string, type: 'guided' | 'motivation' | 'categorized'): string {
  const moodMap: Record<string, string> = {
    // Guided meditation moods - simple, single words or short phrases
    'love': 'Self-Love',
    'gratitude': 'Gratitude',
    'peace': 'Inner Peace',
    'happiness': 'Happiness',
    'abundance': 'Abundance',
    'wealth_success': 'Wealth',
    'sleep': 'Sleep',
    'joy': 'Joy',
    'reduce_anxiety_calm': 'Anxiety Relief',
    
    // Motivation moods
    'discipline': 'Discipline',
    'perseverance': 'Perseverance',
    'success': 'Success',
    'self_belief': 'Self-Belief',
    'action': 'Action',
    'mindset': 'Mindset',
    'personal_growth': 'Growth',
    'inspiration': 'Inspiration',
    
    // Categorized moods
    'focus': 'Focus',
    'relaxation': 'Relaxation',
    'meditation': 'Meditation',
    'general': 'General',
  };
  
  return moodMap[categoryId] || categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?#]+)/, // Standard URLs
    /youtube\.com\/embed\/([^&\s?#]+)/, // Embed URLs
    /youtube\.com\/v\/([^&\s?#]+)/, // Direct video URLs
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If no match, assume the URL itself might be a video ID (unlikely but handle it)
  return url;
}

/**
 * Loads and parses guided meditations JSON
 */
async function loadGuidedMeditations(): Promise<{ tracks: Track[]; moods: Mood[] }> {
  try {
    const response = await fetch('/json/guided_meditations.json');
    const data = await response.json();
    
    const moods: Mood[] = [];
    const tracks: Track[] = [];
    
    // Process each category as a mood
    Object.entries(data.meditation_categories || {}).forEach(([categoryId, categoryData]: [string, any]) => {
      const mood: Mood = {
        id: categoryId,
        name: getMoodName(categoryId, 'guided'),
        description: categoryData.description || '',
      };
      moods.push(mood);
      
      // Process videos in this category
      (categoryData.videos || []).forEach((video: any, index: number) => {
        const videoId = extractYouTubeVideoId(video.url);
        if (videoId) {
          tracks.push({
            id: `guided-${categoryId}-${index}`,
            title: video.title,
            videoId,
            moodId: categoryId,
            category: 'guided',
            url: video.url,
          });
        }
      });
    });
    
    return { tracks, moods };
  } catch (error) {
    console.error('Error loading guided meditations:', error);
    return { tracks: [], moods: [] };
  }
}

/**
 * Loads and parses motivation videos JSON
 */
async function loadMotivationVideos(): Promise<{ tracks: Track[]; moods: Mood[] }> {
  try {
    const response = await fetch('/json/motivation_videos_categorized.json');
    const data = await response.json();
    
    const moods: Mood[] = [];
    const tracks: Track[] = [];
    
    // Process each category as a mood
    Object.entries(data.motivation_categories || {}).forEach(([categoryId, categoryData]: [string, any]) => {
      const mood: Mood = {
        id: categoryId,
        name: getMoodName(categoryId, 'motivation'),
        description: categoryData.description || '',
      };
      moods.push(mood);
      
      // Process videos in this category
      (categoryData.videos || []).forEach((video: any, index: number) => {
        const videoId = extractYouTubeVideoId(video.url);
        if (videoId) {
          tracks.push({
            id: `motivation-${categoryId}-${index}`,
            title: video.title,
            videoId,
            moodId: categoryId,
            category: 'motivation',
            url: video.url,
          });
        }
      });
    });
    
    return { tracks, moods };
  } catch (error) {
    console.error('Error loading motivation videos:', error);
    return { tracks: [], moods: [] };
  }
}

/**
 * Loads and parses categorized results JSON
 */
async function loadCategorizedResults(): Promise<{ tracks: Track[]; moods: Mood[] }> {
  try {
    const response = await fetch('/json/categorized_results.json');
    const data = await response.json();
    
    const moods: Mood[] = [];
    const tracks: Track[] = [];
    
    // Process each category
    Object.entries(data.categorized_videos || {}).forEach(([categoryId, videos]: [string, any]) => {
      const mood: Mood = {
        id: categoryId,
        name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
        description: `Videos for ${categoryId}`,
      };
      moods.push(mood);
      
      // Process videos in this category
      (videos || []).forEach((video: any, index: number) => {
        const videoId = extractYouTubeVideoId(video.url);
        if (videoId) {
          tracks.push({
            id: `categorized-${categoryId}-${index}`,
            title: video.title,
            videoId,
            moodId: categoryId,
            category: categoryId,
            url: video.url,
          });
        }
      });
    });
    
    return { tracks, moods };
  } catch (error) {
    console.error('Error loading categorized results:', error);
    return { tracks: [], moods: [] };
  }
}

/**
 * Loads all tracks from JSON files and organizes them by activity
 */
export async function loadTracksFromJSON(): Promise<TrackData> {
  const [guidedData, motivationData, categorizedData] = await Promise.all([
    loadGuidedMeditations(),
    loadMotivationVideos(),
    loadCategorizedResults(),
  ]);
  
  const trackData: TrackData = {};
  
  // Guided meditations -> meditate-guided activity
  trackData['meditate-guided'] = {
    tracks: guidedData.tracks,
    moods: guidedData.moods,
  };
  
  // Motivation videos -> motivation activities
  // Create a general motivation activity with all tracks
  trackData['motivation'] = {
    tracks: motivationData.tracks,
    moods: motivationData.moods,
  };
  
  // Also create specific motivation activities for each mood
  motivationData.moods.forEach((mood) => {
    const moodTracks = motivationData.tracks.filter(t => t.moodId === mood.id);
    trackData[`motivation-${mood.id}`] = {
      tracks: moodTracks,
      moods: [mood],
    };
  });
  
  // Categorized results -> map to existing activities
  // Focus category -> deep-work, creative, light-work, learning
  const focusMoods = categorizedData.moods.filter(m => 
    ['focus'].includes(m.id)
  );
  const focusTracks = categorizedData.tracks.filter(t => t.category === 'focus');
  if (focusTracks.length > 0) {
    trackData['deep-work'] = {
      tracks: [...(trackData['deep-work']?.tracks || []), ...focusTracks],
      moods: [...(trackData['deep-work']?.moods || []), ...focusMoods],
    };
  }
  
  // Relaxation category -> chill, recharge, reading
  const relaxMoods = categorizedData.moods.filter(m => 
    ['relaxation'].includes(m.id)
  );
  const relaxTracks = categorizedData.tracks.filter(t => t.category === 'relaxation');
  if (relaxTracks.length > 0) {
    trackData['chill'] = {
      tracks: [...(trackData['chill']?.tracks || []), ...relaxTracks],
      moods: [...(trackData['chill']?.moods || []), ...relaxMoods],
    };
  }
  
  // Sleep category -> sleep-deep, sleep-guided
  const sleepMoods = categorizedData.moods.filter(m => 
    ['sleep'].includes(m.id)
  );
  const sleepTracks = categorizedData.tracks.filter(t => t.category === 'sleep');
  if (sleepTracks.length > 0) {
    trackData['sleep-deep'] = {
      tracks: [...(trackData['sleep-deep']?.tracks || []), ...sleepTracks],
      moods: [...(trackData['sleep-deep']?.moods || []), ...sleepMoods],
    };
  }
  
  return trackData;
}

/**
 * Gets tracks for a specific activity, optionally filtered by mood
 */
export function getTracksForActivity(
  trackData: TrackData,
  activityId: string,
  moodId?: string
): Track[] {
  const activityData = trackData[activityId];
  if (!activityData) return [];
  
  if (moodId) {
    return activityData.tracks.filter(t => t.moodId === moodId);
  }
  
  return activityData.tracks;
}

/**
 * Gets available moods for a specific activity
 */
export function getMoodsForActivity(
  trackData: TrackData,
  activityId: string
): Mood[] {
  const activityData = trackData[activityId];
  if (!activityData) return [];
  
  return activityData.moods;
}

/**
 * Gets all tracks from all activities
 */
export function getAllTracks(trackData: TrackData): Track[] {
  const allTracks: Track[] = [];
  Object.values(trackData).forEach(activityData => {
    allTracks.push(...activityData.tracks);
  });
  // Remove duplicates by track ID
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  );
  return uniqueTracks;
}

/**
 * Gets all unique moods from all activities
 */
export function getAllMoods(trackData: TrackData): Mood[] {
  const allMoods: Mood[] = [];
  const moodMap = new Map<string, Mood>();
  
  Object.values(trackData).forEach(activityData => {
    activityData.moods.forEach(mood => {
      if (!moodMap.has(mood.id)) {
        moodMap.set(mood.id, mood);
        allMoods.push(mood);
      }
    });
  });
  
  return allMoods;
}

