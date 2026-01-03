// Wrapper for YouTube IFrame Player API
// Allows playing specific tracks for activities while maintaining a simple audio interface

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

let player: any = null;
let isReady = false;
let pendingVideoId: string | null = null;
let shouldPlay = false;

export const AudioService = {
  init: (elementId: string) => {
    // If we have a player instance but the element is gone (or we are re-initializing), 
    // we must destroy the old player to avoid "not attached to DOM" errors.
    if (player) {
      AudioService.cleanup();
    }

    const startPlayer = () => {
      // Double check element exists before creating player
      const element = document.getElementById(elementId);
      if (!element) {
        // If element doesn't exist yet, we can't init. 
        // This might happen if init is called too early, but usually useEffect handles this.
        return;
      }

      player = new window.YT.Player(elementId, {
        height: '1',
        width: '1',
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            isReady = true;
            event.target.setVolume(50);
            
            if (pendingVideoId) {
              // Use cueVideoById to load without auto-playing
              event.target.cueVideoById(pendingVideoId);
            }
            
            // If play was requested before ready
            if (shouldPlay) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // Loop video if ended
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        },
      });
    };

    // Load the YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      // Setup global callback
      window.onYouTubeIframeAPIReady = () => {
        startPlayer();
      };
    } else {
      // API already loaded
      if (window.YT.Player) {
        startPlayer();
      } else {
        // YT Object exists but Player might not be ready, fallback to callback
        window.onYouTubeIframeAPIReady = () => {
          startPlayer();
        };
      }
    }
  },

  loadTrack: (videoId: string, autoPlay: boolean = false) => {
    pendingVideoId = videoId;
    if (autoPlay) {
      shouldPlay = true;
    }
    if (isReady && player && typeof player.cueVideoById === 'function') {
      try {
        if (autoPlay) {
          // Use loadVideoById to load and play immediately
          player.loadVideoById(videoId);
        } else {
          // Use cueVideoById to load without auto-playing
          player.cueVideoById(videoId);
        }
      } catch (e) {
        console.warn("AudioService: Error loading video", e);
      }
    }
  },

  play: () => {
    shouldPlay = true;
    if (isReady && player && typeof player.playVideo === 'function') {
      try {
        player.playVideo();
      } catch (e) {
        console.warn("AudioService: Error playing video", e);
      }
    }
  },

  pause: () => {
    shouldPlay = false;
    if (isReady && player && typeof player.pauseVideo === 'function') {
      try {
        player.pauseVideo();
      } catch (e) {
        console.warn("AudioService: Error pausing video", e);
      }
    }
  },

  setVolume: (value: number) => {
    if (isReady && player && typeof player.setVolume === 'function') {
      try {
        player.setVolume(value);
      } catch (e) {
        console.warn("AudioService: Error setting volume", e);
      }
    }
  },

  cleanup: () => {
    shouldPlay = false;
    isReady = false;
    if (player) {
      try {
        if (typeof player.stopVideo === 'function') player.stopVideo();
        if (typeof player.destroy === 'function') player.destroy();
      } catch (e) {
        console.warn("AudioService: Error cleaning up player", e);
      }
      player = null;
    }
  }
};