'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Images, Calendar, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import MasonryImageGrid from '@/components/MasonryImageGrid';
import type { ImageItem } from '@/components/MasonryImageGrid';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface HighlightData {
  id: string;
  title: string;
  image: string;
  imageUrl: string;
  link: string;
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

const HighlightsClient = () => {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || 'en';

  const [highlights, setHighlights] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchHighlights = useCallback(async (pageNum: number) => {
    setIsLoading(true);

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/highlights`);
      url.searchParams.set('page', pageNum.toString());
      url.searchParams.set('limit', '20');
      if (startDate) url.searchParams.set('startDate', startDate);
      if (endDate) url.searchParams.set('endDate', endDate);

      const response = await fetch(url.toString());

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

      const pagination = data.pagination || { page: 1, pages: 1 };
      setPage(pageNum);
      setTotalPages(pagination.pages);
    } catch (err) {
      console.error('Error fetching highlights:', err);
      setError('Failed to load highlights');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  // Initial fetch on mount
  useEffect(() => {
    fetchHighlights(1);
  }, [fetchHighlights]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchHighlights(newPage);
  };

  // Handle applying date filter
  const handleApplyFilter = () => {
    setHighlights([]);
    setPage(1);
    fetchHighlights(1);
  };

  // Handle clearing date filter
  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setHighlights([]);
    setPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  if (isLoading && highlights.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Images className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">News Highlights</h1>
                  <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover the most important stories through compelling visuals and curated content
              </p>
            </div>
          </div>
        </section>

        {/* Loading Grid */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl break-inside-avoid mb-4">
                  <div className={i % 2 === 0 ? "aspect-[3/4] rounded-xl" : "aspect-[4/5] rounded-xl"}></div>
                </div>
              ))}
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
        <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Images className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">News Highlights</h1>
                  <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto"></div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover the most important stories through compelling visuals and curated content
              </p>
            </div>
          </div>
        </section>

        {/* Error State */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 text-center">
            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl inline-block mb-6">
              <Images className="h-16 w-16 text-orange-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Error loading highlights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
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
      <section className="py-16 bg-orange-50 dark:bg-orange-900/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Images className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">News Highlights</h1>
                <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover the most important stories through compelling visuals and curated content
            </p>
          </div>
        </div>
      </section>

      {/* Date Filter Bar */}
      <section className="bg-orange-50/50 dark:bg-orange-900/5 border-b border-orange-100 dark:border-orange-900/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Date:</span>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              max={new Date().toISOString().split('T')[0]}
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              max={new Date().toISOString().split('T')[0]}
            />
            <Button
              size="sm"
              onClick={handleApplyFilter}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
            >
              Apply
            </Button>
            {(startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilter}
                className="text-orange-600 text-sm"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {highlights.length > 0 ? (
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

              {/* Loading overlay for page changes */}
              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Loading highlights...</span>
                  </div>
                </div>
              )}

              {/* Masonry Grid */}
              {!isLoading && (
                <MasonryImageGrid
                  images={highlights}
                  columns={4}
                  className="mb-12"
                  showMetadata={false}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(page - 1)}
                          className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {getPageNumbers().map((pageNum, idx) =>
                        pageNum === 'ellipsis' ? (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNum)}
                              isActive={pageNum === page}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(page + 1)}
                          className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl inline-block mb-6">
                <Images className="h-16 w-16 text-orange-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No highlights found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                There are no highlights available at the moment. Please check back later.
              </p>
              <Button
                onClick={() => router.push(`/${locale}`)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
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

export default HighlightsClient;
