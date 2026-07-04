"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2, Globe, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { epapersApi } from "@/services/epapers";
import type { EPaper } from "@/services/epapers";
import EPaperThumbnail from "./EPaperThumbnail";
import AppDownloadModal from "./AppDownloadModal";
// In-browser PDF viewer is gated behind the mobile app for now.
// Keep these imports commented so re-enable is a one-line revert.
// import EPaperViewerModal from "./EPaperViewerModal";
// import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CompactEPaperSection = () => {
  const [epapers, setEpapers] = useState<EPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appModalOpen, setAppModalOpen] = useState(false);
  // const [selectedEpaper, setSelectedEpaper] = useState<EPaper | null>(null); // re-enable with EPaperViewerModal
  const [error, setError] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<'all' | 'english' | 'hindi'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = last 7 days, 1 = previous 7 days, etc.
  const DAYS_PER_PAGE = 7;

  // Calculate date range for display
  const getDateRangeLabel = () => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - (currentWeek * DAYS_PER_PAGE));

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (DAYS_PER_PAGE - 1));

    const formatShort = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (currentWeek === 0) {
      return `Last 7 Days`;
    }

    return `${formatShort(startDate)} - ${formatShort(endDate)}`;
  };

  useEffect(() => {
    const fetchEpapers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // If user selected a specific date, fetch that date's papers
        if (dateFilter) {
          const papers = await epapersApi.getEPapers({
            startDate: dateFilter,
            endDate: dateFilter,
            language: languageFilter === 'all' ? undefined : languageFilter,
            sortBy: 'date',
            sortOrder: 'desc',
            limit: 10,
          });
          setEpapers(papers);
          return;
        }

        // Otherwise, fetch paginated 7-day chunks
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Calculate date range for current page
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() - (currentWeek * DAYS_PER_PAGE));

        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - (DAYS_PER_PAGE - 1));
        startDate.setHours(0, 0, 0, 0);

        // Fetch e-papers from API with date range and language filter
        const papers = await epapersApi.getEPapers({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          language: languageFilter === 'all' ? undefined : languageFilter,
          sortBy: 'date',
          sortOrder: 'desc',
          limit: 100,
        });

        setEpapers(papers);
      } catch (err: any) {
        console.error('Error fetching e-papers:', err);

        // Handle rate limiting error
        if (err?.status === 429) {
          setError('Too many requests. Please wait a few minutes and try again.');
        } else if (err?.message?.includes('fetch')) {
          setError('Unable to connect to server. Please check your internet connection.');
        } else {
          setError('Failed to load e-papers. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpapers();
  }, [currentWeek, languageFilter, dateFilter]);

  // Group e-papers by date (no need to filter - already filtered by API)
  const groupedEpapers = epapers.reduce((acc, epaper) => {
    const dateKey = new Date(epaper.date).toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = { english: null, hindi: null };
    }
    if (epaper.language.toLowerCase() === 'english') {
      acc[dateKey].english = epaper;
    } else {
      acc[dateKey].hindi = epaper;
    }
    return acc;
  }, {} as Record<string, { english: EPaper | null; hindi: EPaper | null }>);

  const sortedDates = Object.keys(groupedEpapers).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const handleShare = (epaper: EPaper) => {
    const formattedDate = new Date(epaper.date).toLocaleDateString(
      epaper.language === 'english' ? 'en-US' : 'hi-IN',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    );

    const message =
      epaper.language === 'english'
        ? `📰 *The Cliff News - English Edition*\n📅 ${formattedDate}\n\nRead the digital newspaper:\n${window.location.origin}/en/epaper\n\n#TheCliffNews #EPaper #News`
        : `📰 *द क्लिफ न्यूज़ - हिंदी संस्करण*\n📅 ${formattedDate}\n\nडिजिटल अखबार पढ़ें:\n${window.location.origin}/en/epaper\n\n#TheCliffNews #EPaper #समाचार`;

    // WhatsApp share
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Try native share API first, fallback to WhatsApp
    if (navigator.share) {
      navigator
        .share({
          title:
            epaper.language === 'english'
              ? `The Cliff News - ${formattedDate}`
              : `द क्लिफ न्यूज़ - ${formattedDate}`,
          text: message,
          url: `${window.location.origin}/en/epaper`,
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.log('Share failed, opening WhatsApp:', error);
            window.open(whatsappUrl, '_blank');
          }
        });
    } else {
      // Fallback to WhatsApp
      window.open(whatsappUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              E-Paper Archive
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse and read digital editions of The Cliff News
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              E-Paper Archive
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse and read digital editions of The Cliff News
            </p>
          </div>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-destructive text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            E-Paper Archive
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse and read digital editions of The Cliff News
          </p>
        </div>

        {/* Filters - Compact */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {/* Language Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                {languageFilter === 'all' ? 'All Languages' :
                 languageFilter === 'english' ? 'English' : 'हिंदी'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                setLanguageFilter('all');
                setCurrentWeek(0);
              }}>
                All Languages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setLanguageFilter('english');
                setCurrentWeek(0);
              }}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setLanguageFilter('hindi');
                setCurrentWeek(0);
              }}>
                हिंदी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentWeek(0);
              }}
              className="w-auto h-9"
            />
          </div>

          {/* Clear Filters */}
          {(languageFilter !== 'all' || dateFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLanguageFilter('all');
                setDateFilter('');
                setCurrentWeek(0);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* E-Papers Grid - Grouped by Date */}
        <div className="space-y-16">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No e-papers available
              </h3>
              <p className="text-muted-foreground">
                Check back later for new editions.
              </p>
            </div>
          ) : (
            sortedDates.map((dateKey) => {
              const { english, hindi } = groupedEpapers[dateKey];
              const { weekday, date } = formatDate(dateKey);

              return (
                <div key={dateKey} className="space-y-8">
                  {/* Date Header */}
                  <div className="text-center border-b border-border pb-4">
                    <h2 className="text-2xl font-bold text-foreground mb-1">{weekday}</h2>
                    <p className="text-muted-foreground">{date}</p>
                  </div>

                  {/* E-Papers for this date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {/* English Edition */}
                    {english && (
                      <div
                        className="flex flex-col items-center group cursor-pointer"
                        onClick={() => setAppModalOpen(true)} /* was: () => setSelectedEpaper(english) */
                      >
                        {/* Edition Info - Above Thumbnail */}
                        <div className="mb-4 text-center">
                          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            English Edition
                          </h3>
                          <div className="flex items-center justify-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <p className="text-sm">{weekday}, {date}</p>
                          </div>
                        </div>

                        {/* Thumbnail - Clean design */}
                        <div className="group-hover:scale-[1.02] transition-transform duration-300">
                          {english.thumbnailUrl ? (
                            <img
                              src={english.thumbnailUrl}
                              alt={`English Edition - ${date}`}
                              className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300"
                              style={{ width: '420px', height: '594px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                              <EPaperThumbnail
                                pdfUrl={english.pdfUrl}
                                width={420}
                                height={594}
                              />
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center gap-3">
                          {/* Download disabled while web reading is gated behind the app.
                          <a
                            href={english.pdfUrl}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                          */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(english);
                            }}
                            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Hindi Edition */}
                    {hindi && (
                      <div
                        className="flex flex-col items-center group cursor-pointer"
                        onClick={() => setAppModalOpen(true)} /* was: () => setSelectedEpaper(hindi) */
                      >
                        {/* Edition Info - Above Thumbnail */}
                        <div className="mb-4 text-center">
                          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            हिंदी संस्करण
                          </h3>
                          <div className="flex items-center justify-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <p className="text-sm">{weekday}, {date}</p>
                          </div>
                        </div>

                        {/* Thumbnail - Clean design */}
                        <div className="group-hover:scale-[1.02] transition-transform duration-300">
                          {hindi.thumbnailUrl ? (
                            <img
                              src={hindi.thumbnailUrl}
                              alt={`Hindi Edition - ${date}`}
                              className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300"
                              style={{ width: '420px', height: '594px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                              <EPaperThumbnail
                                pdfUrl={hindi.pdfUrl}
                                width={420}
                                height={594}
                              />
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center gap-3">
                          {/* Download disabled while web reading is gated behind the app.
                          <a
                            href={hindi.pdfUrl}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            डाउनलोड
                          </a>
                          */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(hindi);
                            }}
                            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            साझा करें
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(currentWeek - 1)}
            disabled={currentWeek === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Newer
          </Button>

          <div className="text-sm text-muted-foreground font-medium">
            {getDateRangeLabel()}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentWeek(currentWeek + 1)}
            disabled={sortedDates.length === 0}
            className="gap-2"
          >
            Older
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* App-download modal — replaces in-browser PDF viewing. */}
      <AppDownloadModal
        open={appModalOpen}
        onOpenChange={setAppModalOpen}
        variant="epaper"
      />

      {/* Original in-browser PDF viewer — re-enable when web reading returns.
      {selectedEpaper && (
        <EPaperViewerModal
          isOpen={!!selectedEpaper}
          onClose={() => setSelectedEpaper(null)}
          pdfUrl={selectedEpaper.pdfUrl}
          title={`${selectedEpaper.language === 'english' ? 'English' : 'हिंदी'} Edition - ${formatDate(selectedEpaper.date).date}`}
        />
      )}
      */}
    </div>
  );
};

export default CompactEPaperSection;
