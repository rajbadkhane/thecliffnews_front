'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Images } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import MasonryImageGrid from '@/components/MasonryImageGrid';
import type { ImageItem } from '@/components/MasonryImageGrid';

interface HighlightData {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  category: string;
  date?: string;
  createdAt?: string;
  allowDownload?: boolean;
  allowSharing?: boolean;
  viewCount?: number;
  downloadCount?: number;
  shareCount?: number;
}

interface MasonryHighlightsProps {
  className?: string;
}

const MasonryHighlights: React.FC<MasonryHighlightsProps> = ({ className = '' }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string || 'en';
  const page = parseInt(searchParams.get('page') || '1');

  const [highlights, setHighlights] = useState<ImageItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/highlights?page=${page}&limit=20`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch highlights');
        }

        const data = await response.json();

        // Transform API data to ImageItem format
        const transformedHighlights: ImageItem[] = (data.highlights || []).map((highlight: HighlightData) => ({
          id: highlight.id,
          title: highlight.title,
          imageUrl: highlight.imageUrl,
          caption: highlight.caption,
          category: highlight.category,
          date: highlight.date || highlight.createdAt,
          allowDownload: highlight.allowDownload !== false,
          allowSharing: highlight.allowSharing !== false,
          viewCount: highlight.viewCount || 0,
          downloadCount: highlight.downloadCount || 0,
          shareCount: highlight.shareCount || 0,
        }));

        setHighlights(transformedHighlights);
        setPagination(data.pagination || {
          page: 1,
          limit: 20,
          total: transformedHighlights.length,
          pages: 1
        });
      } catch (error) {
        console.error('Error fetching highlights:', error);
        setError('Failed to load highlights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    const locale = params?.locale || 'en';
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', newPage.toString());
    router.push(`/${locale}/highlights?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className={`container mx-auto px-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl">
              <div className="aspect-[3/4] rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`container mx-auto px-4 text-center py-12 ${className}`}>
        <div className="p-4 bg-muted/30 rounded-lg inline-block mb-4">
          <Images className="h-12 w-12 text-muted-foreground mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">Error loading highlights</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 ${className}`}>
      {highlights.length > 0 ? (
        <>
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/${locale}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Images className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">News Highlights</h1>
                <p className="text-muted-foreground">
                  Visual highlights from The Cliff News - {highlights.length} images
                </p>
              </div>
            </div>
          </div>

          {/* Masonry Grid */}
          <MasonryImageGrid
            images={highlights}
            columns={4}
            className="mb-12"
            showMetadata={true}
          />

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Page */}
              {pagination.page > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
              )}

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.pages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* Next Page */}
              {pagination.page < pagination.pages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/30 rounded-lg inline-block mb-4">
            <Images className="h-12 w-12 text-muted-foreground mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">No highlights found</h2>
          <p className="text-muted-foreground mb-6">
            There are no highlights available at the moment.
          </p>
          <Button onClick={() => router.push(`/${locale}`)}>
            Browse Latest News
          </Button>
        </div>
      )}
    </div>
  );
};

export default MasonryHighlights;