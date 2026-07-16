import ScrollingTicker from "./ScrollingTicker";
import EnhancedHeroSection from "./EnhancedHeroSection";
import NewsCard from "./NewsCard";
import QuickReadsSection from "./QuickReadsSection";
import DynamicCategorySections from "./DynamicCategorySections";
import VideoSection from "./VideoSection";

import HoroscopeSection from "./HoroscopeSection";
import StreamlinedEPaperSection from "./StreamlinedEPaperSection";
import {
  getArticles,
  getTopStories,
  // getBreakingNews,
  // getQuickReads,
} from "@/lib/api";
import type { Article } from "@/services/articles";

const Homepage = async ({ locale = "en" }: { locale?: string }) => {
  // Convert locale to backend language format
  const language = locale === "hi" ? "HINDI" : "ENGLISH";

  // Fetch critical data first
  const articlesData = await getArticles(10, language);
  const topStoriesData = await getTopStories(6, language);

  // Then fetch less critical data with error fallbacks
  // const settledResults = await Promise.allSettled([
  //   getQuickReads(5, language),
  //   getBreakingNews(3, language),
  // ]);

  // const quickReadsData =
  //   settledResults[0].status === "fulfilled" ? settledResults[0].value : null;
  // const breakingNewsData =
  //   settledResults[1].status === "fulfilled" ? settledResults[1].value : null;

  console.log("Current locale:", locale, "Language:", language);

  // Filter articles by category for hero section
  const articles: Article[] = articlesData?.articles || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Live Market Ticker */}
      <ScrollingTicker />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection featuredArticles={articles} locale={locale} />

      {/* Top Stories - Full Width */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Top Stories
              </h2>
              <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-3">
                The most important news happening right now
              </p>
            </div>
          </div>

          {/* Enhanced Top Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(topStoriesData?.topStories || []).map((article) => (
              <NewsCard key={article.id} article={article} variant="featured" locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Breaking News Banner */}
      {/* {breakingNewsData?.breakingNews && breakingNewsData.breakingNews.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-red-600 to-red-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold mr-4 animate-pulse">
                  🚨 BREAKING
                </span>
                <h2 className="text-white text-xl font-bold">Latest Breaking News</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(breakingNewsData?.breakingNews || []).slice(0, 3).map((article: Article) => (
                <div key={article.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <Link
                    href={`/${locale}/article/${article.slug}`}
                    className="text-white/80 hover:text-white text-xs inline-flex items-center"
                  >
                    Read more <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* E-Paper Section */}
      <StreamlinedEPaperSection />

      {/* Quick Reads Section */}
      <QuickReadsSection locale={locale} />

      {/* Horoscope Section */}
      <HoroscopeSection />
      {/* Dynamic Category Sections - All Categories */}
      <DynamicCategorySections
        language={language}
        excludeCategories={[]} // Show all categories
        locale={locale}
      />

      {/* Video Bytes Section */}
      <VideoSection
        title="Video Bytes"
        subtitle="News in motion - quick video updates"
      />

      {/* News Highlights Section */}
      {/* <HomepageHighlights locale={locale} /> */}

      {/* Notice Inviting Tenders (NIT) Section */}
      {/* <HomepageNIT locale={locale} /> */}
    </div>
  );
};

export default Homepage;
