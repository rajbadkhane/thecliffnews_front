'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import InshortCard from '@/components/InshortCard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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

const InshortsClient = () => {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'en';

  const [inshorts, setInshorts] = useState<InshortItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchInshorts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inshorts?limit=20`);

        if (!response.ok) {
          throw new Error('Failed to fetch inshorts');
        }

        const data = await response.json();
        setInshorts(data.inshorts || []);
      } catch (error) {
        console.error('Error fetching inshorts:', error);
        setError('Failed to load quick reads');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInshorts();
  }, []);

  const handleSwipeUp = () => {
    if (currentIndex < inshorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-green-50 dark:bg-green-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <ArrowLeft className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Quick Reads</h1>
                  <div className="w-16 h-1 bg-green-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Stay informed with the latest news in 60 words or less
              </p>
            </div>
          </div>
        </section>

        {/* Loading State */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            {/* Desktop Grid Loading */}
            <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl h-96"></div>
              ))}
            </div>

            {/* Mobile Loading */}
            <div className="lg:hidden max-w-md mx-auto">
              <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl h-96"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-green-50 dark:bg-green-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <ArrowLeft className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Quick Reads</h1>
                  <div className="w-16 h-1 bg-green-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Stay informed with the latest news in 60 words or less
              </p>
            </div>
          </div>
        </section>

        {/* Error State */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 text-center">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl inline-block mb-6">
              <ArrowLeft className="h-16 w-16 text-red-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Error loading quick reads</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-green-50 dark:bg-green-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Quick Reads</h1>
                <div className="w-16 h-1 bg-green-600 rounded-full mx-auto"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Stay informed with the latest news in 60 words or less
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {inshorts.length > 0 ? (
            <>
              {/* Back Button */}
              <div className="mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}`)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>

              {/* Desktop Grid Layout */}
              <div className="hidden lg:block">
                <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {inshorts.map((inshort, index) => (
                    <div key={inshort.id} className="transform-none">
                      <InshortCard
                        item={inshort}
                        locale={locale}
                        currentIndex={index + 1}
                        totalCount={inshorts.length}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet Vertical Swipe (YouTube Shorts style) */}
              <div className="lg:hidden">
                <div className="relative h-[80vh] max-w-lg mx-auto">
                  <AnimatePresence mode="wait">
                    <InshortCard
                      key={inshorts[currentIndex]?.id}
                      item={inshorts[currentIndex]}
                      onSwipeUp={handleSwipeUp}
                      onSwipeDown={handleSwipeDown}
                      locale={locale}
                      currentIndex={currentIndex + 1}
                      totalCount={inshorts.length}
                    />
                  </AnimatePresence>
                </div>

                {/* Navigation Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {inshorts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex
                          ? 'bg-green-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl inline-block mb-6">
                <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No quick reads found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There are no quick reads available at the moment. Please check back later.
              </p>
              <Button
                onClick={() => router.push(`/${locale}`)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Browse Latest News
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InshortsClient;