'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InshortCard from '@/components/InshortCard';
import { motion } from 'framer-motion';

interface InshortItem {
  id: string;
  title: string;
  content: string;
  featuredImage?: string;
  category?: { id: string; name: string; slug: string };
  publishedAt?: string;
  readTime?: number;
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

interface QuickReadsSectionProps {
  locale: string;
}

const QuickReadsSection: React.FC<QuickReadsSectionProps> = ({ locale }) => {
  const [quickReads, setQuickReads] = useState<InshortItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';

  useEffect(() => {
    const fetchQuickReads = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inshorts?limit=6&language=${language}`);

        if (!response.ok) {
          throw new Error('Failed to fetch quick reads');
        }

        const data = await response.json();
        setQuickReads(data.inshorts || []);
      } catch (error) {
        console.error('Error fetching quick reads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuickReads();
  }, [language]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : quickReads.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < quickReads.length - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-green-50 dark:bg-green-900/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Quick Reads
                  </h2>
                  <div className="w-16 h-1 bg-current rounded-full opacity-60"></div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                News in 60 words or less - stay informed quickly
              </p>
            </div>
          </div>

          {/* Loading Cards */}
          <div className="relative overflow-hidden">
            <div className="flex gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl w-80 h-96 flex-shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!quickReads.length) return null;

  return (
    <section className="py-16 bg-green-50 dark:bg-green-900/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Quick Reads
                </h2>
                <div className="w-16 h-1 bg-current rounded-full opacity-60"></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              News in 60 words or less - stay informed quickly
            </p>
          </div>

          <Link href={`/${locale}/quick-reads`}>
            <Button className="hidden md:inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors group">
              View All Quick Reads
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Horizontal Swipable Cards */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10">
            <Button
              onClick={handlePrevious}
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-800 border-none backdrop-blur-sm w-10 h-10 p-0 rounded-full shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10">
            <Button
              onClick={handleNext}
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-800 border-none backdrop-blur-sm w-10 h-10 p-0 rounded-full shadow-lg"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${currentIndex * 400}px` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {quickReads.map((quickRead, index) => (
                <div key={quickRead.id} className="w-96 h-[600px] flex-shrink-0">
                  <div className="transform-none h-full">
                    <InshortCard
                      item={quickRead}
                      locale={locale}
                      currentIndex={index + 1}
                      totalCount={quickReads.length}
                      disableDrag={true}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {quickReads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 transition-colors ${
                  index === currentIndex
                    ? 'bg-green-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile View All Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <Link href={`/${locale}/quick-reads`}>
            <Button className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors group">
              View All Quick Reads
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickReadsSection;