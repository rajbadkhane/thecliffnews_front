"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Eye,
  Download,
  Share2,
  Heart,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { formatTimeAgo } from "@/lib/formatTimeAgo";

interface Highlight {
  id: string;
  title: string;
  image?: string;
  publishedAt: string;
  viewCount?: number;
  shareCount?: number;
  likeCount?: number;
  isBreaking?: boolean;
  category?: {
    name: string;
  };
}

interface HighlightsSectionProps {
  highlights: Highlight[];
  limit?: number;
  showViewAll?: boolean;
}

const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  highlights,
  limit = 6,
  showViewAll = true,
}) => {
  const locale = useLocale();

  const getPriorityBadge = (isBreaking: boolean) => {
    if (isBreaking) {
      return (
        <Badge variant="destructive" className="animate-pulse">
          🔥 Breaking
        </Badge>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => formatTimeAgo(dateString);

  const formatNumber = (num: number | undefined) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="headline-medium text-brand-navy mb-2">
              📸 Latest Highlights
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full"></div>
            <p className="body-medium text-muted-foreground mt-2">
              Visual stories that matter most
            </p>
          </div>

          {showViewAll && (
            <Button variant="outline" className="group" asChild>
              <Link href={`/${locale}/highlights`}>
                View All Highlights
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>

        {/* Breaking News Highlight */}
        {highlights.find((h) => h.isBreaking) && (
          <div className="mb-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={highlights.find((h) => h.isBreaking)?.image || '/api/placeholder/800/400'}
                  alt={highlights.find((h) => h.isBreaking)?.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="animate-pulse">
                    🔥 Breaking News
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                    {highlights.find((h) => h.isBreaking)?.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(
                          highlights.find((h) => h.isBreaking)?.publishedAt ||
                            ""
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>
                        {formatNumber(
                          highlights.find((h) => h.isBreaking)?.viewCount || 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights
            .filter((h) => !h.isBreaking)
            .slice(0, limit - (highlights.find((h) => h.isBreaking) ? 1 : 0))
            .map((highlight) => (
              <Card
                key={highlight.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={highlight.image || '/api/placeholder/400/300'}
                    alt={highlight.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Priority Badge */}
                  {highlight.isBreaking && (
                    <div className="absolute top-3 left-3">
                      {getPriorityBadge(highlight.isBreaking)}
                    </div>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-semibold">View Details</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {highlight.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(highlight.publishedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(highlight.viewCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{formatNumber(highlight.shareCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{formatNumber(highlight.likeCount)}</span>
                      </div>
                    </div>

                    <Badge variant="outline">
                      {highlight.category?.name || "Uncategorized"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* View All Button for Mobile */}
        {showViewAll && (
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="group" asChild>
              <Link href={`/${locale}/highlights`}>
                View All Highlights
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HighlightsSection;