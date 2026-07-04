'use client';

import { useState, useEffect } from 'react';
import HomepageImageGrid from './HomepageImageGrid';
import { Clock } from 'lucide-react';
import type { NIT } from '@/services/nit';

interface HomepageNITProps {
  locale: string;
}

const HomepageNIT = ({ locale }: HomepageNITProps) => {
  const [nits, setNits] = useState<NIT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNITs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nit?limit=6`);

        if (!response.ok) {
          throw new Error('Failed to fetch NITs');
        }

        const data = await response.json();
        const rawNits = data?.nits || [];

        // Transform API response to match HomepageImageGrid expected NIT format
        const transformedNits: NIT[] = rawNits.map((nit: Record<string, unknown>) => ({
          id: nit.id as string,
          title: nit.title as string,
          description: (nit.description || nit.title) as string,
          department: (nit.department || '') as string,
          tenderNumber: (nit.tenderNumber || '') as string,
          publishedDate: (nit.publishedDate || nit.date || nit.createdAt) as string,
          lastDate: (nit.lastDate || '') as string,
          value: (nit.value || '') as string,
          status: (nit.status || 'active') as string,
          category: (nit.category || '') as string,
          downloadUrl: (nit.downloadUrl || '') as string,
          contactInfo: (nit.contactInfo || {
            officer: '',
            phone: '',
            email: ''
          }) as { officer: string; phone: string; email: string },
          location: (nit.location || '') as string,
          imageUrl: nit.imageUrl as string, // Keep the imageUrl from API
          date: (nit.date || nit.createdAt) as string,
          createdAt: nit.createdAt as string,
          updatedAt: nit.updatedAt as string
        }));

        console.log(`Loaded ${transformedNits.length} NITs for homepage`);
        setNits(transformedNits);
      } catch (error) {
        console.error('Error fetching NITs for homepage:', error);
        setError(`Failed to load NITs: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNITs();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
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
    console.error('Homepage NIT section error:', error);
    // Still try to render if we have any data
    if (nits.length === 0) {
      return (
        <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
          <div className="container mx-auto px-4 text-center">
            <div className="py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <p>Unable to load NIT section. Please try refreshing the page.</p>
            </div>
          </div>
        </section>
      );
    }
  }

  if (!isLoading && nits.length === 0) {
    return (
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4 text-center">
          <div className="py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <p>No NIT notices available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <HomepageImageGrid
      title="Notice Inviting Tenders (NIT)"
      subtitle="Official tender notices and procurement announcements"
      items={nits}
      type="nit"
      locale={locale}
      icon={<Clock className="h-8 w-8 text-blue-500" />}
      bgColor="bg-blue-50 dark:bg-blue-900/10"
      linkColor="bg-blue-500 hover:bg-blue-600"
    />
  );
};

export default HomepageNIT;
