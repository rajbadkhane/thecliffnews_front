import { MetadataRoute } from 'next';
import { getCategories } from '@/lib/api';
import { getArticleUrl } from '@/lib/slug';
import { getAllSeoArticles, type SeoArticle } from '@/lib/seo-api';

const BASE_URL = 'https://www.thecliffnews.in';
const LANGUAGE_TO_LOCALE = {
  ENGLISH: 'en',
  HINDI: 'hi',
} as const;

export const revalidate = 300;

type Locale = keyof typeof LANGUAGE_TO_LOCALE;

function getArticleLocale(language: string): 'en' | 'hi' | null {
  if (language === 'ENGLISH') return 'en';
  if (language === 'HINDI') return 'hi';
  return null;
}

function articleUrl(article: SeoArticle, locale: 'en' | 'hi'): string {
  return `${BASE_URL}${getArticleUrl(locale, article)}`;
}

function buildArticleAlternates(
  article: SeoArticle,
  articlesById: Map<string, SeoArticle>,
  articlesByKey: Map<string, SeoArticle>,
  childrenBySourceId: Map<string, SeoArticle[]>
): { en?: string; hi?: string; 'x-default'?: string } {
  const locale = getArticleLocale(article.language);
  if (!locale) return {};

  const languages: { en?: string; hi?: string; 'x-default'?: string } = {
    [locale]: articleUrl(article, locale),
  };
  const alternateLanguage = locale === 'en' ? 'HINDI' : 'ENGLISH';

  const translation = article.translations.find(
    (candidate) => candidate.language === alternateLanguage && candidate.status === 'PUBLISHED'
  );
  let alternateArticle = translation
    ? articlesByKey.get(`${alternateLanguage}:${translation.slug}`)
    : undefined;

  if (!alternateArticle && article.sourceArticleId) {
    const sourceArticle = articlesById.get(article.sourceArticleId);
    if (sourceArticle?.language === alternateLanguage && sourceArticle.status === 'PUBLISHED') {
      alternateArticle = sourceArticle;
    }
  }

  if (!alternateArticle) {
    alternateArticle = childrenBySourceId
      .get(article.id)
      ?.find((candidate) => candidate.language === alternateLanguage && candidate.status === 'PUBLISHED');
  }

  if (alternateArticle) {
    languages[alternateLanguage === 'ENGLISH' ? 'en' : 'hi'] = articleUrl(
      alternateArticle,
      alternateLanguage === 'ENGLISH' ? 'en' : 'hi'
    );
  }

  const englishUrl = languages.en;
  if (englishUrl) {
    languages['x-default'] = englishUrl;
  }

  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/subscribe',
    '/privacy',
    '/terms',
    '/epaper',
    '/highlights',
    '/quick-reads',
    '/videos',
    '/inshorts',
    '/book-advertisement',
    '/nit',
    '/download',
  ];

  const videoCategories = [
    'business',
    'politics',
    'sports',
    'entertainment',
    'national',
    'technology',
    'health',
    'science'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static pages for both en and hi with dynamic alternates
  for (const page of staticPages) {
    sitemapEntries.push({
      url: `${BASE_URL}/en${page}`,
      changeFrequency: 'daily',
      priority: page === '' ? 1.0 : 0.7,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${page}`,
          hi: `${BASE_URL}/hi${page}`,
        },
      },
    });
    sitemapEntries.push({
      url: `${BASE_URL}/hi${page}`,
      changeFrequency: 'daily',
      priority: page === '' ? 1.0 : 0.7,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${page}`,
          hi: `${BASE_URL}/hi${page}`,
        },
      },
    });
  }

  // 1.5 Video category pages
  for (const category of videoCategories) {
    sitemapEntries.push({
      url: `${BASE_URL}/en/videos/category/${category}`,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/videos/category/${category}`,
          hi: `${BASE_URL}/hi/videos/category/${category}`,
        },
      },
    });
    sitemapEntries.push({
      url: `${BASE_URL}/hi/videos/category/${category}`,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/videos/category/${category}`,
          hi: `${BASE_URL}/hi/videos/category/${category}`,
        },
      },
    });
  }

  // 2. Fetch active categories dynamically, fallback to hardcoded list on failure
  let categoriesList = [
    'national',
    'international',
    'politics',
    'business',
    'sports',
    'entertainment',
    'technology',
    'health',
    'science',
    'lifestyle',
  ];

  try {
    const catsData = await getCategories();
    if (catsData?.categories && catsData.categories.length > 0) {
      categoriesList = catsData.categories.map(c => c.slug);
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  for (const catSlug of categoriesList) {
    sitemapEntries.push({
      url: `${BASE_URL}/en/category/${catSlug}`,
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/category/${catSlug}`,
          hi: `${BASE_URL}/hi/category/${catSlug}`,
        },
      },
    });
    sitemapEntries.push({
      url: `${BASE_URL}/hi/category/${catSlug}`,
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/en/category/${catSlug}`,
          hi: `${BASE_URL}/hi/category/${catSlug}`,
        },
      },
    });
  }

  // 3. Fetch every published article from the lightweight SEO endpoint.
  let seoArticles: SeoArticle[];
  try {
    seoArticles = await getAllSeoArticles();
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    throw new Error('Unable to generate article sitemap entries');
  }

  const articlesById = new Map(seoArticles.map((article) => [article.id, article]));
  const articlesByKey = new Map(
    seoArticles.map((article) => [`${article.language.toUpperCase()}:${article.slug}`, article])
  );
  const childrenBySourceId = new Map<string, SeoArticle[]>();
  for (const article of seoArticles) {
    if (!article.sourceArticleId) continue;
    const children = childrenBySourceId.get(article.sourceArticleId) || [];
    children.push(article);
    childrenBySourceId.set(article.sourceArticleId, children);
  }

  const articleUrls = new Set<string>();
  for (const article of seoArticles) {
    if (article.status !== 'PUBLISHED' || !article.slug) continue;

    const locale = getArticleLocale(article.language);
    if (!locale) {
      console.warn(`Skipping sitemap article with unsupported language: ${article.slug}`);
      continue;
    }

    const publishedDate = new Date(article.publishedAt);
    if (Number.isNaN(publishedDate.getTime())) {
      console.warn(`Skipping sitemap article with invalid publishedAt: ${article.slug}`);
      continue;
    }

    const url = articleUrl(article, locale);
    if (articleUrls.has(url)) continue;
    articleUrls.add(url);

    sitemapEntries.push({
      url,
      lastModified: publishedDate,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: buildArticleAlternates(article, articlesById, articlesByKey, childrenBySourceId),
      },
    });
  }

  return sitemapEntries;
}
