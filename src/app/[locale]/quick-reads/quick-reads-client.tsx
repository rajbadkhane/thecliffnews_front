'use client';

import { useState, useEffect, useRef } from 'react';
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

interface QuickReadsClientProps {
  initialQuickReads?: InshortItem[];
}

const QuickReadsClient = ({ initialQuickReads = [] }: QuickReadsClientProps) => {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'en';
  const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';

  const [quickReads, setQuickReads] = useState<InshortItem[]>(initialQuickReads);
  const [isLoading, setIsLoading] = useState(initialQuickReads.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (initialQuickReads.length === 0 || hasMountedRef.current) {
      const fetchQuickReads = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inshorts?limit=20&language=${language}`);

          if (!response.ok) {
            throw new Error('Failed to fetch quick reads');
          }

          const data = await response.json();
          setQuickReads(data.inshorts || []);
        } catch (error) {
          console.error('Error fetching quick reads:', error);
          setError('Failed to load quick reads');
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuickReads();
    }
    hasMountedRef.current = true;
  }, [language, initialQuickReads.length]);

  const handleSwipeUp = () => {
    if (currentIndex < quickReads.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === quickReads.length - 1 && hasMore && !isLoadingMore) {
      loadMoreQuickReads();
    }
  };

  const loadMoreQuickReads = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inshorts?limit=20&offset=${quickReads.length}&language=${language}`);

      if (!response.ok) {
        throw new Error('Failed to fetch more quick reads');
      }

      const data = await response.json();
      const newQuickReads = data.inshorts || [];

      if (newQuickReads.length === 0) {
        setHasMore(false);
      } else {
        setQuickReads(prev => [...prev, ...newQuickReads]);
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Error loading more quick reads:', error);
    } finally {
      setIsLoadingMore(false);
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
            <div className="lg:hidden max-w-lg mx-auto">
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

        {/* Error State */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 text-center">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl inline-block mb-6">
              <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
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
      {/* Hero Section - Hidden on mobile and tablet */}
      <section className="hidden lg:block py-16 bg-green-50 dark:bg-green-900/10">
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
      <section className="lg:py-16">
        <div className="lg:container lg:mx-auto lg:px-4">
          {quickReads.length > 0 ? (
            <>
              {/* Back Button - Hidden on mobile/tablet */}
              <div className="hidden lg:block mb-8">
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
                  {quickReads.map((quickRead, index) => (
                    <div key={quickRead.id} className="transform-none h-[600px]">
                      <InshortCard
                        item={quickRead}
                        locale={locale}
                        currentIndex={index + 1}
                        totalCount={quickReads.length}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet Vertical Swipe (Inshorts style) */}
              <div className="lg:hidden">
                <div className="relative h-[calc(100vh-80px)] max-w-full mx-auto px-0 md:px-8">
                  <AnimatePresence mode="wait">
                    {currentIndex === quickReads.length && hasMore ? (
                      <div className="h-full w-full flex items-center justify-center bg-card">
                        <div className="text-center p-8">
                          <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <h3 className="text-xl font-semibold mb-2">Loading more stories...</h3>
                          <p className="text-muted-foreground">Fetching fresh content for you</p>
                        </div>
                      </div>
                    ) : currentIndex === quickReads.length && !hasMore ? (
                      <div className="h-full w-full flex items-center justify-center bg-card">
                        <div className="text-center p-8">
                          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl inline-block mb-6">
                            <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">You&apos;re all caught up!</h3>
                          <p className="text-muted-foreground mb-6">You&apos;ve read all available quick reads.</p>
                          <button
                            onClick={() => {
                              setCurrentIndex(0);
                              window.location.reload();
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                          >
                            Check for new stories
                          </button>
                        </div>
                      </div>
                    ) : (
                      <InshortCard
                        key={quickReads[currentIndex]?.id}
                        item={quickReads[currentIndex]}
                        onSwipeUp={handleSwipeUp}
                        onSwipeDown={handleSwipeDown}
                        locale={locale}
                        currentIndex={currentIndex + 1}
                        totalCount={quickReads.length + (hasMore ? 1 : 0)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Indicators - Hidden on mobile for full Inshorts experience */}
                <div className="hidden md:flex justify-center mt-6 space-x-2">
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

export default QuickReadsClient;