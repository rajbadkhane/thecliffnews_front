"use client";

import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Article } from "@/services";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { getArticleUrl } from "@/lib/slug";

interface NewsCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact" | "dw-style";
  locale?: string;
}

const NewsCard = ({ article, variant = "default", locale: propLocale }: NewsCardProps) => {
  const nextIntlLocale = useLocale();
  const locale = propLocale || nextIntlLocale;

  if (variant === "compact") {
    return (
      <Link href={getArticleUrl(locale, article)}>
        <article className="news-card p-4 transition-transform hover:scale-[1.02] cursor-pointer">
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={article.featuredImage || '/api/placeholder/400/300'}
                alt={article.title}
                className="w-full h-full object-contain bg-white dark:bg-gray-900"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                {article.isBreaking && (
                  <span className="category-badge breaking mr-2 text-xs">
                    BREAKING
                  </span>
                )}
                <span
                  className={`category-badge ${
                    article.category?.name?.toLowerCase() || "uncategorized"
                  } text-xs`}
                >
                  {article.category?.name || "Uncategorized"}
                </span>
              </div>
              <h3 className="font-semibold text-sm leading-normal mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{formatTimeAgo(article.publishedAt || new Date().toISOString())}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime} min</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={getArticleUrl(locale, article)}>
        <article className="group cursor-pointer h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
          <div className="relative overflow-hidden">
            {/* Image container with fixed aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
              <img
                src={article.featuredImage || '/api/placeholder/400/300'}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
            </div>

            {/* Floating badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {article.isBreaking && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-600 text-white animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-ping"></span>
                  BREAKING
                </span>
              )}
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800"
                style={{ backgroundColor: article.category?.color + '20', color: article.category?.color }}
              >
                {article.category?.name || "Uncategorized"}
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-normal">
              {article.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow text-sm leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTimeAgo(article.publishedAt || new Date().toISOString())}</span>
                </div>
                <span>{article.readTime} min read</span>
              </div>

              <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                <span className="text-xs font-medium mr-1">Read more</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "dw-style") {
    return (
      <Link href={getArticleUrl(locale, article)}>
        <article className="group cursor-pointer h-full relative overflow-hidden">
          {/* Full Image Background */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={article.featuredImage || '/api/placeholder/400/300'}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              {/* Category tag */}
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-white/20 backdrop-blur-sm rounded">
                  {article.category?.name?.toUpperCase() || "NEWS"}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-white font-semibold text-base leading-normal mb-2 line-clamp-3 group-hover:text-blue-200 transition-colors">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-white/80 text-sm line-clamp-2 mb-2">
                {article.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex items-center text-white/60 text-xs">
                <span>{article.category?.name?.toUpperCase()}</span>
                <span className="mx-2">|</span>
                <span>{formatTimeAgo(article.publishedAt || new Date().toISOString())}</span>
                <span className="mx-2">|</span>
                <span>{article.readTime} min</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={getArticleUrl(locale, article)}>
      <article className="group cursor-pointer h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="relative overflow-hidden">
          {/* Image container with aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: '60%' }}> {/* 5:3 aspect ratio */}
            <img
              src={article.featuredImage || '/api/placeholder/400/300'}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {article.isBreaking && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                BREAKING
              </span>
            )}
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/90 text-gray-800"
              style={{ backgroundColor: article.category?.color + '20', color: article.category?.color }}
            >
              {article.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-base leading-normal mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow text-sm">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(article.publishedAt || new Date().toISOString())}</span>
            </div>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
