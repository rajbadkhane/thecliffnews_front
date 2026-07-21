import { getArticleUrl } from '@/lib/slug';
import { getRecentNewsArticles } from '@/lib/seo-api';
import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.thecliffnews.in';
const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;

export const revalidate = 300;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getLocale(language: string): 'en' | 'hi' | null {
  if (language === 'ENGLISH') return 'en';
  if (language === 'HINDI') return 'hi';
  return null;
}

export async function GET(): Promise<NextResponse> {
  try {
    const articles = await getRecentNewsArticles();
    const now = Date.now();
    const cutoff = now - NEWS_WINDOW_MS;
    const seenUrls = new Set<string>();
    const entries: string[] = [];

    for (const article of articles) {
      if (article.status && article.status !== 'PUBLISHED') continue;

      const locale = getLocale(article.language);
      if (!locale) continue;

      const publishedDate = new Date(article.publishedAt);
      const publishedTime = publishedDate.getTime();
      if (Number.isNaN(publishedTime) || publishedTime < cutoff || publishedTime > now) continue;

      const url = `${BASE_URL}${getArticleUrl(locale, article)}`;
      if (seenUrls.has(url)) continue;
      seenUrls.add(url);

      entries.push(`
  <url>
    <loc>${escapeXml(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml('The Cliff News')}</news:name>
        <news:language>${escapeXml(article.language === 'ENGLISH' ? 'en' : 'hi')}</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(publishedDate.toISOString())}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`);

      if (entries.length >= 1000) break;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>${entries.join('')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error generating News sitemap:', error);
    return new NextResponse('Unable to generate News sitemap', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
