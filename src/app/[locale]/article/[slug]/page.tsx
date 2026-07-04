import { Metadata } from 'next';
import ArticleContent from '@/components/ArticleContent';
import ArticleStoreFallbackRedirect from './ArticleStoreFallbackRedirect';

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
  searchParams: {
    from?: string;
    index?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Fetch article data for metadata
  const { slug, locale } = await params;
  const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${slug}?language=${language}`,
    { cache: 'no-store' }
  ).then(res => res.json());

  const article = response?.article;

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt || article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.metaDescription,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author.name] : [],
    },
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { slug, locale } = await params;
  const { from, index } = await searchParams;
  const isFromInshorts = from === 'inshorts';
  const inshortsIndex = index;

  return (
    <>
      <ArticleStoreFallbackRedirect />
      <ArticleContent
        slug={slug}
        locale={locale}
        isFromInshorts={isFromInshorts}
        inshortsIndex={inshortsIndex}
      />
    </>
  );
}
