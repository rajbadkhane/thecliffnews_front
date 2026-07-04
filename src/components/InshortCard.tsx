"use client";

import { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Share2, Clock, ArrowRight, ChevronUp } from 'lucide-react';
import { FeaturedImage } from '@/components/FeaturedImage';
import { useTranslations } from 'next-intl';
import { formatTimeAgo } from '@/lib/formatTimeAgo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { appendShareSource } from '@/lib/share';

interface InshortItem {
  id: string;
  title: string;
  content: string;
  featuredImage?: string;
  category?: { id: string; name: string; slug: string };
  publishedAt?: string;
  readTime?: number;
  isBreaking?: boolean;
  viewCount?: number;
  shareCount?: number;
  sourceArticleId?: string;
  sourceArticle?: {
    id: string;
    title: string;
    slug: string;
  };
  slug?: string;
}

interface InshortCardProps {
  item: InshortItem;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  isActive?: boolean;
  locale?: string;
  currentIndex?: number;
  totalCount?: number;
  disableDrag?: boolean;
}

export function InshortCard({
  item,
  onSwipeUp,
  onSwipeDown,
  isActive = true,
  locale = 'en',
  currentIndex = 1,
  totalCount = 1,
  disableDrag = false
}: InshortCardProps) {
  const t = useTranslations();

  // Function to limit content to 120 words
  const limitWords = (text: string, limit: number = 120) => {
    const words = text.split(' ');
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };

  // Build the article URL based on locale
  const articleUrl = item.sourceArticle
    ? `/${locale}/article/${item.sourceArticle.slug}?from=inshorts&index=${currentIndex}`
    : null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content,
          url: appendShareSource(articleUrl || window.location.href)
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };


  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    const swipeVelocityThreshold = 500;

    if (info.offset.y < -swipeThreshold || info.velocity.y < -swipeVelocityThreshold) {
      onSwipeUp?.();
    } else if (info.offset.y > swipeThreshold || info.velocity.y > swipeVelocityThreshold) {
      onSwipeDown?.();
    }
  };

  return (
    <motion.div
      className="h-full w-full flex items-stretch justify-center px-0 md:px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        drag={disableDrag ? false : "y"}
        dragConstraints={disableDrag ? {} : { top: 0, bottom: 0 }}
        dragElastic={disableDrag ? 0 : 0.2}
        onDragEnd={disableDrag ? undefined : handleDragEnd}
        className="w-full md:max-w-3xl h-full"
        whileDrag={disableDrag ? {} : { scale: 0.95 }}
      >
        <div className="relative bg-card shadow-lg overflow-hidden h-full flex flex-col">
          {/* Progress Indicator */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentIndex / totalCount) * 100}%` }}
            />
          </div>

          {/* Featured Image */}
          {item.featuredImage && (
            <div className="relative">
              <FeaturedImage
                src={item.featuredImage}
                alt={item.title}
                variant="mobile"
                className="w-full h-64"
              />

              {/* Category Badge */}
              {item.category && (
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "px-3 py-1.5 text-xs font-semibold backdrop-blur-md",
                    "bg-white/90 dark:bg-black/90 text-foreground"
                  )}>
                    {item.category.name}
                  </span>
                </div>
              )}

              {/* Breaking Badge */}
              {item.isBreaking && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold animate-pulse">
                    {t('home.breakingNews')}
                  </span>
                </div>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 text-xs font-semibold backdrop-blur-md bg-black/70 text-white">
                  {currentIndex}/{totalCount}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-2 line-clamp-2">
              {item.title}
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-3 text-sm">
              {limitWords(item.content)}
            </p>

            {/* Read Full Story Button - Compact */}
            {articleUrl && (
              <Link
                href={articleUrl}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors mb-3"
              >
                {t('home.readMore')}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                {item.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(item.publishedAt)}
                  </span>
                )}
              </div>
              {item.readTime && (
                <span>{item.readTime} min read</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-8 right-4 z-10 flex items-center justify-end lg:bottom-4">
              <button
                onClick={handleShare}
                className="p-2 bg-muted hover:bg-muted/80 text-muted-foreground transition-all"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

export default InshortCard;
