"use client";

import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedThumbnail from "@/components/ProtectedThumbnail";
import AppDownloadModal from "@/components/AppDownloadModal";

export interface ImageItem {
  id: string;
  title: string;
  imageUrl: string;
  caption?: string;
  category?: string;
  date: string;
  allowDownload?: boolean;
  allowSharing?: boolean;
  viewCount?: number;
  downloadCount?: number;
  shareCount?: number;
}

interface MasonryImageGridProps {
  images: ImageItem[];
  columns?: number;
  className?: string;
  showMetadata?: boolean;
  onImageClick?: (image: ImageItem) => void;
}

const MasonryImageGrid: React.FC<MasonryImageGridProps> = ({
  images,
  className = "",
  showMetadata = true,
  onImageClick,
}) => {
  const [appModalOpen, setAppModalOpen] = useState(false);

  const handleImageClick = (image: ImageItem) => {
    setAppModalOpen(true);
    if (onImageClick) {
      onImageClick(image);
    }
  };

  return (
    <>
      <div className={cn("w-full", className)}>
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 break-inside-avoid mb-4"
            >
              <div className="relative overflow-hidden">
                <ProtectedThumbnail
                  src={image.imageUrl}
                  alt={image.title}
                  onClick={() => handleImageClick(image)}
                  imageClassName="h-auto"
                />

                {/* Date Badge - Top Left */}
                <div className="pointer-events-none absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 bg-black/80 text-white text-xs rounded-full backdrop-blur-sm">
                    {new Date(image.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {showMetadata && (
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {image.title}
                  </h3>

                  {image.caption && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {image.caption}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{new Date(image.date).toLocaleDateString()}</span>

                    {(image.viewCount !== undefined ||
                      image.downloadCount !== undefined) && (
                      <div className="flex items-center gap-3">
                        {image.viewCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {image.viewCount}
                          </span>
                        )}
                        {image.downloadCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {image.downloadCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AppDownloadModal open={appModalOpen} onOpenChange={setAppModalOpen} />
    </>
  );
};

export default MasonryImageGrid;
