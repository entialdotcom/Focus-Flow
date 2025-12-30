import React, { useEffect, useRef } from 'react';

interface AmbientTrackProps {
  id: string;
  videoId: string;
  isPlaying: boolean;
  volume: number;
}

const AmbientTrack: React.FC<AmbientTrackProps> = ({ id, videoId, isPlaying, volume }) => {
  const playerRef = useRef<any>(null);
  const elementId = `ambient-player-${id}`;

  // Initialize Player
  useEffect(() => {
    let checkInterval: any;

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(elementId, {
          height: '1',
          width: '1',
          videoId: videoId,
          playerVars: {
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            loop: 1,
            playlist: videoId, // Required for loop to work
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(volume);
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
                // Ensure loop if playlist param fails
                if (event.data === window.YT.PlayerState.ENDED) {
                    event.target.playVideo();
                }
            }
          },
        });
        return true;
      }
      return false;
    };

    if (!initPlayer()) {
      checkInterval = setInterval(() => {
        if (initPlayer()) {
          clearInterval(checkInterval);
        }
      }, 500);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (playerRef.current) {
        try {
            playerRef.current.destroy();
        } catch (e) { console.error(e); }
      }
    };
  }, []); // Only init on mount

  // Handle Play/Pause
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  // Handle Volume
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  return <div id={elementId} className="hidden" />;
};

export default AmbientTrack;