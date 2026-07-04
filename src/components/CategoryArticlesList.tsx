"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import NewsCard from "@/components/NewsCard";
import type { Article } from "@/services/articles";
import { Loader2 } from "lucide-react";

interface CategoryArticlesListProps {
  initialArticles: Article[];
  categorySlug: string;
  totalPages: number;
  locale: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CategoryArticlesList({
  initialArticles,
  categorySlug,
  totalPages,
  locale,
}: CategoryArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;
    const language = locale === "hi" ? "HINDI" : "ENGLISH";

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/articles/category/${categorySlug}?page=${nextPage}&limit=12&language=${language}`
      );
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const newArticles = data.articles || [];

      if (newArticles.length > 0) {
        setArticles((prev) => [...prev, ...newArticles]);
        setPage(nextPage);
      }

      if (nextPage >= data.totalPages || newArticles.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, categorySlug, locale]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, hasMore, loading]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article: Article) => (
          <NewsCard key={article.id} article={article} variant="default" />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading more articles...</span>
          </div>
        )}
        {!hasMore && articles.length > 0 && (
          <p className="text-sm text-muted-foreground">
            You&apos;ve reached the end
          </p>
        )}
      </div>
    </>
  );
}
