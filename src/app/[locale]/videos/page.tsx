import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import VideosClient from './videos-client';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    en: 'Video Bytes | The Cliff News',
    hi: 'वीडियो बाइट्स | द क्लिफ न्यूज़'
  };

  const descriptions = {
    en: 'Watch the latest news videos, breaking stories, and exclusive content from The Cliff News video team.',
    hi: 'द क्लिफ न्यूज़ वीडियो टीम से नवीनतम समाचार वीडियो, ब्रेकिंग स्टोरीज और एक्सक्लूसिव कंटेंट देखें।'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      locale: locale,
    },
  };
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'hi' },
  ];
}

export default async function VideosPage({ params }: PageProps) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'hi'].includes(locale)) {
    notFound();
  }

  return <VideosClient locale={locale} />;
}