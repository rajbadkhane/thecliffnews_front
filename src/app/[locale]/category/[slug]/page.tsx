import { notFound } from 'next/navigation';
import { getNewsByCategory } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CategoryArticlesList from '@/components/CategoryArticlesList';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

// Generate static params for known categories
export async function generateStaticParams() {
  const categories = [
    'national',
    'international',
    'politics',
    'business',
    'sports',
    'entertainment',
    'technology',
    'health',
    'science',
    'lifestyle'
  ];

  return categories.map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = params;

  try {
    // Fetch first page of category articles
    const language = locale === 'hi' ? 'HINDI' : 'ENGLISH';
    const response = await getNewsByCategory(slug, 1, 12, language);

    if (!response?.articles || response.articles.length === 0) {
      notFound();
    }

    const { articles, totalPages } = response;

    // Get category name from first article or capitalize slug
    const categoryName = articles[0]?.category?.name ||
                        slug.charAt(0).toUpperCase() + slug.slice(1);

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <Link href={`/${locale}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
            </div>
          </div>
        </div>

        {/* Articles Grid with Infinite Scroll */}
        <div className="container mx-auto px-4 py-8">
          <CategoryArticlesList
            initialArticles={articles}
            categorySlug={slug}
            totalPages={totalPages}
            locale={locale}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching category articles:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${categoryName} - The Cliff News`,
    description: `Latest ${categoryName.toLowerCase()} news and updates from The Cliff News`,
  };
}
