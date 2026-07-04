"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoByteCard from "./VideoByteCard";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  likes?: number;
  views?: number;
  publishedAt: string;
  channelName?: string;
  channelUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VideosBytesSectionProps {
  videos: VideoData[];
  maxVideos?: number;
}

const VideosBytesSection = ({ videos, maxVideos = 4 }: VideosBytesSectionProps) => {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';

  // No need for special navigation handling since we're using locale-aware routes

  // Limit videos to maxVideos
  const displayVideos = videos.slice(0, maxVideos);

  if (!displayVideos.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Video Bytes
            </h2>
            <div className="w-16 h-1 bg-purple-600 rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              News in motion - quick video updates
            </p>
          </div>
          <Link href={`/${currentLocale}/videos`}>
            <Button variant="outline" className="flex items-center gap-2">
              Watch All Videos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {displayVideos.map((video) => (
              <div key={video.id} className="flex-shrink-0">
                <VideoByteCard video={video} />
              </div>
            ))}
          </div>
        </div>

        {/* Show more indicator */}
        {videos.length > maxVideos && (
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {maxVideos} of {videos.length} videos
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideosBytesSection;