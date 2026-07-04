'use client';

import { useState, useEffect } from 'react';
import HomepageImageGrid from './HomepageImageGrid';
import { Images } from 'lucide-react';

interface HighlightItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface HomepageHighlightsProps {
  locale: string;
}

const HomepageHighlights = ({ locale }: HomepageHighlightsProps) => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/highlights?limit=6`);

        if (!response.ok) {
          throw new Error('Failed to fetch highlights');
        }

        const data = await response.json();
        const rawHighlights = data?.highlights || [];

        // Transform API response to match HomepageImageGrid expected format
        const transformedHighlights: HighlightItem[] = rawHighlights.map((highlight: Record<string, unknown>) => ({
          id: highlight.id as string,
          title: highlight.title as string,
          image: highlight.imageUrl as string, // Map imageUrl to image
          link: `/${locale}/highlights/${highlight.id}` // Create a proper link
        }));

        console.log(`Loaded ${transformedHighlights.length} highlights for homepage`);
        setHighlights(transformedHighlights);
      } catch (error) {
        console.error('Error fetching highlights for homepage:', error);
        setError(`Failed to load highlights: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                  <Images className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="w-16 h-1 bg-current rounded-full opacity-60"></div>
                  </div>
                </div>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
              </div>
            </div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl aspect-video"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Homepage highlights section error:', error);
    // Still try to render if we have any data
    if (highlights.length === 0) {
      return (
        <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
          <div className="container mx-auto px-4 text-center">
            <div className="py-8 text-gray-500">
              <Images className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <p>Unable to load highlights section. Please try refreshing the page.</p>
            </div>
          </div>
        </section>
      );
    }
  }

  if (!isLoading && highlights.length === 0) {
    return (
      <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
        <div className="container mx-auto px-4 text-center">
          <div className="py-8 text-gray-500">
            <Images className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <p>No highlights available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <HomepageImageGrid
      title="News Highlights"
      subtitle="Visual highlights and important stories from The Cliff News"
      items={highlights}
      type="highlights"
      locale={locale}
      icon={<Images className="h-8 w-8 text-orange-500" />}
      bgColor="bg-orange-50 dark:bg-orange-900/10"
      linkColor="bg-orange-500 hover:bg-orange-600"
    />
  );
};

export default HomepageHighlights;