import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const validCategories = [
  'business',
  'politics',
  'sports',
  'entertainment',
  'national',
  'technology',
  'health',
  'science'
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!validCategories.includes(slug)) {
    return {};
  }

  const categoryTitles = {
    business: { en: 'Business Videos', hi: 'बिजनेस वीडियो' },
    politics: { en: 'Politics Videos', hi: 'राजनीति वीडियो' },
    sports: { en: 'Sports Videos', hi: 'खेल वीडियो' },
    entertainment: { en: 'Entertainment Videos', hi: 'मनोरंजन वीडियो' },
    national: { en: 'National Videos', hi: 'राष्ट्रीय वीडियो' },
    technology: { en: 'Technology Videos', hi: 'तकनीक वीडियो' },
    health: { en: 'Health Videos', hi: 'स्वास्थ्य वीडियो' },
    science: { en: 'Science Videos', hi: 'विज्ञान वीडियो' }
  };

  const title = categoryTitles[slug as keyof typeof categoryTitles]?.[locale as 'en' | 'hi'] ||
               categoryTitles[slug as keyof typeof categoryTitles]?.en ||
               'Videos';

  return {
    title: `${title} | The Cliff News`,
    description: `Watch the latest ${slug} videos from The Cliff News.`,
  };
}

export async function generateStaticParams() {
  const params = [];
  for (const locale of ['en', 'hi']) {
    for (const category of validCategories) {
      params.push({ locale, slug: category });
    }
  }
  return params;
}

export default async function VideoCategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // Validate locale and category
  if (!['en', 'hi'].includes(locale) || !validCategories.includes(slug)) {
    notFound();
  }

  const categoryNames = {
    business: { en: 'Business', hi: 'बिजनेस' },
    politics: { en: 'Politics', hi: 'राजनीति' },
    sports: { en: 'Sports', hi: 'खेल' },
    entertainment: { en: 'Entertainment', hi: 'मनोरंजन' },
    national: { en: 'National', hi: 'राष्ट्रीय' },
    technology: { en: 'Technology', hi: 'तकनीक' },
    health: { en: 'Health', hi: 'स्वास्थ्य' },
    science: { en: 'Science', hi: 'विज्ञान' }
  };

  const categoryName = categoryNames[slug as keyof typeof categoryNames]?.[locale as 'en' | 'hi'] ||
                      categoryNames[slug as keyof typeof categoryNames]?.en ||
                      slug;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{categoryName} Videos</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for video content */}
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
            <span className="text-gray-500">Video Thumbnail</span>
          </div>
          <h3 className="font-semibold mb-2">Sample {categoryName} Video</h3>
          <p className="text-gray-600 text-sm">
            This is a placeholder for {categoryName.toLowerCase()} video content.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
            <span className="text-gray-500">Video Thumbnail</span>
          </div>
          <h3 className="font-semibold mb-2">Another {categoryName} Video</h3>
          <p className="text-gray-600 text-sm">
            More {categoryName.toLowerCase()} video content coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}