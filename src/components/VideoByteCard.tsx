import { Play, Heart, Share2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface VideoByteCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    duration: string | number;
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
  };
}

const VideoByteCard = ({ video }: VideoByteCardProps) => {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';

  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) return "0";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (duration: string | number) => {
    if (typeof duration === 'number') {
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    // Handle ISO 8601 duration format (PT1M30S)
    if (typeof duration === 'string' && duration.startsWith('PT')) {
      const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
      if (match) {
        const mins = parseInt(match[1] || '0');
        const secs = parseInt(match[2] || '0');
        return `${mins}:${secs.toString().padStart(2, "0")}`;
      }
    }

    return duration.toString();
  };

  return (
    <div className="news-card p-0 w-72 group cursor-pointer">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play Button Overlay - Always visible */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-3">
            <Play className="h-8 w-8 text-white fill-current" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>

        {/* Category Badge */}
        {video.category && (
          <div className="absolute top-2 left-2">
            <span
              className={`category-badge ${
                video.category.name?.toLowerCase() || "uncategorized"
              } text-xs px-2 py-1 rounded`}
            >
              {video.category.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
        <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2 text-gray-900 dark:text-white">
          {video.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{formatViews(video.views)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{formatViews(video.likes)}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatDuration(video.duration)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Link href={`/${currentLocale}/videos`}>
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              <Play className="h-3 w-3 mr-1" />
              Watch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoByteCard;