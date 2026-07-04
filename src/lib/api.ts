// Simple server-side API fetcher for Next.js
import type { Article } from '@/services/articles';
import type { NIT } from '@/services/nit';

interface QuickRead {
  id: string;
  title: string;
  excerpt: string;
  readTime: number;
  publishedAt: string;
}

interface Highlight {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface YouTubeShort {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  duration: string;
  views: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Simple fetch with error handling and rate limiting
async function fetchAPI<T>(endpoint: string, retries = 3): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes to reduce API calls
        headers: {
          'Cache-Control': 'max-age=300',
        },
      });

      if (response.status === 429) {
        // Rate limit hit, wait before retrying
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.warn(`Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText} for ${endpoint}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Fetch error (attempt ${attempt}/${retries}):`, error);
      if (attempt === retries) {
        return null;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return null;
}

// Server-side data fetchers (for SEO)
export async function getArticles(limit = 10, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);

  const result = await fetchAPI<{ articles: Article[] }>(`/articles?${params.toString()}`);

  // Return fallback data if API fails
  if (!result) {
    return {
      articles: []
    };
  }

  return result;
}

export async function getTopStories(limit = 4, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);

  const result = await fetchAPI<{ topStories: Article[] }>(`/articles/top-stories?${params.toString()}`);

  // Return fallback data if API fails
  if (!result) {
    return {
      topStories: []
    };
  }

  return result;
}

export async function getBreakingNews(limit = 3, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);

  const result = await fetchAPI<{ breakingNews: Article[] }>(`/articles/breaking?${params.toString()}`);

  if (!result) {
    return { breakingNews: [] };
  }

  return result;
}

export async function getQuickReads(limit = 5, language?: 'ENGLISH' | 'HINDI') {
  const params = new URLSearchParams();
  params.set('limit', limit.toString());
  if (language) params.set('language', language);

  const result = await fetchAPI<{ quickReads: QuickRead[] }>(`/articles/quick-reads?${params.toString()}`);

  if (!result) {
    return { quickReads: [] };
  }

  return result;
}

export async function getHighlights(limit = 6) {
  return await fetchAPI<{ highlights: Highlight[] }>(`/highlights?limit=${limit}`);
}

export async function getArticleBySlug(slug: string) {
  return await fetchAPI<{ article: Article }>(`/articles/slug/${slug}`);
}

export async function getYouTubeShorts(limit = 10) {
  return await fetchAPI<{ shorts: YouTubeShort[] }>(`/youtube/shorts?limit=${limit}`);
}

export async function getNit(limit = 6) {
  return await fetchAPI<{ nits: NIT[] }>(`/nit?limit=${limit}`);
}

export async function getNewsByCategory(
  categorySlug: string,
  page = 1,
  limit = 12,
  language?: 'ENGLISH' | 'HINDI'
) {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());
  if (language) params.set('language', language);

  const result = await fetchAPI<{
    success: boolean;
    articles: Article[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    category?: any;
  }>(`/articles/category/${categorySlug}?${params.toString()}`);

  if (!result) return null;

  return {
    articles: result.articles,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    totalCount: result.totalCount,
  };
}

export async function getCategories() {
  return await fetchAPI<{ categories: Category[] }>('/categories?active=true');
}
