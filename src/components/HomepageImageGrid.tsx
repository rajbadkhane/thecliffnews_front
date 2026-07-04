"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProtectedThumbnail from "@/components/ProtectedThumbnail";
import AppDownloadModal from "@/components/AppDownloadModal";
import type { ImageItem } from "@/components/MasonryImageGrid";
import type { NIT } from "@/services/nit";

interface HighlightItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

type GridItem = HighlightItem | NIT;

interface HomepageImageGridProps {
  title: string;
  subtitle: string;
  items: GridItem[];
  type: "highlights" | "nit";
  locale: string;
  icon?: React.ReactNode;
  bgColor?: string;
  linkColor?: string;
}

const HomepageImageGrid: React.FC<HomepageImageGridProps> = ({
  title,
  subtitle,
  items,
  type,
  locale,
  icon,
  bgColor = "bg-primary/10",
  linkColor = "bg-primary",
}) => {
  const [appModalOpen, setAppModalOpen] = useState(false);

  const imageItems: ImageItem[] = items.map((item: GridItem) => {
    const isHighlight = "image" in item;

    return {
      id: item.id,
      title: item.title,
      imageUrl: isHighlight
        ? (item as HighlightItem).image
        : (item as NIT).imageUrl || "/api/placeholder/400/300",
      caption: isHighlight ? item.title : (item as NIT).description,
      category: isHighlight ? "highlights" : (item as NIT).category,
      date: isHighlight ? new Date().toISOString() : (item as NIT).createdAt,
      allowDownload: true,
      allowSharing: true,
      viewCount: 0,
      downloadCount: 0,
      shareCount: 0,
    };
  });

  if (!imageItems.length) return null;

  return (
    <>
      <section className={`py-16 ${bgColor}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                {icon && (
                  <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                    {icon}
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h2>
                  <div className="w-16 h-1 bg-current rounded-full opacity-60"></div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
            </div>

            <Link href={`/${locale}/${type}`}>
              <Button
                className={`hidden md:inline-flex items-center ${linkColor} hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-colors group`}
              >
                View All {title}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Pinterest-style Grid Display */}
          <div className="columns-2 md:columns-3 lg:columns-5 gap-4 space-y-4">
            {imageItems.slice(0, 5).map((image) => (
              <div
                key={image.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 break-inside-avoid mb-4"
              >
                <div className="relative overflow-hidden">
                  <ProtectedThumbnail
                    src={image.imageUrl}
                    alt={image.title}
                    onClick={() => setAppModalOpen(true)}
                    imageClassName="h-auto"
                  />

                  {/* Date Badge - Top Left */}
                  <div className="pointer-events-none absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 bg-black/80 text-white text-xs rounded-full backdrop-blur-sm">
                      {new Date(image.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="flex justify-center mt-8 md:hidden">
            <Link href={`/${locale}/${type}`}>
              <Button
                className={`inline-flex items-center ${linkColor} hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-colors group`}
              >
                View All {title}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AppDownloadModal open={appModalOpen} onOpenChange={setAppModalOpen} />
    </>
  );
};

export default HomepageImageGrid;
