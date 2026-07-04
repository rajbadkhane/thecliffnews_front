"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EPaperThumbnail from "./EPaperThumbnail";
import { epapersApi } from "@/services";
import { Button } from "@/components/ui/button";
import AppDownloadModal from "./AppDownloadModal";

// In-browser PDF viewer is gated behind the mobile app for now.
// Keep these commented so re-enable is a one-line revert.
// import dynamic from "next/dynamic";
// const EPaperViewerModal = dynamic(() => import("./EPaperViewerModal"), {
//   ssr: false,
// });

interface EPaperDisplay {
  language: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  date: Date;
  title: string;
}

const StreamlinedEPaperSection = () => {
  const [appModalOpen, setAppModalOpen] = useState(false);
  // const [isViewerOpen, setIsViewerOpen] = useState(false); // re-enable with EPaperViewerModal
  // const [selectedPaper, setSelectedPaper] = useState<EPaperDisplay | null>(null);
  const [mounted, setMounted] = useState(false);
  const [englishPaper, setEnglishPaper] = useState<EPaperDisplay | null>(null);
  const [hindiPaper, setHindiPaper] = useState<EPaperDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const fetchEPapers = async () => {
      try {
        setError(null);

        // Fetch English e-paper
        const englishResponse = await epapersApi.getTodayEPaper('english');
        if (englishResponse.data) {
          setEnglishPaper({
            language: "English",
            pdfUrl: englishResponse.data.pdfUrl,
            thumbnailUrl: englishResponse.data.thumbnailUrl,
            date: new Date(englishResponse.data.date),
            title: englishResponse.data.title,
          });
        }

        // Fetch Hindi e-paper
        const hindiResponse = await epapersApi.getTodayEPaper('hindi');
        if (hindiResponse.data) {
          setHindiPaper({
            language: "हिंदी",
            pdfUrl: hindiResponse.data.pdfUrl,
            thumbnailUrl: hindiResponse.data.thumbnailUrl,
            date: new Date(hindiResponse.data.date),
            title: hindiResponse.data.title,
          });
        }
      } catch (err: any) {
        console.error("Error fetching e-papers:", err);
        setError("Unable to load today's e-papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEPapers();
  }, []);

  const handleEPaperClick = () => {
    setAppModalOpen(true);
  };

  // Original viewer handlers — restore alongside EPaperViewerModal when re-enabling.
  // const handleEPaperClick = (paper: EPaperDisplay) => {
  //   setSelectedPaper(paper);
  //   setIsViewerOpen(true);
  // };
  // const handleCloseViewer = () => {
  //   setIsViewerOpen(false);
  //   setSelectedPaper(null);
  // };

  const handleShare = (paper: EPaperDisplay) => {
    const formattedDate = paper.date.toLocaleDateString(
      paper.language === "English" ? "en-US" : "hi-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    const message =
      paper.language === "English"
        ? `📰 *The Cliff News - English Edition*\n📅 ${formattedDate}\n\nRead today's digital newspaper:\n${window.location.origin}/en/epaper\n\n#TheCliffNews #EPaper #News`
        : `📰 *द क्लिफ न्यूज़ - हिंदी संस्करण*\n📅 ${formattedDate}\n\nआज का डिजिटल अखबार पढ़ें:\n${window.location.origin}/en/epaper\n\n#TheCliffNews #EPaper #समाचार`;

    // WhatsApp share
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Try native share API first, fallback to WhatsApp
    if (navigator.share) {
      navigator
        .share({
          title:
            paper.language === "English"
              ? `The Cliff News - ${formattedDate}`
              : `द क्लिफ न्यूज़ - ${formattedDate}`,
          text: message,
          url: `${window.location.origin}/en/epaper`,
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.log("Share failed, opening WhatsApp:", error);
            window.open(whatsappUrl, "_blank");
          }
        });
    } else {
      // Fallback to WhatsApp
      window.open(whatsappUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Today&apos;s Digital E-Paper
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || (!englishPaper && !hindiPaper)) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Today&apos;s Digital E-Paper
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {error || "No e-papers available"}
            </h3>
            <p className="text-muted-foreground mb-6">
              Please check back later or visit our archive page.
            </p>
            <Link
              href="/en/epaper"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View Archive
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Today&apos;s Digital E-Paper
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
          </div>

          {/* E-Paper Thumbnails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* English Edition */}
            {englishPaper && (
              <div className="flex flex-col items-center group">
                {/* Edition Info - Above Thumbnail */}
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    English Edition
                  </h3>
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <p className="text-sm">
                      {mounted
                        ? englishPaper.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Thumbnail - No background, clean shadow */}
                <div
                  className="group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  onClick={() => handleEPaperClick()} /* was: handleEPaperClick(englishPaper) */
                >
                  {englishPaper.thumbnailUrl ? (
                    <div className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                      <Image
                        src={englishPaper.thumbnailUrl}
                        alt="English E-Paper First Page"
                        width={420}
                        height={594}
                        className="w-full h-auto"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                      <EPaperThumbnail
                        pdfUrl={englishPaper.pdfUrl}
                        width={420}
                        height={594}
                        className=""
                        alt="English E-Paper First Page"
                      />
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(englishPaper);
                  }}
                  className="mt-4 gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            )}

            {/* Hindi Edition */}
            {hindiPaper && (
              <div className="flex flex-col items-center group">
                {/* Edition Info - Above Thumbnail */}
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    हिंदी संस्करण
                  </h3>
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <p className="text-sm">
                      {mounted
                        ? hindiPaper.date.toLocaleDateString("hi-IN", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Loading..."}
                    </p>
                  </div>
                </div>

                {/* Thumbnail - No background, clean shadow */}
                <div
                  className="group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  onClick={() => handleEPaperClick()} /* was: handleEPaperClick(hindiPaper) */
                >
                  {hindiPaper.thumbnailUrl ? (
                    <img
                      src={hindiPaper.thumbnailUrl}
                      alt="Hindi E-Paper First Page"
                      className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  ) : (
                    <div className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
                      <EPaperThumbnail
                        pdfUrl={hindiPaper.pdfUrl}
                        width={420}
                        height={594}
                        className=""
                        alt="Hindi E-Paper First Page"
                      />
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(hindiPaper);
                  }}
                  className="mt-4 gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  साझा करें
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* App-download modal — replaces in-browser PDF viewing. */}
      <AppDownloadModal
        open={appModalOpen}
        onOpenChange={setAppModalOpen}
        variant="epaper"
      />

      {/* Original in-browser PDF viewer — re-enable when web reading returns.
      {selectedPaper && (
        <EPaperViewerModal
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          pdfUrl={selectedPaper.pdfUrl}
          title={selectedPaper.title}
        />
      )}
      */}
    </>
  );
};

export default StreamlinedEPaperSection;
