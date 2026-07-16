"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsCard from "./NewsCard";
import type { Article } from "@/services";
import { useLocale } from "next-intl";

interface EnhancedCategorySectionProps {
  title: string;
  articles: Article[];
  layout?: "hero" | "grid" | "featured";
  showViewAll?: boolean;
  backgroundColor?: "default" | "muted" | "accent";
  maxArticles?: number;
  categorySlug?: string;
  locale?: string;
}

const EnhancedCategorySection = ({
  title,
  articles,
  layout = "grid",
  showViewAll = true,
  backgroundColor = "default",
  maxArticles = 5,
  categorySlug,
  locale: propLocale,
}: EnhancedCategorySectionProps) => {
  const nextIntlLocale = useLocale();
  const locale = propLocale || nextIntlLocale;
  const backgroundClasses = {
    default: "",
    muted: "bg-muted/30",
    accent: "bg-gradient-to-br from-primary/5 to-accent/10",
  };

  // Dynamic category theming using backend category color
  const getCategoryTheme = () => {
    // Default icon mapping for common categories
    const iconMap: Record<string, string> = {
      politics: "🏛️",
      entertainment: "🎬",
      sports: "⚽",
      technology: "💻",
      business: "💼",
      science: "🔬",
      lifestyle: "✨",
      travel: "✈️",
      health: "🏥",
      education: "📚",
      environment: "🌱",
      food: "🍽️",
      fashion: "👗",
      automotive: "🚗",
      finance: "💰",
      gaming: "🎮",
      music: "🎵",
      art: "🎨",
      default: "📰",
    };

    // Get icon based on category name or use default
    const categoryKey = title.toLowerCase().replace(/\s+/g, "");
    const icon = iconMap[categoryKey] || iconMap.default;

    // Use category color from articles if available, otherwise use default
    const categoryColor = articles[0]?.category?.color;

    if (categoryColor) {
      // Convert hex color to text and background classes
      return {
        color: `text-primary`,
        bgColor: `bg-primary/5`,
        icon,
        customStyle: {
          "--category-color": categoryColor,
          color: categoryColor,
        },
      };
    }

    // Fallback to default theme
    return {
      color: "text-primary",
      bgColor: "bg-primary/5",
      icon,
      customStyle: {},
    };
  };

  // const categoryTheme = getCategoryTheme();
  const displayArticles = articles.slice(0, maxArticles);

  if (displayArticles.length === 0) return null;

  const renderHeroLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Featured Article */}
      <div className="lg:col-span-1">
        <NewsCard article={displayArticles[0]} variant="featured" locale={locale} />
      </div>

      {/* Secondary Articles */}
      <div className="space-y-6">
        {displayArticles.slice(1, maxArticles).map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" locale={locale} />
        ))}
      </div>
    </div>
  );

  const renderFeaturedLayout = () => (
    <div className="grid grid-cols-1 gap-8">
      {/* Hero Article */}
      <div className="lg:col-span-2">
        <NewsCard article={displayArticles[0]} variant="featured" locale={locale} />
      </div>

      {/* Supporting Articles */}
      {displayArticles.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.slice(1, maxArticles).map((article) => (
            <NewsCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayArticles.map((article) => (
        <NewsCard key={article.id} article={article} variant="dw-style" locale={locale} />
      ))}
    </div>
  );

  return (
    <section className={`py-12 ${backgroundClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4">
        {/* Simple DW-style Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>

          {showViewAll && displayArticles.length > 0 && (
            <Link
              href={`/${locale}/category/${
                categorySlug || title.toLowerCase()
              }`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {/* Dynamic Layout Rendering */}
        {layout === "hero" && renderHeroLayout()}
        {layout === "featured" && renderFeaturedLayout()}
        {layout === "grid" && renderGridLayout()}

        {/* Mobile View All Button */}
        {showViewAll && displayArticles.length > 0 && (
          <div className="flex justify-center mt-12 lg:hidden">
            <Link
              href={`/${locale}/category/${
                categorySlug || title.toLowerCase()
              }`}
            >
              <Button variant="outline" className="group">
                View All {title}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedCategorySection;
