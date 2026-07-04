"use client";

import { useState, useEffect, useRef } from "react";
import { X, Heart, Share2, Bookmark, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  hashtags?: string[];
  youtubeUrl: string;
  channelName?: string;
}

interface VideoPopupProps {
  video: YouTubeVideoData | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPopup = ({ video, isOpen, onClose }: VideoPopupProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) return "0";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const videoId = video ? getYouTubeVideoId(video.youtubeUrl) : null;
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=1`
    : null;

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (video) {
      if (navigator.share) {
        navigator.share({
          title: video.title,
          text: video.description,
          url: video.youtubeUrl,
        });
      } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(video.youtubeUrl);
      }
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Close popup on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Video Container - YouTube Shorts Style */}
      <div className="relative w-full h-full max-w-md mx-auto">
        <div className="relative w-full h-full bg-black">
          {embedUrl ? (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-lg">Video not available</p>
                <p className="text-sm text-gray-400">
                  No valid video URL provided
                </p>
              </div>
            </div>
          )}

          {/* Right Side Actions - YouTube Shorts Style */}
          <div className="absolute right-2 bottom-20 flex flex-col items-center space-y-3">
            {/* Channel Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {video.channelName?.charAt(0)?.toUpperCase() || "C"}
            </div>

            {/* Like Button */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 rounded-full p-0 ${
                  isLiked ? "text-red-500" : "text-white hover:bg-white/20"
                }`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <span className="text-white text-xs mt-1">
                {formatViews(video.likeCount)}
              </span>
            </div>

            {/* Share Button */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full p-0 text-white hover:bg-white/20"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <span className="text-white text-xs mt-1">Share</span>
            </div>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`w-10 h-10 rounded-full p-0 ${
                isBookmarked
                  ? "text-yellow-500"
                  : "text-white hover:bg-white/20"
              }`}
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
          </div>

          {/* Video Info - Bottom Left - Simplified */}
          <div className="absolute bottom-20 left-4 right-16">
            <div className="text-white">
              <h3 className="text-base font-semibold mb-1 line-clamp-2">
                {video.title}
              </h3>

              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-white/80">
                  {video.channelName || "Unknown Channel"}
                </span>
                <span className="text-sm text-white/60">•</span>
                <span className="text-sm text-white/60">
                  {formatViews(video.viewCount)} views
                </span>
              </div>

              {/* Description with See More */}
              <div className="text-sm text-white/80">
                {isDescriptionExpanded ? (
                  <div>
                    <p className="mb-1">{video.description}</p>
                    <button
                      onClick={toggleDescription}
                      className="text-white/60 hover:text-white transition-colors text-xs"
                    >
                      Show less
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="line-clamp-2">{video.description}</p>
                    {video.description.length > 100 && (
                      <button
                        onClick={toggleDescription}
                        className="text-white/60 hover:text-white transition-colors mt-1 flex items-center text-xs"
                      >
                        See more
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Tags */}
              {video.hashtags && video.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {video.hashtags
                    .slice(0, 3)
                    .map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
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

      {/* Backdrop Click to Close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default VideoPopup;