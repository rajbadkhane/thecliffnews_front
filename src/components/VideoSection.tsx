'use client';

import { useState, useEffect } from 'react';
import HorizontalVideoScroll from './HorizontalVideoScroll';

interface YouTubeShort {
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
}

interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  duration: string;
  youtubeUrl: string;
  channelName: string;
}

interface VideoSectionProps {
  title?: string;
  subtitle?: string;
}

const VideoSection = ({
  title = "Video Bytes",
  subtitle = "News in motion - quick video updates"
}: VideoSectionProps) => {
  const [videos, setVideos] = useState<YouTubeVideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/shorts?limit=10`);

        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        const shorts = data?.shorts || [];

        // Transform the data to match the expected format
        const transformedVideos: YouTubeVideoData[] = shorts.map((short: YouTubeShort) => ({
          id: short.id,
          title: short.title,
          description: short.description || short.title, // Use actual description from API
          thumbnail: short.thumbnail,
          publishedAt: short.publishedAt || new Date().toISOString(),
          viewCount: short.viewCount || 0,
          likeCount: short.likeCount || 0,
          duration: short.duration,
          youtubeUrl: short.youtubeUrl, // Use the URL directly from API
          channelName: "The Cliff News",
        }));

        console.log(`Loaded ${transformedVideos.length} videos`, transformedVideos.map(v => ({ id: v.id, title: v.title, youtubeUrl: v.youtubeUrl })));
        setVideos(transformedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError(`Failed to load videos: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="w-16 h-1 bg-current rounded-full opacity-60"></div>
                  </div>
                </div>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              </div>
            </div>
          </div>

          {/* Loading Cards */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl w-80 h-48 flex-shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Video section error:', error);
    // Still try to render if we have any data
    if (videos.length === 0) {
      return (
        <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
          <div className="container mx-auto px-4 text-center">
            <div className="py-8 text-gray-500">
              <p>Unable to load video section. Please try refreshing the page.</p>
            </div>
          </div>
        </section>
      );
    }
  }

  if (!isLoading && videos.length === 0) {
    return (
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4 text-center">
          <div className="py-8 text-gray-500">
            <p>No videos available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return <HorizontalVideoScroll videos={videos} title={title} subtitle={subtitle} />;
};

export default VideoSection;