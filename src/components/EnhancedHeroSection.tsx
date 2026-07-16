"use client";

import { useState, useEffect } from "react";
import { Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Article } from "@/services";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { getArticleUrl } from "@/lib/slug";

interface EnhancedHeroSectionProps {
  featuredArticles: Article[];
  locale?: string;
}

const EnhancedHeroSection = ({
  featuredArticles,
  locale: propLocale,
}: EnhancedHeroSectionProps) => {
  const nextIntlLocale = useLocale();
  const locale = propLocale || nextIntlLocale;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || !featuredArticles.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredArticles.length, isAutoPlay]);

  const formatDate = (dateString: string) => formatTimeAgo(dateString);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  if (!featuredArticles.length) return null;

  const currentArticle = featuredArticles[currentIndex];

  return (
    <section className="relative group bg-gray-900">
      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        {/* Image Section */}
        <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
          <div className="relative min-h-[250px] md:min-h-[300px]">
            {featuredArticles.map((article, index) => (
              <div
                key={article.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex justify-center items-center h-full p-4">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm text-gray-800 p-2.5 rounded-full shadow-lg transition-all hover:bg-white hover:scale-105 touch-manipulation"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm text-gray-800 p-2.5 rounded-full shadow-lg transition-all hover:bg-white hover:scale-105 touch-manipulation"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-gradient-to-b from-background to-muted/30 p-6 md:p-8 relative">
          {/* Decorative Element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></div>

          <div className="pt-4">
            {/* Breaking News Badge */}
            {currentArticle.isBreaking && (
              <div className="inline-flex items-center mb-4">
                <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  BREAKING NEWS
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm category-badge ${
                  currentArticle.category?.name?.toLowerCase() || "uncategorized"
                }`}
              >
                {currentArticle.category?.name || "Uncategorized"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-normal tracking-tight">
              {currentArticle.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
              {currentArticle.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
              <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1.5">
                <User className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">
                  {currentArticle.author?.name || "Unknown Author"}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-sm">
                  {formatDate(currentArticle.publishedAt || new Date().toISOString())}
                </span>
              </div>
              <div className="bg-muted/50 rounded-full px-3 py-1.5 text-sm">
                {currentArticle.readTime} min read
              </div>
            </div>

            {/* CTA Button */}
            <Link href={getArticleUrl(locale, currentArticle)}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Read Full Story
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Overlay Style */}
      <div className="hidden lg:block relative h-[70vh] overflow-hidden">
        {/* Background Images */}
        {featuredArticles.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="hero-overlay absolute inset-0" />
          </div>
        ))}

        {/* Desktop Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Desktop Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
          <div className="max-w-4xl w-full">
            {/* Breaking News Badge */}
            {currentArticle.isBreaking && (
              <div className="inline-flex items-center mb-4">
                <span className="category-badge breaking animate-pulse">
                  🔴 BREAKING NEWS
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="mb-4">
              <span
                className={`category-badge ${
                  currentArticle.category?.name?.toLowerCase() || "uncategorized"
                }`}
              >
                {currentArticle.category?.name || "Uncategorized"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl animate-fade-in-up leading-normal">
              {currentArticle.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-white/90 mb-6 max-w-2xl animate-fade-in-up leading-relaxed">
              {currentArticle.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex items-center gap-6 mb-6 text-white/80 animate-fade-in-up">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {currentArticle.author?.name || "Unknown Author"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {formatDate(currentArticle.publishedAt || new Date().toISOString())}
                </span>
              </div>
              <div className="text-sm">{currentArticle.readTime} min read</div>
            </div>

            {/* CTA Button */}
            <Link href={getArticleUrl(locale, currentArticle)}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium animate-fade-in-up"
              >
                Read Full Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicators - Positioned for both layouts */}
      <div className="absolute bottom-4 right-4 lg:right-8 z-20 flex space-x-2">
        {featuredArticles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary lg:bg-white"
                : "bg-primary/50 lg:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20 lg:bg-white/20 z-20">
        <div
          className="h-full bg-primary lg:bg-primary transition-all duration-[5000ms] ease-linear"
          style={{
            width: isAutoPlay ? "100%" : "0%",
            transitionDuration: isAutoPlay ? "5000ms" : "0ms",
          }}
        />
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
