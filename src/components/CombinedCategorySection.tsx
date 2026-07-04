"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsCard from "./NewsCard";
import type { Article } from "@/services";
import { useLocale } from "next-intl";

interface CombinedCategorySectionProps {
  title: string;
  subtitle?: string;
  categories: {
    name: string;
    articles: Article[];
    color?: string;
  }[];
  backgroundColor?: "default" | "muted" | "accent";
  maxArticlesPerCategory?: number;
}

const CombinedCategorySection = ({
  title,
  subtitle,
  categories,
  backgroundColor = "default",
  maxArticlesPerCategory = 3,
}: CombinedCategorySectionProps) => {
  const locale = useLocale();
  const backgroundClasses = {
    default: "",
    muted: "bg-muted/30",
    accent: "bg-gradient-to-r from-primary/5 to-primary/10",
  };

  // Filter out empty categories
  const activeCategories = categories.filter(cat => cat.articles.length > 0);

  if (activeCategories.length === 0) return null;

  return (
    <section className={`py-16 ${backgroundClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="headline-large text-brand-navy mb-3">{title}</h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
          <div className="w-8 h-1 bg-primary/60 rounded-full mx-auto mt-1"></div>
          {subtitle && (
            <p className="body-large text-muted-foreground mt-4 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className="space-y-16">
          {activeCategories.map((category, index) => (
            <div key={category.name} className="relative">
              {/* Category Divider */}
              {index > 0 && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                </div>
              )}

              {/* Category Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <h3 className="headline-medium text-foreground">{category.name}</h3>
                  <div className={`w-8 h-1 rounded-full ${category.color || 'bg-primary/60'}`}></div>
                </div>

                <Link href={`/${locale}/category/${category.name.toLowerCase()}`}>
                  <Button variant="ghost" size="sm" className="group text-muted-foreground hover:text-primary">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.articles.slice(0, maxArticlesPerCategory).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Overall View All Button */}
        <div className="flex justify-center mt-12">
          <Link href="/categories">
            <Button variant="outline" size="lg" className="group">
              Explore All Categories
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CombinedCategorySection;
