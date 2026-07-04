"use client";

import { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPopup from "./VideoPopup";
import { useRouter, usePathname } from "next/navigation";

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

interface HorizontalVideoScrollProps {
  videos: YouTubeVideoData[];
  title?: string;
  subtitle?: string;
}

const HorizontalVideoScroll = ({
  videos,
  title = "Video Bytes",
  subtitle = "News in motion - quick video updates",
}: HorizontalVideoScrollProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoData | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname?.split('/')[1] || 'en';

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [videos]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) return "0";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleVideoClick = (video: YouTubeVideoData) => {
    setSelectedVideo(video);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedVideo(null);
  };

  const formatDuration = (duration: string | number) => {
    let seconds: number;
    if (typeof duration === "string") {
      // Parse ISO 8601 duration format (e.g., "PT45S" -> 45 seconds)
      const match = duration.match(/PT(\d+)S/);
      seconds = match ? parseInt(match[1]) : 0;
    } else {
      seconds = duration;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleWatchAllClick = () => {
    router.push(`/${currentLocale}/videos`);
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="headline-medium text-brand-navy mb-2">{title}</h2>
            <div className="w-12 h-1 bg-primary rounded-full"></div>
            <p className="body-medium text-muted-foreground mt-2">{subtitle}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWatchAllClick}
              className="group"
            >
              Watch All Videos
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="h-8 w-8 text-black ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(video.duration)}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded font-medium">
                      NEWS
                    </span>
                  </div>

                  {/* Video Title Overlay - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 drop-shadow-lg">
                      {video.title}
                    </h3>

                    {/* Channel and Views */}
                    <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                      <span className="font-medium">
                        {video.channelName || "Unknown Channel"}
                      </span>
                      <span>{formatViews(video.viewCount)} views</span>
                    </div>

                    {/* Tags Overlay */}
                    {video.hashtags && video.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {video.hashtags
                          .slice(0, 3)
                          .map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Fade Effects */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-muted/30 to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Video Popup */}
      <VideoPopup
        video={selectedVideo}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </section>
  );
};

export default HorizontalVideoScroll;