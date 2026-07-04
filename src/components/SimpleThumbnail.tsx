"use client";

import React from 'react';
import Image from 'next/image';
import { Newspaper } from 'lucide-react';

interface SimpleThumbnailProps {
  thumbnailUrl?: string;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

const SimpleThumbnail: React.FC<SimpleThumbnailProps> = ({
  thumbnailUrl,
  title,
  width = 280,
  height = 380,
  className = '',
}) => {
  // If no thumbnail URL, show placeholder
  if (!thumbnailUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-md shadow-lg border border-gray-300 dark:border-gray-700 ${className}`}
        style={{ width, height }}
      >
        <Newspaper className="h-20 w-20 text-primary mb-4" />
        <p className="text-sm font-semibold text-foreground text-center px-4">
          {title}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-md shadow-lg ${className}`}
      style={{ width, height }}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover"
        sizes={`${width}px`}
      />
    </div>
  );
};

export default SimpleThumbnail;
