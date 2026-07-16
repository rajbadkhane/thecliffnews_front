"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedImageProps {
  src: string;
  alt: string;
  variant?: 'hero' | 'card' | 'thumbnail' | 'mobile' | 'tablet';
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  aspectRatio?: string;
}

export function FeaturedImage({
  src,
  alt,
  variant = 'card',
  className,
  priority = false,
  onClick,
  aspectRatio
}: FeaturedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClass = aspectRatio || {
    hero: 'aspect-[16/9]',
    card: 'aspect-[4/3]',
    thumbnail: 'aspect-square',
    mobile: 'aspect-[4/3]',
    tablet: 'aspect-[16/9]'
  }[variant];

  if (hasError || !src) {
    return (
      <div className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatioClass,
        className
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-10 w-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatioClass,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          'object-cover transition-all duration-300',
          onClick && 'hover:scale-105',
          isLoading && 'opacity-0'
        )}
        priority={priority}
        sizes={
          variant === 'hero'
            ? '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
            : variant === 'card'
            ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px'
            : variant === 'thumbnail'
            ? '150px'
            : '100vw'
        }
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
