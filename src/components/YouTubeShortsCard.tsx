import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Share2,
  MoreVertical,
  MessageCircle,
  Bookmark,
  Play,
} from "lucide-react";

// Interface for the actual API response
interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  duration: string;
  hashtags: string[];
  youtubeUrl: string;
  channelName?: string;
}

interface YouTubeShortsCardProps {
  video: YouTubeVideoData;
  isActive?: boolean;
  onVideoEnd?: () => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  showActions?: boolean;
}

const YouTubeShortsCard = ({
  video,
  isActive = false,
  onVideoEnd,
  isPlaying = false,
  onPlayPause,
  showActions = true,
}: YouTubeShortsCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(video.youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=${
        isActive && isPlaying ? 1 : 0
      }&controls=0&showinfo=0&rel=0&modestbranding=1&fs=0&cc_load_policy=0&iv_load_policy=3&autohide=1&mute=0&loop=1&playlist=${videoId}&enablejsapi=1`
    : null;

  // Simulate progress for YouTube embeds (since we can't control them directly)
  useEffect(() => {
    if (isActive && isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            onVideoEnd?.();
            return 0;
          }
          return newProgress;
        });
      }, 1000); // Update every second (adjust based on video duration)

      return () => clearInterval(interval);
    }
  }, [isActive, isPlaying, onVideoEnd]);

  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) return "0";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: video.youtubeUrl,
      });
    } else {
      navigator.clipboard.writeText(video.youtubeUrl);
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleVideoClick = () => {
    onPlayPause?.();
    showControlsTemporarily();
  };


  const showControlsTemporarily = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };


  if (!embedUrl) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📹</div>
          <p className="text-lg">Video not available</p>
          <p className="text-sm text-gray-400">No valid video URL provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="relative w-full h-full">
        {/* YouTube Video Embed - Clean Instagram Style */}
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
          style={{
            pointerEvents: 'none',
            transform: 'scale(1.1)', // Slightly zoom to hide YouTube UI
            transformOrigin: 'center',
          }}
        />

        {/* Invisible click overlay for play/pause control */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
          onClick={handleVideoClick}
          onMouseMove={showControlsTemporarily}
          onTouchStart={showControlsTemporarily}
        >
          {/* Play/Pause Icon Overlay */}
          {showControls && (
            <div
              className={`transition-opacity duration-300 ${
                isPlaying ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="bg-black/30 rounded-full p-4 backdrop-blur-sm">
                <Play className="h-12 w-12 text-white fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Custom Progress Bar (Instagram style) */}
        <div
          className={`absolute top-2 left-2 right-2 z-20 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <div className="w-full h-1 bg-white/30 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>


        {/* Right Side Actions - Instagram Reels Style (Only on Mobile) */}
        {showActions && (
          <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
            {/* Like Button */}
            <div className="flex flex-col items-center">
              <button
                className={`w-12 h-12 flex items-center justify-center transition-transform duration-200 ${
                  isLiked ? "scale-110" : "hover:scale-105"
                }`}
                onClick={handleLike}
              >
                <Heart
                  className={`h-7 w-7 ${
                    isLiked ? "text-red-500 fill-current" : "text-white"
                  }`}
                />
              </button>
              <span className="text-white text-xs font-medium">
                {formatViews(video.likeCount)}
              </span>
            </div>

            {/* Comment Button */}
            <div className="flex flex-col items-center">
              <button className="w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                <MessageCircle className="h-7 w-7 text-white" />
              </button>
              <span className="text-white text-xs font-medium">0</span>
            </div>

            {/* Share Button */}
            <div className="flex flex-col items-center">
              <button
                className="w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-200"
                onClick={handleShare}
              >
                <Share2 className="h-7 w-7 text-white" />
              </button>
            </div>

            {/* Bookmark Button */}
            <button
              className={`w-12 h-12 flex items-center justify-center transition-transform duration-200 ${
                isBookmarked ? "scale-110" : "hover:scale-105"
              }`}
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-7 w-7 ${
                  isBookmarked ? "text-yellow-400 fill-current" : "text-white"
                }`}
              />
            </button>

            {/* More Options */}
            <button className="w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform duration-200">
              <MoreVertical className="h-7 w-7 text-white" />
            </button>
          </div>
        )}

        {/* Video Info - Bottom Overlay */}
        <div className={`absolute bottom-0 left-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 ${
          showActions ? 'right-20' : 'right-0'
        }`}>
          <div className="text-white">
            {/* Title */}
            <div className="mb-3">
              {isDescriptionExpanded ? (
                <div>
                  <h3 className="text-base font-semibold leading-tight mb-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">{video.description}</p>
                  <button
                    onClick={toggleDescription}
                    className="text-white/60 hover:text-white transition-colors mt-2 text-xs"
                  >
                    ...less
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-semibold leading-tight line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  {video.description && video.description.length > 50 && (
                    <button
                      onClick={toggleDescription}
                      className="text-white/60 hover:text-white transition-colors text-xs"
                    >
                      ...more
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Hashtags */}
            {video.hashtags && video.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {video.hashtags
                  .slice(0, 4)
                  .map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-sm text-blue-300 font-medium hover:text-blue-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeShortsCard;
