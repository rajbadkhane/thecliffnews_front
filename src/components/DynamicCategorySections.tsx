"use client";

import { useState, useEffect } from "react";
import EnhancedCategorySection from "./EnhancedCategorySection";
import type { Article } from "@/services/articles";

interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

interface DynamicCategorySectionsProps {
  language: "ENGLISH" | "HINDI";
  excludeCategories?: string[];
  locale?: string;
}

interface CategoryWithArticles {
  category: Category;
  articles: Article[];
}

const DynamicCategorySections = ({
  language,
  excludeCategories = [],
  locale,
}: DynamicCategorySectionsProps) => {
  const [categoriesWithArticles, setCategoriesWithArticles] = useState<
    CategoryWithArticles[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesAndArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both categories and articles in parallel for better performance
        const [categoriesResponse, articlesResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/categories?active=true`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/articles?limit=100&language=${language}`
          ),
        ]);

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        if (!articlesResponse.ok) {
          throw new Error("Failed to fetch articles");
        }

        const [categoriesData, articlesData] = await Promise.all([
          categoriesResponse.json(),
          articlesResponse.json(),
        ]);

        const categories = categoriesData?.categories || [];
        const allArticles = articlesData?.articles || [];

        // Filter out excluded categories
        const filteredCategories = categories.filter(
          (category: Category) => !excludeCategories.includes(category.slug)
        );

        // Group articles by category
        const articlesByCategory = new Map<string, Article[]>();

        allArticles.forEach((article: Article) => {
          if (article.category?.slug) {
            const categorySlug = article.category.slug;
            if (!articlesByCategory.has(categorySlug)) {
              articlesByCategory.set(categorySlug, []);
            }
            articlesByCategory.get(categorySlug)!.push(article);
          }
        });

        // Create category-article pairs, only including categories with articles
        const categoriesWithValidArticles: CategoryWithArticles[] =
          filteredCategories
            .map((category: Category) => {
              // Fetch 7 articles for all categories (hero layout needs 7)
              const maxArticles = 7;
              return {
                category,
                articles: (articlesByCategory.get(category.slug) || []).slice(
                  0,
                  maxArticles
                ),
              };
            })
            .filter(
              ({ articles }: { articles: Article[] }) => articles.length > 0
            );

        console.log(
          `Loaded ${categoriesWithValidArticles.length} categories with articles`
        );
        setCategoriesWithArticles(categoriesWithValidArticles);
      } catch (error) {
        console.error("Error fetching categories and articles:", error);
        setError(`Failed to load categories: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndArticles();
  }, [language, excludeCategories]);

  if (isLoading) {
    return (
      <div className="space-y-16">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Categories section error:", error);
    // Still try to render if we have any data
    if (categoriesWithArticles.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          <p>
            Unable to load category sections. Please try refreshing the page.
          </p>
        </div>
      );
    }
  }

  if (!isLoading && categoriesWithArticles.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No category articles available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {categoriesWithArticles.map(({ category, articles }, index) => {
        // Alternate between different layouts and backgrounds for visual variety
        const layouts = ["grid", "featured", "hero"] as const;
        const backgrounds = ["default", "muted", "accent"] as const;

        // Custom layout assignment for specific categories
        let layout = layouts[index % layouts.length];
        const categorySlug = category.slug.toLowerCase();
        let maxArticles = 6;

        if (categorySlug === "entertainment") {
          layout = "featured";
          maxArticles = 7;
        } else if (categorySlug === "sports") {
          layout = "featured";
        } else if (categorySlug === "education") {
          layout = "grid";
        } else if (categorySlug === "business") {
          layout = "featured";
        }
        // Hero and Featured layouts always need 7 articles
        if (layout === "hero" || layout === "featured") {
          maxArticles = 7;
        }

        const backgroundColor = backgrounds[index % backgrounds.length];

        return (
          <EnhancedCategorySection
            key={category.id}
            title={category.name}
            articles={articles}
            layout={layout}
            backgroundColor={backgroundColor}
            categorySlug={category.slug}
            maxArticles={maxArticles}
            locale={locale}
          />
        );
      })}
    </div>
  );
};

export default DynamicCategorySections;
