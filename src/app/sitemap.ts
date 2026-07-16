import { MetadataRoute } from 'next';
import { getArticles, getCategories } from '@/lib/api';
import { getArticleUrl } from '@/lib/slug';

const BASE_URL = 'https://www.thecliffnews.in';

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
      lastModified: new Date(),
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
      lastModified: new Date(),
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
      lastModified: new Date(),
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
      lastModified: new Date(),
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
      lastModified: new Date(),
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
      lastModified: new Date(),
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

  // 3. Fetch published articles dynamically (up to 1000 per language)
  try {
    const [enArticlesRes, hiArticlesRes] = await Promise.all([
      getArticles(1000, 'ENGLISH').catch(() => null),
      getArticles(1000, 'HINDI').catch(() => null),
    ]);

    const enArticles = enArticlesRes?.articles || [];
    const hiArticles = hiArticlesRes?.articles || [];

    // English articles
    for (const article of enArticles) {
      if (article.slug && article.status === 'PUBLISHED') {
        sitemapEntries.push({
          url: `${BASE_URL}${getArticleUrl('en', article)}`,
          lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }

    // Hindi articles
    for (const article of hiArticles) {
      if (article.slug && article.status === 'PUBLISHED') {
        sitemapEntries.push({
          url: `${BASE_URL}${getArticleUrl('hi', article)}`,
          lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  return sitemapEntries;
}
