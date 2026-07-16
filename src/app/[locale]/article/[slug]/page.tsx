import { Metadata } from 'next';
import ArticleContent from '@/components/ArticleContent';
import ArticleStoreFallbackRedirect from './ArticleStoreFallbackRedirect';
import type { Article } from '@/services/articles';

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

async function fetchArticle(slug: string, locale: string): Promise<Article | null> {
  const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${slug}?language=${language}`,
      { cache: 'no-store' }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.article || null;
  } catch (error) {
    console.error('Error fetching article inside server component:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await fetchArticle(slug, locale);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const excerptText = article.excerpt || article.metaDescription || '';

  return {
    title: article.title,
    description: excerptText,
    alternates: {
      canonical: `/${locale}/article/${slug}`,
      languages: {
        en: `/en/article/${slug}`,
        hi: `/hi/article/${slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: excerptText,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: article.author ? [article.author.name] : [],
      locale: locale === 'hi' ? 'hi_IN' : 'en_US',
      url: `https://www.thecliffnews.in/${locale}/article/${slug}`,
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
  const article = await fetchArticle(slug, locale);

  // Create rich JSON-LD NewsArticle schema
  let jsonLd = null;
  if (article) {
    const cleanBody = stripHtml(article.content);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.excerpt || article.metaDescription || article.title,
      "image": article.featuredImage ? [article.featuredImage] : [],
      "datePublished": article.publishedAt || article.createdAt,
      "dateModified": article.updatedAt || article.publishedAt || article.createdAt,
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
      "mainEntityOfPage": `https://www.thecliffnews.in/${locale}/article/${slug}`,
      "articleBody": cleanBody,
      "inLanguage": locale === 'hi' ? 'hi-IN' : 'en-US',
      "keywords": article.tags || ""
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
      <ArticleStoreFallbackRedirect />
      <ArticleContent
        slug={slug}
        locale={locale}
        isFromInshorts={isFromInshorts}
        inshortsIndex={inshortsIndex}
        initialArticle={article || undefined}
      />
    </>
  );
}
