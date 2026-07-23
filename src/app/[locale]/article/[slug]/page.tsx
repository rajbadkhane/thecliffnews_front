import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from '@/components/ArticleContent';
import type { Article } from '@/services/articles';
import { getArticleUrl } from '@/lib/slug';

const SITE_URL = 'https://www.thecliffnews.in';

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
  searchParams: Promise<{
    from?: string;
    index?: string;
  }>;
}

// Helper function to strip HTML tags for clean LLM article body reading
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getArticleCanonicalUrl(locale: string, article: Article): string {
  return `${SITE_URL}${getArticleUrl(locale, article)}`;
}

type ArticleFetchResult =
  | { article: Article; notFound: false }
  | { article: null; notFound: true };

async function fetchArticle(slug: string, locale: string): Promise<ArticleFetchResult> {
  const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${slug}?language=${language}`,
    { cache: 'no-store' }
  );

  if (response.status === 404) {
    return { article: null, notFound: true };
  }

  if (!response.ok) {
    throw new Error(`Article request failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.article) {
    throw new Error('Article response did not include an article');
  }

  return { article: data.article, notFound: false };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await fetchArticle(slug, locale);

  if (result.notFound) {
    return {
      title: 'Article Not Found',
      alternates: {
        canonical: null,
        languages: {},
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const article = result.article;

  const excerptText = article.excerpt || article.metaDescription || '';
  const canonicalUrl = getArticleCanonicalUrl(locale, article);
  const languageAlternates = {
    [locale]: canonicalUrl,
    ...(locale === 'en' ? { 'x-default': canonicalUrl } : {}),
  };

  return {
    title: article.title,
    description: excerptText,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title: article.title,
      description: excerptText,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author.name] : [],
      locale: locale === 'hi' ? 'hi_IN' : 'en_US',
      siteName: 'The Cliff News',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: excerptText,
      images: article.featuredImage ? [article.featuredImage] : [],
    }
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { slug, locale } = await params;
  const { from, index } = await searchParams;
  const isFromInshorts = from === 'inshorts';
  const inshortsIndex = index;

  // Fetch article data on the server for JSON-LD Injection and Server Side Rendering (SSR)
  const result = await fetchArticle(slug, locale);
  if (result.notFound) {
    notFound();
  }
  const article = result.article;

  // Create rich JSON-LD NewsArticle schema
  let jsonLd = null;
  if (article) {
    const cleanBody = stripHtml(article.content);
    const canonicalUrl = getArticleCanonicalUrl(locale, article);
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": locale === 'hi' ? 'होम' : 'Home',
        "item": `${SITE_URL}/${locale}`,
      },
      ...(article.category?.slug
        ? [{
            "@type": "ListItem",
            "position": 2,
            "name": article.category.name,
            "item": `${SITE_URL}/${locale}/category/${article.category.slug}`,
          }]
        : []),
      {
        "@type": "ListItem",
        "position": article.category?.slug ? 3 : 2,
        "name": article.title,
        "item": canonicalUrl,
      },
    ];
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.excerpt || article.metaDescription || article.title,
      "image": article.featuredImage ? [article.featuredImage] : [],
      "datePublished": article.publishedAt,
      "author": {
        "@type": "Person",
        "name": article.author?.name || "The Cliff News Team"
      },
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "The Cliff News",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.thecliffnews.in/dark-logo.png"
        }
      },
      "mainEntityOfPage": canonicalUrl,
      "articleBody": cleanBody,
      "inLanguage": locale === 'hi' ? 'hi-IN' : 'en-US',
      "keywords": article.tags || "",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems,
      },
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleContent
        slug={slug}
        locale={locale}
        isFromInshorts={isFromInshorts}
        inshortsIndex={inshortsIndex}
        initialArticle={article}
      />
    </>
  );
}
