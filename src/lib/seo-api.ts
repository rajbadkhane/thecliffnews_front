const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SEO_REVALIDATE_SECONDS = 300;
const SEO_FETCH_TIMEOUT_MS = 15_000;

export interface SeoTranslation {
  slug: string;
  language: string;
  status: string;
}

export interface SeoCategory {
  id?: string;
  name?: string;
  slug?: string;
}

export interface SeoArticle {
  id: string;
  slug: string;
  title: string;
  language: string;
  publishedAt: string;
  updatedAt?: string;
  status: string;
  featuredImage?: string;
  sourceArticleId?: string | null;
  category?: SeoCategory;
  translations: SeoTranslation[];
}

export interface RecentNewsArticle {
  slug: string;
  title: string;
  language: string;
  publishedAt: string;
  updatedAt?: string;
  status?: string;
  category?: SeoCategory;
}

export interface SeoArticlesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SeoArticlesPage {
  articles: SeoArticle[];
  pagination: SeoArticlesPagination;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function readRequiredString(record: UnknownRecord, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function readOptionalString(record: UnknownRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function readOptionalCategory(value: unknown): SeoCategory | undefined {
  if (!isRecord(value)) return undefined;

  return {
    id: readOptionalString(value, 'id'),
    name: readOptionalString(value, 'name'),
    slug: readOptionalString(value, 'slug'),
  };
}

function readTranslations(value: unknown): SeoTranslation[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((translation) => {
    if (!isRecord(translation)) return [];

    const slug = readRequiredString(translation, 'slug');
    const language = readRequiredString(translation, 'language');
    const status = readRequiredString(translation, 'status');

    if (!slug || !language || !status) return [];

    return [{ slug, language, status }];
  });
}

function parseSeoArticle(value: unknown): SeoArticle | null {
  if (!isRecord(value)) return null;

  const id = readRequiredString(value, 'id');
  const slug = readRequiredString(value, 'slug');
  const title = readRequiredString(value, 'title');
  const language = readRequiredString(value, 'language');
  const publishedAt = readRequiredString(value, 'publishedAt');
  const status = readRequiredString(value, 'status');

  if (!id || !slug || !title || !language || !publishedAt || !status) {
    return null;
  }

  const sourceArticleId = value.sourceArticleId;

  return {
    id,
    slug,
    title,
    language,
    publishedAt,
    updatedAt: readOptionalString(value, 'updatedAt'),
    status,
    featuredImage: readOptionalString(value, 'featuredImage'),
    sourceArticleId: typeof sourceArticleId === 'string' ? sourceArticleId : null,
    category: readOptionalCategory(value.category),
    translations: readTranslations(value.translations),
  };
}

function parseRecentNewsArticle(value: unknown): RecentNewsArticle | null {
  if (!isRecord(value)) return null;

  const slug = readRequiredString(value, 'slug');
  const title = readRequiredString(value, 'title');
  const language = readRequiredString(value, 'language');
  const publishedAt = readRequiredString(value, 'publishedAt');

  if (!slug || !title || !language || !publishedAt) return null;

  return {
    slug,
    title,
    language,
    publishedAt,
    updatedAt: readOptionalString(value, 'updatedAt'),
    status: readOptionalString(value, 'status'),
    category: readOptionalCategory(value.category),
  };
}

function readNonNegativeInteger(record: UnknownRecord, key: string): number | null {
  const value = record[key];
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function readPositiveInteger(record: UnknownRecord, key: string): number | null {
  const value = record[key];
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

async function fetchSeoJson(endpoint: string): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SEO_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: SEO_REVALIDATE_SECONDS },
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SEO API request failed: ${response.status} ${response.statusText}`);
    }

    try {
      return await response.json();
    } catch {
      throw new Error('SEO API returned invalid JSON');
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`SEO API request timed out after ${SEO_FETCH_TIMEOUT_MS}ms`);
    }

    throw error instanceof Error ? error : new Error('SEO API request failed');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getSeoArticles(page: number, limit: number): Promise<SeoArticlesPage> {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error(`Invalid SEO article page: ${page}`);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error(`Invalid SEO article page size: ${limit}`);
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const endpoint = `/api/seo/articles?${params.toString()}`;
  const payload = await fetchSeoJson(endpoint);

  if (!isRecord(payload) || !Array.isArray(payload.articles) || !isRecord(payload.pagination)) {
    throw new Error('SEO articles response has an invalid shape');
  }

  const pagination = payload.pagination;
  const responsePage = readPositiveInteger(pagination, 'page');
  const responseLimit = readPositiveInteger(pagination, 'limit');
  const total = readNonNegativeInteger(pagination, 'total');
  const pages = readPositiveInteger(pagination, 'pages') ?? readPositiveInteger(pagination, 'totalPages');

  if (!responsePage || !responseLimit || total === null || !pages) {
    throw new Error('SEO articles response has invalid pagination metadata');
  }

  const articles = payload.articles.flatMap((article, index) => {
    const parsedArticle = parseSeoArticle(article);
    if (!parsedArticle) {
      console.warn(`Skipping malformed SEO article on page ${page}, item ${index}`);
      return [];
    }

    return [parsedArticle];
  });

  return {
    articles,
    pagination: {
      page: responsePage,
      limit: responseLimit,
      total,
      pages,
    },
  };
}

export async function getAllSeoArticles(): Promise<SeoArticle[]> {
  const pageSize = 100;
  const firstPage = await getSeoArticles(1, pageSize);
  const totalPages = firstPage.pagination.pages;

  if (totalPages > 1000) {
    throw new Error(`SEO article pagination is invalid: ${totalPages} pages`);
  }

  const allArticles = [...firstPage.articles];
  const remainingPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
  const concurrency = 4;

  for (let index = 0; index < remainingPages.length; index += concurrency) {
    const pageBatch = remainingPages.slice(index, index + concurrency);
    const pageResults = await Promise.all(
      pageBatch.map(async (page) => {
        const result = await getSeoArticles(page, pageSize);

        if (result.pagination.pages !== totalPages || result.pagination.page !== page) {
          throw new Error(`SEO article pagination metadata changed on page ${page}`);
        }

        return result.articles;
      })
    );

    allArticles.push(...pageResults.flat());
  }

  const deduplicated = new Map<string, SeoArticle>();

  for (const article of allArticles) {
    if (article.status !== 'PUBLISHED') continue;

    const key = `${article.language.toUpperCase()}:${article.slug}`;
    if (!deduplicated.has(key)) {
      deduplicated.set(key, article);
    }
  }

  return Array.from(deduplicated.values());
}

export async function getRecentNewsArticles(): Promise<RecentNewsArticle[]> {
  const payload = await fetchSeoJson('/api/seo/recent-news');

  if (!isRecord(payload) || !Array.isArray(payload.articles)) {
    throw new Error('Recent news response has an invalid shape');
  }

  return payload.articles.flatMap((article, index) => {
    const parsedArticle = parseRecentNewsArticle(article);
    if (!parsedArticle) {
      console.warn(`Skipping malformed recent-news article at item ${index}`);
      return [];
    }

    return [parsedArticle];
  });
}
